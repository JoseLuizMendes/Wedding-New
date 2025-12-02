import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';

// Mock fetch globally
global.fetch = jest.fn();

// Suppress console errors in tests (optional, can be removed if you want to see errors)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string') {
      // Suppress known expected errors
      if (
        args[0].includes('Warning: ReactDOM.render is no longer supported') ||
        args[0].includes('Erro ao enviar RSVP') ||
        args[0].includes('Erro ao carregar presentes') ||
        args[0].includes('Erro ao reservar') ||
        args[0].includes('Erro ao marcar') ||
        args[0].includes('Erro ao cancelar') ||
        args[0].includes('Erro ao confirmar')
      ) {
        return;
      }
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
