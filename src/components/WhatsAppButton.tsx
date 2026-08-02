import React from "react";
import { IconWhatsApp } from "./Icons";

export const WhatsAppButton: React.FC = () => (
  <a
    href="https://wa.me/573001234567?text=Hola%2C%20Ricaurte%20Mascotas%20%F0%9F%90%BE%20quiero%20informaci%C3%B3n%20sobre%20sus%20prendas%20hechas%20a%20mano"
    target="_blank"
    rel="noreferrer"
    aria-label="Chatea con nosotros por WhatsApp"
    className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-[60] w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform whatsapp-button"
  >
    <IconWhatsApp className="w-6 h-6 sm:w-7 sm:h-7" />
    <span
      className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping"
      style={{ animationDuration: "2.5s" }}
      aria-hidden="true"
    />
  </a>
);
