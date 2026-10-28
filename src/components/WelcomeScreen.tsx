import { LoaderCircle, Smartphone } from 'lucide-react';

export function WelcomeScreen() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0b0d13] px-5 py-12 text-[#f1f3f7]" aria-busy="true">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(245,158,11,0.16),transparent_55%)]" />
      <section className="relative w-full max-w-xl text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[28px] border border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-[0_0_60px_rgba(245,158,11,0.12)]">
          <Smartphone size={38} strokeWidth={1.7} aria-hidden="true" />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-amber-300">Xush kelibsiz</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">MobileBozor</h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
          Telefonlarni topish va o‘z telefoningizni sotish uchun qulay bozor.
        </p>
        <p role="status" aria-live="polite" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          Sayt ochilmoqda…
        </p>
      </section>
    </main>
  );
}
