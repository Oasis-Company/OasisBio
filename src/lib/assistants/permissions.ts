import { prisma } from '@/lib/prisma';
import type { PermissionLevel, AssistantPermissions } from './types';
import { DEFAULT_PERMISSIONS } from './types';

export class PermissionError extends Error {
  public readonly requiredPermission: string;

  constructor(message: string, requiredPermission: string) {
    super(message);
    this.name = 'PermissionError';
    this.requiredPermission = requiredPermission;
  }
}

export async function getUserPermissions(userId: string): Promise<{
  level: PermissionLevel;
  permissions: AssistantPermissions;
}> {
  const permission = await prisma.assistantPermission.findUnique({
    where: { userId },
  });

  if (!permission) {
    return {
      level: 'read',
      permissions: DEFAULT_PERMISSIONS,
    };
  }

  return {
    level: permission.level as PermissionLevel,
    permissions: permission.permissions as unknown as AssistantPermissions,
  };
}

export async function updateUserPermissions(
  userId: string,
  level?: PermissionLevel,
  permissions?: Partial<AssistantPermissions>
): Promise<void> {
  const existing = await prisma.assistantPermission.findUnique({
    where: { userId },
  });

  const currentPermissions = existing
    ? (existing.permissions as unknown as AssistantPermissions)
    : DEFAULT_PERMISSIONS;

  const newPermissions: AssistantPermissions = {
    ...currentPermissions,
    ...permissions,
  };

  if (existing) {
    await prisma.assistantPermission.update({
      where: { userId },
      data: {
        level: level || existing.level,
        permissions: newPermissions as any,
      },
    });
  } else {
    await prisma.assistantPermission.create({
      data: {
        userId,
        level: level || 'read',
        permissions: newPermissions as any,
      },
    });
  }
}

export function checkPermission(
  userLevel: PermissionLevel,
  userPermissions: AssistantPermissions,
  requiredPermission: keyof AssistantPermissions
): boolean {
  if (userLevel === 'admin') {
    return true;
  }

  if (userLevel === 'write' && requiredPermission) {
    if (userPermissions[requiredPermission]) {
      return true;
    }
    return false;
  }

  if (userLevel === 'read') {
    return true;
  }

  return (userPermissions[requiredPermission] as boolean) || false;
}

export function canPerformOperation(
  level: PermissionLevel,
  operation: 'read' | 'write' | 'delete'
): boolean {
  switch (level) {
    case 'admin':
      return true;
    case 'write':
      return operation === 'read' || operation === 'write';
    case 'read':
      return operation === 'read';
    default:
      return false;
  }
}

export function getPermissionDescription(level: PermissionLevel): string {
  switch (level) {
    case 'admin':
      return '完全控制权限 - 可以执行所有操作，包括删除数据';
    case 'write':
      return '读写权限 - 可以读取和修改数据';
    case 'read':
      return '只读权限 - 只能查看数据，不能修改';
  }
}

export function getPermissionLabels(): Record<PermissionLevel, string> {
  return {
    admin: '完全控制 (Admin)',
    write: '读写权限 (Write)',
    read: '只读权限 (Read)',
  };
}
