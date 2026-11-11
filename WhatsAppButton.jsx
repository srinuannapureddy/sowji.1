import React from 'react';
import { WHATSAPP } from './client.js';
export default function WhatsAppButton() {
  if (!WHATSAPP) return null;
  return (
    <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello Sowji Collections, I need help with a saree.')}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg">💬</a>
  );
}
