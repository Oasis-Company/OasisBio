import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { importService } from '@/services/importService';

// POST /api/import
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/zip') {
      return NextResponse.json({ error: 'File must be a ZIP file' }, { status: 400 });
    }

    // importService scopes all created records to userId — no cross-user data risk
    const result = await importService.importCharacters({
      userId: user.id,
      file,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
