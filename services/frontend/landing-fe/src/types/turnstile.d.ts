/**
 * Type declarations for Cloudflare Turnstile widget
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
 */

interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'invisible';
  tabindex?: number;
  action?: string;
  cData?: string;
  'response-field'?: boolean;
  'response-field-name'?: string;
}

interface Turnstile {
  render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  getResponse: (widgetId?: string) => string | undefined;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
    onTurnstileLoad?: () => void;
  }
}

export {};
