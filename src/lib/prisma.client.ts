// Mock version of prisma for client-side use
// This prevents client-side code from importing the real prisma client
// Expanded mock with common models used in client-side code

const mockModel = (name: string) => ({
  findUnique: async (args: any) => null,
  findMany: async (args: any) => [],
  create: async (args: any) => ({}),
  update: async (args: any) => ({}),
  delete: async (args: any) => ({}),
  upsert: async (args: any) => ({}),
  count: async (args: any) => 0,
});

export const prisma = {
  // Existing mocks
  user: mockModel('user'),
  
  // Models referenced in client-side code
  nuwaSuggestion: mockModel('nuwaSuggestion'),
  nuwaRun: mockModel('nuwaRun'),
  oasisBio: mockModel('oasisBio'),
  worldItem: mockModel('worldItem'),
  eraIdentity: mockModel('eraIdentity'),
  ability: mockModel('ability'),
  referenceItem: mockModel('referenceItem'),
  worldDocument: mockModel('worldDocument'),
  
  // Transaction support
  $transaction: async (fn: any) => {
    console.warn('prisma.$transaction called in client-side mock');
    return null;
  },
} as any;