import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { routeMessage } from '@/lib/assistants/router';
import { getDeoResponse } from '@/lib/assistants/agents/deo';
import { getDiaResponse } from '@/lib/assistants/agents/dia';
import { getUserPermissions } from '@/lib/assistants/permissions';
import { LlmClientError } from '@/lib/assistants/llm-client';
import type { AgentType, ChatRequest, RoutingResult } from '@/lib/assistants/types';
import { z } from 'zod';

const ChatRequestSchema = z.object({
  sessionId: z.string().optional(),
  agent: z.enum(['deo', 'dia']).optional(),
  message: z.string().min(1).max(4000),
  context: z.object({
    currentBioId: z.string().optional(),
    currentWorldId: z.string().optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validated = ChatRequestSchema.parse(body);
    const { sessionId, agent: forceAgent, message, context } = validated;

    await getUserPermissions(user.id);

    let session;
    if (sessionId) {
      session = await prisma.assistantSession.findFirst({
        where: {
          id: sessionId,
          userId: user.id,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 20,
          },
        },
      });

      if (!session) {
        return NextResponse.json(
          { error: { code: 'SESSION_NOT_FOUND', message: 'Session not found' } },
          { status: 404 }
        );
      }
    } else {
      session = await prisma.assistantSession.create({
        data: {
          userId: user.id,
          agent: forceAgent || 'deo',
          title: message.slice(0, 50),
        },
        include: {
          messages: true,
        },
      });
    }

    const routing = routeMessage(message, forceAgent as AgentType | undefined);

    await prisma.assistantMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message,
        metadata: { routing: routing as any, context },
      },
    });

    if (routing.primaryAgent !== session.agent) {
      await prisma.assistantSession.update({
        where: { id: session.id },
        data: { agent: routing.primaryAgent },
      });
    }

    const profileField = routing.primaryAgent === 'deo' ? 'deoProfile' : 'diaProfile';
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        deoProfile: true,
        diaProfile: true,
      },
    });

    const agentProfile = profile?.[profileField];

    if (!agentProfile || !agentProfile.enabled) {
      return NextResponse.json(
        { error: { code: 'AGENT_NOT_ENABLED', message: `${routing.primaryAgent === 'deo' ? 'Deo' : 'Dia'} is not enabled` } },
        { status: 400 }
      );
    }

    const apiEndpoint = agentProfile.apiEndpoint || process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    const apiKey = agentProfile.apiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: { code: 'API_KEY_NOT_CONFIGURED', message: 'API key not configured' } },
        { status: 400 }
      );
    }

    const conversationHistory = session.messages.map((msg) => ({
      role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content,
    }));

    let response: string;
    try {
      if (routing.primaryAgent === 'deo') {
        response = await getDeoResponse(
          message,
          {
            systemPrompt: agentProfile.systemPrompt,
            apiEndpoint,
            apiKey,
            model: agentProfile.model,
          },
          conversationHistory
        );
      } else {
        response = await getDiaResponse(
          message,
          {
            systemPrompt: agentProfile.systemPrompt,
            apiEndpoint,
            apiKey,
            model: agentProfile.model,
          },
          conversationHistory
        );
      }
    } catch (error) {
      if (error instanceof LlmClientError) {
        return NextResponse.json(
          { error: { code: 'AI_SERVICE_ERROR', message: `AI service error: ${error.message}` } },
          { status: 502 }
        );
      }
      throw error;
    }

    await prisma.assistantMessage.create({
      data: {
        sessionId: session.id,
        role: routing.primaryAgent,
        content: response,
        metadata: { routing: routing as any },
      },
    });

    await prisma.assistantSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      sessionId: session.id,
      agent: routing.primaryAgent,
      response,
      routing: {
        primary: routing.primaryAgent,
        secondary: routing.secondaryAgent,
        confidence: routing.confidence,
        reason: routing.reason,
      },
    });

  } catch (error) {
    console.error('[assistants/chat] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid request body', details: error.issues } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
