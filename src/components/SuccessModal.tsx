'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Twitter, MessageCircle, Link2, Copy, Check, Share2 } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  bioName: string;
  bioSlug: string;
  onPublishNow: () => void;
  onContinueEditing: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  rotation: number;
}

function QRCodeSVG({ url, size = 160 }: { url: string; size?: number }) {
  const cellSize = 6;
  const qrData = url.split('').map((c, i) => (c.charCodeAt(0) + i) % 2);
  const gridSize = Math.min(21, Math.ceil(Math.sqrt(qrData.length * 2)));
  const cells = [];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const isPositionPattern = 
        (x < 3 && y < 3) ||
        (x < 3 && y > gridSize - 4) ||
        (x > gridSize - 4 && y < 3);
      const isDataCell = qrData[(y * gridSize + x) % qrData.length] === 1;
      if (isPositionPattern || isDataCell) {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x * cellSize}
            y={y * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#000"
          />
        );
      }
    }
  }
  
  const svgSize = gridSize * cellSize;
  
  return (
    <div className="inline-flex items-center justify-center bg-white p-4 rounded-lg border border-muted">
      <svg width={size} height={size} viewBox={`0 0 ${svgSize} ${svgSize}`} className="block">
        <rect width={svgSize} height={svgSize} fill="#fff" />
        {cells}
      </svg>
    </div>
  );
}

export function SuccessModal({
  isOpen,
  bioName,
  bioSlug,
  onPublishNow,
  onContinueEditing,
}: SuccessModalProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/bio/${bioSlug}` 
    : `/bio/${bioSlug}`;
  
  const shareText = `Check out my character "${bioName}" on OasisBio!`;

  useEffect(() => {
    if (isOpen) {
      const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];
      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 8,
        rotation: Math.random() * 360,
      }));
      setConfettiPieces(pieces);
      setCopied(false);
      setShowQR(false);
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleWechatShare = () => {
    setShowQR(!showQR);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onContinueEditing}
      />

      <div className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full p-8 text-center overflow-hidden">
        <div className="confetti-container absolute inset-0 pointer-events-none overflow-hidden">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece absolute"
              style={{
                left: `${piece.x}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>

          <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>

          <p className="text-muted-foreground mb-6">
            Your character <span className="font-semibold text-foreground">{bioName}</span> has been created successfully!
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Share</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <button
                onClick={handleTwitterShare}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors border border-transparent hover:border-[#1DA1F2]/30"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-6 h-6 text-[#1DA1F2]" />
                <span className="text-xs font-medium text-[#1DA1F2]">Twitter</span>
              </button>

              <button
                onClick={handleWechatShare}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#07C160]/10 hover:bg-[#07C160]/20 transition-colors border border-transparent hover:border-[#07C160]/30"
                aria-label="Share via WeChat QR"
              >
                <MessageCircle className="w-6 h-6 text-[#07C160]" />
                <span className="text-xs font-medium text-[#07C160]">WeChat</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors border border-transparent hover:border-muted-foreground/30"
                aria-label="Copy link"
              >
                {copied ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <Copy className="w-6 h-6 text-muted-foreground" />
                )}
                <span className={`text-xs font-medium ${copied ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>
            </div>

            {showQR && (
              <div className="mb-4 p-4 bg-muted/30 rounded-xl text-center animate-in fade-in zoom-in duration-200">
                <p className="text-sm text-muted-foreground mb-3">Scan to view on mobile</p>
                <QRCodeSVG url={shareUrl} />
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">PUBLIC URL</p>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded flex-1 truncate">
                  {shareUrl}
                </code>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onPublishNow} size="lg" className="w-full">
              Publish Now
            </Button>
            <Button onClick={onContinueEditing} variant="ghost" size="md" className="w-full">
              Continue Editing Later
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .confetti-piece {
          top: -20px;
          border-radius: 2px;
          animation: confetti-fall linear forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
