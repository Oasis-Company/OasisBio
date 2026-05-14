import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { DEO_DEFAULT_PROMPT, DIA_DEFAULT_PROMPT } from '@/lib/assistants/types';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  agent: z.enum(['deo', 'dia']),
  systemPrompt: z.string().optional(),
  apiEndpoint: z.string().nullable().optional(),
  apiKey: z.string().nullable().optional(),
  model: z.string().optional(),
  enabled: z.boolean().optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();

    const userWithProfiles = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        deoProfile: true,
        diaProfile: true,
      },
    });

    const deo = userWithProfiles?.deoProfile;
    const dia = userWithProfiles?.diaProfile;

    return NextResponse.json({
      deo: {
        systemPrompt: deo?.systemPrompt || DEO_DEFAULT_PROMPT,
        apiEndpoint: deo?.apiEndpoint,
        apiKey: deo?.apiKey ? '***' : null,
        model: deo?.model || 'gpt-4o',
        enabled: deo?.enabled ?? true,
        configured: !!deo?.apiEndpoint || !!deo?.apiKey,
      },
      dia: {
        systemPrompt: dia?.systemPrompt || DIA_DEFAULT_PROMPT,
        apiEndpoint: dia?.apiEndpoint,
        apiKey: dia?.apiKey ? '***' : null,
        model: dia?.model || 'gpt-4o',
        enabled: dia?.enabled ?? true,
        configured: !!dia?.apiEndpoint || !!dia?.apiKey,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validated = UpdateProfileSchema.parse(body);

    const profileField = validated.agent === 'deo' ? 'deoProfile' : 'diaProfile';
    const profileData: Record<string, unknown> = {
      systemPrompt: validated.systemPrompt,
      apiEndpoint: validated.apiEndpoint,
      apiKey: validated.apiKey,
      model: validated.model,
      enabled: validated.enabled,
    };

    Object.keys(profileData).forEach((key) => {
      if (profileData[key] === undefined) {
        delete profileData[key];
      }
    });

    const existing = await prisma.user.findUnique({
      where: { id: user.id },
      select: { [profileField]: true },
    });

    if (existing?.[profileField]) {
      await (prisma as unknown as Record<string, { update: (args: { where: { userId: string }; data: Record<string, unknown> }) => Promise<unknown> }>)[profileField].update({
        where: { userId: user.id },
        data: profileData,
      });
    } else {
      await (prisma as unknown as Record<string, { create: (args: { data: Record<string, unknown> }) => Promise<unknown> }>)[profileField].create({
        data: {
          userId: user.id,
          systemPrompt: profileData.systemPrompt || (validated.agent === 'deo' ? DEO_DEFAULT_PROMPT : DIA_DEFAULT_PROMPT),
          apiEndpoint: profileData.apiEndpoint,
          apiKey: profileData.apiKey,
          model: profileData.model || 'gpt-4o',
          enabled: profileData.enabled ?? true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body', details: error.issues }, { status: 400 });
    }
    return handleApiError(error);
  }
}
