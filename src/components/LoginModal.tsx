import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { IconCheck, IconPaw, IconX } from './Icons';

export const LoginModal: React.FC = () => {
  const { loginOpen, setLoginOpen, login, addToast } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!loginOpen) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === 'register' && name.trim().length < 3) e.name = 'Ingresa tu nombre completo';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Ingresa un correo válido';
    if (pass.length < 6) e.pass = 'La contraseña debe tener mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    if (mode === 'register') {
      addToast('¡Cuenta creada! Ya puedes comprar más rápido', '🎉');
    }
    login(name || email.split('@')[0], email);
    setName(''); setEmail(''); setPass(''); setErrors({});
    setLoginOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Iniciar sesión">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm anim-fade-in" onClick={() => setLoginOpen(false)} />
      <div className="relative bg-paper rounded-3xl shadow-2xl w-full max-w-md anim-pop overflow-hidden">
        <div className="bg-gradient-to-r from-blush to-pinky px-6 py-5 relative">
          <button onClick={() => setLoginOpen(false)} aria-label="Cerrar" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-paper/70 hover:bg-paper flex items-center justify-center transition-colors">
            <IconX className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-ink text-blush flex items-center justify-center shadow"><IconPaw className="w-6 h-6" /></span>
            <div>
              <h2 className="font-display text-xl text-ink leading-none">{mode === 'login' ? '¡Bienvenido de nuevo!' : 'Crea tu cuenta'}</h2>
              <p className="text-xs text-body mt-1">Compra sin fricciones y sigue tus pedidos</p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="reg-name" className="text-xs font-bold text-ink block mb-1.5">Nombre completo</label>
              <input
                id="reg-name" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María García"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blush ${errors.name ? 'border-red-400 bg-red-50' : 'border-body/25'}`}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>
          )}
          <div>
            <label htmlFor="reg-email" className="text-xs font-bold text-ink block mb-1.5">Correo electrónico</label>
            <input
              id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blush ${errors.email ? 'border-red-400 bg-red-50' : 'border-body/25'}`}
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="reg-pass" className="text-xs font-bold text-ink block mb-1.5">Contraseña</label>
            <input
              id="reg-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blush ${errors.pass ? 'border-red-400 bg-red-50' : 'border-body/25'}`}
            />
            {errors.pass && <p className="text-[11px] text-red-500 mt-1">{errors.pass}</p>}
          </div>

          <button type="submit" className="w-full bg-blush text-ink font-extrabold py-3 rounded-full shadow-blush hover:bg-pinky active:scale-[0.98] transition-all">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta gratis'}
          </button>

          <button
            type="button"
            onClick={() => { setLoginOpen(false); addToast('¡Compra sin registro! Te pediremos los datos al pagar', '🛒'); }}
            className="w-full text-sm font-semibold text-body hover:text-ink transition-colors"
          >
            Prefiero comprar como invitado →
          </button>

          <p className="text-center text-xs text-body/70">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-bold text-blush underline underline-offset-2 hover:text-ink">
              {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>

          <p className="flex items-center justify-center gap-1.5 text-[10px] text-body/60">
            <IconCheck className="w-3 h-3 text-green-600" /> Tus datos están protegidos y encriptados
          </p>
        </form>
      </div>
    </div>
  );
};
