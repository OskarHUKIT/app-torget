import Link from 'next/link';

const pillars = [
  {
    title: 'Smart garderobe',
    text: 'AI-drevet garderobeanalyse finner plagg du bruker lite og gjør dem om til personlige ukeplaner for antrekk.',
    metric: '27% mer gjenbruk',
  },
  {
    title: 'Lokalt reparasjonsnettverk',
    text: 'Book pålitelige skreddere og reparasjonspartnere i appen med tydelige prisintervaller og leveringstid.',
    metric: '18 måneder lengre levetid',
  },
  {
    title: 'Sirkulær markedsplass',
    text: 'Legg ut, bytt, lei ut eller doner klær i én flyt. Verifisert kvalitet gjør transaksjonene trygge og raske.',
    metric: '9 480 plagg i omløp',
  },
];

const roadmap = [
  'Q2: Pilot i Oslo med studentboliger og lokale reparasjonsaktører',
  'Q3: Legge til trygg handel (escrow) og verifisert kvalitetsscore',
  'Q4: Lansere dashboard for bærekraftsprogram i virksomheter',
];

export default function ClothesConceptPage() {
  return (
    <main className="relative min-h-screen pb-24 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <section className="overflow-hidden rounded-3xl border border-emerald-300/30 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/10 p-6 shadow-nytti md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                Konseptpresentasjon
              </p>
              <h1 className="font-display text-3xl font-extrabold text-foreground md:text-5xl">
                Sirkulær mote
                <span className="mt-1 block text-contrast">Et premium varemerke for bærekraftig bruk av klær</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm text-muted md:text-base">
                Et premium varemerke for bærekraftig bruk av klær: smartere gjenbruk, lengre levetid og lavere
                klimaavtrykk. Miks dine kolleksjoner, finn enkelplagg og kjøp med trygghet.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  AI-antrekksplanlegging
                </span>
                <span className="rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Reparasjon-først UX
                </span>
                <span className="rounded-full bg-background/85 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Sporbar effekt
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-300/40 bg-background/80 p-4 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
                Produktsnapshot
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border bg-white/80 p-3 dark:bg-gray-900/50">
                  <p className="text-xs text-muted">Månedlige brukere</p>
                  <p className="mt-1 text-lg font-bold text-foreground">3,200</p>
                </div>
                <div className="rounded-xl border border-border bg-white/80 p-3 dark:bg-gray-900/50">
                  <p className="text-xs text-muted">CO2 spart</p>
                  <p className="mt-1 text-lg font-bold text-foreground">14.6t</p>
                </div>
                <div className="rounded-xl border border-border bg-white/80 p-3 dark:bg-gray-900/50">
                  <p className="text-xs text-muted">Reparasjonsbookinger</p>
                  <p className="mt-1 text-lg font-bold text-foreground">+28%</p>
                </div>
                <div className="rounded-xl border border-border bg-white/80 p-3 dark:bg-gray-900/50">
                  <p className="text-xs text-muted">Partnerbutikker</p>
                  <p className="mt-1 text-lg font-bold text-foreground">42</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <h2 className="font-display text-xl font-bold text-foreground">{pillar.title}</h2>
              <p className="mt-2 text-sm text-muted">{pillar.text}</p>
              <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">{pillar.metric}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card md:p-8">
          <h3 className="font-display text-2xl font-bold text-foreground">Hvorfor dette vinner</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="text-sm font-semibold text-foreground">For brukere</p>
              <p className="mt-2 text-sm text-muted">
                Lavere kleskostnader, bedre stiltrygghet og enkle rutiner som reduserer avfall uten å ofre kvalitet
                eller brukervennlighet.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-4">
              <p className="text-sm font-semibold text-foreground">For byer og partnere</p>
              <p className="mt-2 text-sm text-muted">
                Ny etterspørsel for lokale reparasjonsmiljøer, renere tekstilstrømmer og transparent effektrapportering
                for bærekraftsprogram.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-card md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-bold text-foreground">Veikart</h3>
            <span className="rounded-full border border-emerald-300/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Investor-preview
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {roadmap.map((item) => (
              <li key={item} className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm text-foreground">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-background hover:opacity-90"
            >
              Tilbake til showcase
            </Link>
            <Link
              href="/browse"
              className="rounded-full border border-border bg-background px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-foreground hover:border-nytti-pink/50"
            >
              Utforsk alt innhold
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
