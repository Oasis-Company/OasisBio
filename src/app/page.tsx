import React from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              OasisBio
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-muted-foreground">
              跨时代的身份系统
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">创建你的 OasisBio</Button>
              <Button size="lg" variant="secondary">了解更多</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h2>
            <p className="text-muted-foreground">
              OasisBio 提供了一套完整的身份系统，让你可以创建和管理自己的数字身份
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>个人资料管理</CardTitle>
                <CardDescription>创建和管理你的个人基本信息</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• 基本信息（姓名、生日、性别）</li>
                  <li>• 自定义头像</li>
                  <li>• 个人简介</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>能力池</CardTitle>
                <CardDescription>添加和管理你的技能和能力</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• 自定义能力</li>
                  <li>• 官方预设能力</li>
                  <li>• 能力等级管理</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>储存库</CardTitle>
                <CardDescription>管理你的个人文档和资源</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• 个人文档（dcos）</li>
                  <li>• 参考资料（URL）</li>
                  <li>• 世界观仓库</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">开始你的 OasisBio 之旅</h2>
            <p className="text-xl mb-10 text-muted-foreground">
              创建一个属于你自己的数字身份，探索无限可能
            </p>
            <Button size="lg">立即开始</Button>
          </div>
        </div>
      </section>
    </div>
  );
}