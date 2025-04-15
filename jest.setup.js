// Add any global Jest setup here
import '@testing-library/jest-dom';

// Add custom jest matchers
expect.extend({
  // Custom matchers can be added here
});

// Setup global mocks
global.fetch = jest.fn();
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock global objects if needed
// Example:
// global.fetch = jest.fn(); 