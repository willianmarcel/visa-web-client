import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation(key => {
      if (key === 'token') return 'mock-token';
      return null;
    }),
  }),
}));

// Mock para o Window.fetch
global.fetch = jest.fn();

// Limpar todos os mocks entre os testes
beforeEach(() => {
  jest.clearAllMocks();
}); 