import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PalindromeChecker from '../PalindromeChecker';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str) => str,
    i18n: {
      language: 'en',
    },
  }),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: '/tools/palindrome-checker',
  }),
  Link: ({ children }) => children,
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('PalindromeChecker', () => {
  it('should correctly identify a Unicode palindrome', () => {
    render(<PalindromeChecker />);
    const input = screen.getByLabelText('tools.palindromeChecker.textToCheck');
    const button = screen.getByRole('button', { name: 'tools.palindromeChecker.checkButton' });

    fireEvent.change(input, { target: { value: "À l'étape, épate-la !" } });
    fireEvent.click(button);

    expect(screen.getByText("tools.palindromeChecker.yesResult")).toBeInTheDocument();
  });
});
