import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">OasisBio</h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
          跨时代的身份系统
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
            创建你的 OasisBio
          </button>
          <button className="px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-colors">
            了解更多
          </button>
        </div>
      </div>
    </div>
  );
}