import React from 'react';
import { MarketingHeader } from './MarketingHeader';
import { MarketingFooter } from './MarketingFooter';

export const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white antialiased font-sans">
      <MarketingHeader />
      <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
      <MarketingFooter />
    </div>
  );
};
