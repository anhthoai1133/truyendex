"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Component wrapper để tránh hydration errors cho client-only content
const NoSSR = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false
});
