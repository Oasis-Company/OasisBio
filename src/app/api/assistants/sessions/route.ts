import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateSessionSchema = z.object({
  agent: z.enum(['deo', 'dia']).optional(),
  title: z.string().max(200).optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();

    const sessions = await prisma.assistantSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        agent: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        agent: s.agent,
        title: s.title,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        messageCount: s._count.messages,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const parsed = CreateSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: parsed.error.message } },
        { status: 400 }
      );
    }

    const session = await prisma.assistantSession.create({
      data: {
        userId: user.id,
        agent: parsed.data.agent || 'deo',
        title: parsed.data.title || '新对话',
      },
    });

    return NextResponse.json(
      {
        id: session.id,
        agent: session.agent,
        title: session.title,
        createdAt: session.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
