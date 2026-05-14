import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { getUserPermissions, updateUserPermissions, getPermissionLabels, getPermissionDescription } from '@/lib/assistants/permissions';
import type { PermissionLevel } from '@/lib/assistants/types';
import { z } from 'zod';

const UpdatePermissionSchema = z.object({
  level: z.enum(['read', 'write', 'admin']).optional(),
  permissions: z.object({
    canRead: z.boolean().optional(),
    canWrite: z.boolean().optional(),
    canDelete: z.boolean().optional(),
    canManageAssistant: z.boolean().optional(),
    canManageUsers: z.boolean().optional(),
    canExportData: z.boolean().optional(),
  }).optional(),
});

export async function GET() {
  try {
    const user = await requireAuth();

    const { level, permissions } = await getUserPermissions(user.id);

    return NextResponse.json({
      level,
      permissions,
      labels: getPermissionLabels(),
      description: getPermissionDescription(level),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validated = UpdatePermissionSchema.parse(body);

    await updateUserPermissions(
      user.id,
      validated.level as PermissionLevel | undefined,
      validated.permissions
    );

    const updated = await getUserPermissions(user.id);

    return NextResponse.json({
      level: updated.level,
      permissions: updated.permissions,
      labels: getPermissionLabels(),
      description: getPermissionDescription(updated.level),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body', details: error.issues }, { status: 400 });
    }
    return handleApiError(error);
  }
}
