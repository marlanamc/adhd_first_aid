'use client';

import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    // Don't log the full key for security
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  }, []);

  return (
    <div className="p-4">
      <h1>Environment Test</h1>
      <p>Check the console for environment variable values.</p>
      <pre>
        NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set'}
      </pre>
    </div>
  );
} 