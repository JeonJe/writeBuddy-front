import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { CorrectionsProvider } from '../contexts/CorrectionsContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  withAuth?: boolean;
  withCorrections?: boolean;
}

/**
 * Custom render function with providers for testing
 */
export const renderWithProviders = (
  ui: ReactElement,
  {
    withRouter = true,
    withAuth = true,
    withCorrections = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let content = <>{children}</>;

    if (withCorrections) {
      content = <CorrectionsProvider>{content}</CorrectionsProvider>;
    }

    if (withAuth) {
      content = <AuthProvider>{content}</AuthProvider>;
    }

    if (withRouter) {
      content = <BrowserRouter>{content}</BrowserRouter>;
    }

    return content;
  };

  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

/**
 * Render with only Router (no providers)
 */
export const renderWithRouter = (ui: ReactElement, options?: RenderOptions) => {
  const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );

  return render(ui, {
    wrapper: RouterWrapper,
    ...options,
  });
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));
