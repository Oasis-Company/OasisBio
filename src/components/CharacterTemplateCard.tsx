// 'use client';
// 
// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
// import { Button } from '@/components/Button';
// import { CharacterTemplate, encodeTemplateData } from '@/lib/character-templates';
// import { useRouter } from 'next/navigation';
// 
// interface CharacterTemplateCardProps {
//   template: CharacterTemplate;
// }
// 
// export function CharacterTemplateCard({ template }: CharacterTemplateCardProps) {
//   const router = useRouter();
// 
//   const handleUseTemplate = () => {
//     const encoded = encodeTemplateData(template.data);
//     router.push(`/dashboard/oasisbios/new?template=${encoded}`);
//   };
// 
//   return (
//     <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div>
//             <div className="text-2xl mb-2">{template.icon}</div>
//             <CardTitle className="text-lg">{template.name}</CardTitle>
//           </div>
//           <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
//             {template.category}
//           </span>
//         </div>
//       </CardHeader>
//       <CardContent className="flex-1 flex flex-col">
//         <p className="text-sm text-muted-foreground mb-4">
//           {template.description}
//         </p>
//         <div className="bg-muted/30 rounded-lg p-3 mb-4">
//           <p className="font-medium text-sm">{template.preview.title}</p>
//           <p className="text-xs text-muted-foreground">{template.preview.tagline}</p>
//         </div>
//         <div className="mt-auto">
//           <Button onClick={handleUseTemplate} className="w-full">
//             使用此模板
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
