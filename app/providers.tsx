'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';

// Mock Thirdweb provider until we can install the real package
export function ThirdwebProviderMock({ children }: { children: ReactNode }) {
  // This is a placeholder for the real Thirdweb provider
  // When you install the actual @thirdweb-dev/react package, replace with:
  // <ThirdwebProvider clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}>
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThirdwebProviderMock>
      <ToastProvider>{children}</ToastProvider>
    </ThirdwebProviderMock>
  );
}

export default Providers; 