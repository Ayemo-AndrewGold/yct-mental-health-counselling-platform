// Create a new client component for handling search params
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ClientSearchParamsProps {
  onSessionId: (id: string) => void;
}

export default function ClientSearchParams({ onSessionId }: ClientSearchParamsProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id') || generateSessionId();
    onSessionId(id);
  }, [searchParams, onSessionId]);

  return null;
}

function generateSessionId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'ANON-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}