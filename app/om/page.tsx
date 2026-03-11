export default function AboutPage() {
  return (
    <main className="relative min-h-screen pb-24 md:pb-10">
      <section className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-nytti-pink">Om</p>
          <h1 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">Nytti</h1>
          <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
            Nytti er norsk bærekraft i praktisk utfoldelse. Det er produkter og tjenester som gir mening. Det er
            handlinger som løfter sosial bærekraft og fellesskap mellom folk. Det er å yte miljøet vi lever og ånder i
            rettferdighet.
          </p>
        </div>
      </section>
    </main>
  );
}
