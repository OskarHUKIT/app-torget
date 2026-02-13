# Nytti

En plattform for kultur og samfunnsnyttig innhold – dikt, kunstverk,apper og spill for voksne i Norge. Alt innhold er kuratert for å være samfunnsnyttig.

## Funksjoner

- Utforsk et feed med dikt, kunstverk, apper og spill
- Last opp innhold (apper, spill, dikt, kunstverk)
- Personlig feed basert på likes og interesse
- Kurator-godkjent innhold
- Alle data lagres i EU (GDPR)

## Teknologi

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage) – må være EU-region
- **Deploy**: Vercel – funksjoner i EU (fra1)
- **Styling**: Tailwind CSS

## Oppsett

### 1. Installer avhengigheter

```bash
npm install
```

### 2. Miljøvariabler

Opprett `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=din_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=din_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase (EU-region)

1. Opprett Supabase-prosjekt på [supabase.com](https://supabase.com)
2. **Viktig:** Velg EU-region (f.eks. Frankfurt eller Stockholm)
3. Kjør migrasjoner fra `supabase/migrations/` i SQL Editor
4. Opprett Storage-bucket `apps` (Public)

### 4. Kjør utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## EU-data

Alle data lagres og prosesseres i Europa. Se planen for konfigurasjon av Supabase (EU-region) og Vercel (funksjonsregion fra1).

## Lisens

MIT
