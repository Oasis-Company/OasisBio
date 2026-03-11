'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';

// Mock data for the model
const modelData = {
  id: 1,
  name: 'Oasis Prime',
  objUrl: '/models/oasis-prime.obj',
  mtlUrl: '/models/oasis-prime.mtl',
  previewImage: 'https://via.placeholder.com/300x300?text=Oasis+Prime',
  relatedWorldId: null,
  relatedEraId: null,
  uploadedAt: '2024-01-15T10:00:00Z',
};

export default function ModelPreviewPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Simple 3D preview using Three.js
    // In a real implementation, this would load and render the OBJ file
    if (!canvasRef.current) return;

    // Mock 3D rendering setup
    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Create a simple animation to simulate 3D rendering
    let rotation = 0;
    const context = canvas.getContext('2d');
    if (!context) return;

    const animate = () => {
      context.clearRect(0, 0, width, height);
      
      // Draw a rotating cube as a placeholder
      context.save();
      context.translate(width / 2, height / 2);
      context.rotate(rotation);
      
      // Draw cube faces
      context.fillStyle = '#333';
      context.fillRect(-50, -50, 100, 100);
      
      context.fillStyle = '#555';
      context.beginPath();
      context.moveTo(-50, -50);
      context.lineTo(0, -75);
      context.lineTo(50, -50);
      context.lineTo(0, -25);
      context.closePath();
      context.fill();
      
      context.fillStyle = '#777';
      context.beginPath();
      context.moveTo(50, -50);
      context.lineTo(75, 0);
      context.lineTo(50, 50);
      context.lineTo(25, 0);
      context.closePath();
      context.fill();
      
      context.restore();
      
      rotation += 0.01;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Model Preview</h1>
            <p className="text-gray-600">Preview and interact with your 3D model</p>
          </div>
          <Button asChild>
            <a href="/dashboard/models">Back to Models</a>
          </Button>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle>{modelData.name}</CardTitle>
            <CardDescription>Uploaded: {new Date(modelData.uploadedAt).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 3D Viewer */}
              <div className="lg:col-span-2">
                <div className="aspect-[16/9] bg-gray-100 rounded-md overflow-hidden">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full"
                  />
                </div>
                
                {/* Controls */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm">Rotate</Button>
                  <Button size="sm">Zoom In</Button>
                  <Button size="sm">Zoom Out</Button>
                  <Button size="sm">Reset View</Button>
                  <div className="ml-auto">
                    <Button size="sm">Change Background</Button>
                  </div>
                </div>
              </div>

              {/* Model Info */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Model Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">File Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">OBJ File</span>
                            <span className="text-sm">{modelData.objUrl.split('/').pop()}</span>
                          </div>
                          {modelData.mtlUrl && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">MTL File</span>
                              <span className="text-sm">{modelData.mtlUrl.split('/').pop()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Associations</h3>
                        <div className="space-y-2">
                          {modelData.relatedWorldId ? (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Related World</span>
                              <span className="text-sm">Neon Desert</span>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Related World</span>
                              <span className="text-sm text-gray-500">None</span>
                            </div>
                          )}
                          {modelData.relatedEraId ? (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Related Era</span>
                              <span className="text-sm">Future</span>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Related Era</span>
                              <span className="text-sm text-gray-500">None</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Actions</h3>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            Download Model
                          </Button>
                          <Button size="sm" variant="secondary" className="w-full">
                            Update Model
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            Delete Model
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}