'use client';

import React, { useEffect, useState } from 'react';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';

const playfairDisplay = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] });
const interLight = Inter({ subsets: ['latin'], weight: '300' });
const interBold = Inter({ subsets: ['latin'], weight: '700' });

interface Quote {
  text: string;
  author: string;
  titleFont: string;
  authorFont: string;
  titleClassName: string;
  authorClassName: string;
}

const quotes: Quote[] = [
  {
    text: "We are what we remember.",
    author: "Jorge Luis Borges",
    titleFont: 'Playfair Display',
    authorFont: 'Inter',
    titleClassName: playfairDisplay.className,
    authorClassName: inter.className
  },
  {
    text: "Identity is not a fixed thing, but a process.",
    author: "Stuart Hall",
    titleFont: 'Inter',
    authorFont: 'JetBrains Mono',
    titleClassName: `${interBold.className} uppercase`,
    authorClassName: jetBrainsMono.className
  },
  {
    text: "The self is not something ready-made, but something in continuous formation.",
    author: "John Dewey",
    titleFont: 'Inter',
    authorFont: 'Inter Light',
    titleClassName: inter.className,
    authorClassName: interLight.className
  },
  {
    text: "We tell ourselves stories in order to live.",
    author: "Joan Didion",
    titleFont: 'Playfair Display',
    authorFont: 'Inter',
    titleClassName: playfairDisplay.className,
    authorClassName: inter.className
  },
  {
    text: "I am not what happened to me, I am what I choose to become.",
    author: "Carl Jung",
    titleFont: 'Playfair Display',
    authorFont: 'JetBrains Mono',
    titleClassName: playfairDisplay.className,
    authorClassName: jetBrainsMono.className
  },
  {
    text: "Time is the substance I am made of.",
    author: "Jorge Luis Borges",
    titleFont: 'Inter',
    authorFont: 'JetBrains Mono',
    titleClassName: inter.className,
    authorClassName: jetBrainsMono.className
  },
  {
    text: "The individual is not a stable unit, but a dynamic system.",
    author: "Anonymous",
    titleFont: 'JetBrains Mono',
    authorFont: 'Inter',
    titleClassName: jetBrainsMono.className,
    authorClassName: inter.className
  }
];

export function QuoteDisplay() {
  const [selectedQuote, setSelectedQuote] = useState<Quote>(quotes[0]);

  useEffect(() => {
    // 随机选择一条名言
    // Use crypto for consistent randomness
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % quotes.length;
    setSelectedQuote(quotes[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center text-center p-8 h-full transform transition-all duration-1000 animate-fadeIn">
      <div className="max-w-md mx-auto">
        <p 
          className={`text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight transform transition-all duration-700 ${selectedQuote.titleClassName}`}
        >
          "{selectedQuote.text}"
        </p>
        <p 
          className={`text-sm md:text-base opacity-80 transform transition-all duration-700 ${selectedQuote.authorClassName}`}
        >
          — {selectedQuote.author}
        </p>
      </div>
    </div>
  );
}