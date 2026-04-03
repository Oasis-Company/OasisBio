'use client';

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('@/components/ModelViewer').then(mod => mod.ModelViewer), { ssr: false });

interface ModelViewerWrapperProps {
  modelPath: string;
  mtlPath: string;
  texturePath: string;
  width: number;
  height: number;
}

export default function ModelViewerWrapper({ 
  modelPath, 
  mtlPath, 
  texturePath, 
  width, 
  height 
}: ModelViewerWrapperProps) {
  return (
    <ModelViewer 
      modelPath={modelPath}
      mtlPath={mtlPath}
      texturePath={texturePath}
      width={width} 
      height={height} 
    />
  );
}
