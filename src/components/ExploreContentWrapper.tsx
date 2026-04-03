'use client';

import dynamic from 'next/dynamic';

const ExploreContent = dynamic(() => import('@/components/ExploreContent'), { ssr: false });

export default function ExploreContentWrapper() {
  return <ExploreContent />;
}
