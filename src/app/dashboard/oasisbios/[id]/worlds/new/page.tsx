import React from 'react';
import { StepWizard } from '@/components/world/StepWizard';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewWorldPage({ params }: Props) {
  const { id: oasisBioId } = await params;
  return <StepWizard oasisBioId={oasisBioId} />;
}
