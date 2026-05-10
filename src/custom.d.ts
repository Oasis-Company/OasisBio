// Custom type declarations for testing-library/jest-dom
/// <reference types="@testing-library/jest-dom" />

declare global {
  // Prisma namespace for type annotations
  const Prisma: typeof import('@prisma/client').Prisma;
}

export {};
