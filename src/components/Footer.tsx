import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import {
  IconFacebook,
  IconInstagram,
  IconPaw,
  IconTikTok,
  IconWhatsApp,
} from "./Icons";

const PAYMENTS = ["Nequi", "Daviplata", "Bancolombia", "PSE", "Contra entrega"];

export const Footer: React.FC = () => {
  const { addToast } = useStore();

  return (
    <footer className="bg-ink text-pinky mt-20" aria-label="Pie de página">
      {/* Franja newsletter */}
      <div className="bg-gradient-to-r from-blush via-pinky to-mint px-4 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-ink">
              🐾 Suscríbete y recibe{" "}
              <span className="underline decoration-ink/40">10% OFF</span>
            </h3>
            <p className="text-sm text-body mt-1 font-medium">
              Recibe el código por correo + novedades de colecciones hechas a
              mano.
            </p>
          </div>
          <form
            className="flex w-full max-w-md bg-paper rounded-full p-1.5 shadow-soft"
            onSubmit={(e) => {
              e.preventDefault();
              const email = (
                e.currentTarget.elements.namedItem(
                  "nl-email",
                ) as HTMLInputElement
              ).value;
              if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                addToast(
                  "¡Listo! Revisa tu correo: tienes 10% OFF con el código BIENVENIDO10",
                  "💌",
                );
                (
                  e.currentTarget.elements.namedItem(
                    "nl-email",
                  ) as HTMLInputElement
                ).value = "";
              } else {
                addToast(
                  "Ingresa un correo válido para recibir tu descuento",
                  "⚠️",
                );
              }
            }}
          >
            <input
              name="nl-email"
              type="email"
              required
              placeholder="tucorreo@ejemplo.com"
              aria-label="Correo para newsletter"
              className="flex-1 bg-transparent px-4 text-sm text-ink focus:outline-none placeholder:text-body/50"
            />
            <button
              type="submit"
              className="bg-ink text-paper text-sm font-bold px-5 sm:px-7 py-3 rounded-full hover:bg-body transition-colors shrink-0"
            >
              Ok
            </button>
          </form>
        </div>
      </div>

      {/* Columnas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-blush text-ink flex items-center justify-center">
              <IconPaw className="w-5.5 h-5.5" />
            </span>
            <span className="font-display text-xl text-paper">
              Ricaurte <span className="text-blush">Mascotas</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed mt-3 text-pinky/80">
            Prendas 100% artesanales para perros y gatos, confeccionadas con
            amor en Ibagué, Tolima. Avalados por la garantía de Ricaurte
            Mascotas y recomendados por veterinarios.
          </p>
          <div className="flex gap-2 mt-4">
            {[IconInstagram, IconFacebook, IconTikTok, IconWhatsApp].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label="Red social"
                  className="w-9 h-9 rounded-full bg-paper/10 hover:bg-blush hover:text-ink transition-colors flex items-center justify-center"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ),
            )}
          </div>
        </div>

        <nav aria-label="Nuestra empresa">
          <h4 className="font-bold text-paper text-sm mb-3">Nuestra empresa</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/faq" className="hover:text-blush transition-colors">
                Sobre nosotros
              </Link>
            </li>
            <li>
              <Link
                to="/garantia"
                className="hover:text-blush transition-colors"
              >
                Garantía Ricaurte Mascotas
              </Link>
            </li>
            <li>
              <Link to="/tienda" className="hover:text-blush transition-colors">
                Catálogo completo
              </Link>
            </li>
            <li>
              <Link to="/cuenta" className="hover:text-blush transition-colors">
                Mi cuenta
              </Link>
            </li>
            <li>
              <Link to="/deseos" className="hover:text-blush transition-colors">
                Lista de deseos
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Ayuda y soporte">
          <h4 className="font-bold text-paper text-sm mb-3">Ayuda y soporte</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/faq" className="hover:text-blush transition-colors">
                Preguntas frecuentes (FAQ)
              </Link>
            </li>
            <li>
              <Link to="/cuenta" className="hover:text-blush transition-colors">
                Seguimiento de pedido
              </Link>
            </li>
            <li>
              <Link
                to="/legal/envios"
                className="hover:text-blush transition-colors"
              >
                Envíos y plazos
              </Link>
            </li>
            <li>
              <Link
                to="/legal/devoluciones"
                className="hover:text-blush transition-colors"
              >
                Devoluciones y cambios
              </Link>
            </li>
            <li>
              <a
                href="https://wa.me/573001234567"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blush transition-colors"
              >
                WhatsApp +57 300 123 4567
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legales y contacto">
          <h4 className="font-bold text-paper text-sm mb-3">
            Información legal
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link
                to="/legal/terminos"
                className="hover:text-blush transition-colors"
              >
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link
                to="/legal/privacidad"
                className="hover:text-blush transition-colors"
              >
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link
                to="/legal/envios"
                className="hover:text-blush transition-colors"
              >
                Política de envíos
              </Link>
            </li>
            <li>
              <Link
                to="/legal/devoluciones"
                className="hover:text-blush transition-colors"
              >
                Cambios y reembolsos
              </Link>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="bg-paper/10 border border-paper/15 text-[10px] font-bold px-2.5 py-1 rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
        </nav>
      </div>

      {/* Corporativo */}
      <div className="border-t border-paper/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-pinky/70">
          <p>
            © 2025 Ricaurte Mascotas SAS • NIT 900.123.456-7 • Cra 5 # 10-24,
            Ibagué, Tolima, Colombia
          </p>
          <p>
            📞 +57 300 123 4567 • ✉️ contacto@ricaurte-mascotas.com • Lunes a
            sábado 8am – 6pm
          </p>
          <p className="flex items-center gap-1.5">
            🔒 Compra 100% segura <span className="text-mint">•</span> SSL
          </p>
        </div>
      </div>
    </footer>
  );
};
