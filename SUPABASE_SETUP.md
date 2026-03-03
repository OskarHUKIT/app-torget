# Supabase-oppsett for Nytti

## 1. Opprett prosjekt

1. Gå til [supabase.com](https://supabase.com) og logg inn
2. Klikk **New project**
3. Velg organisasjon, gi prosjektet et navn (f.eks. "nytti")
4. Velg passord for databasen og region (anbefalt: **Frankfurt (eu-central-1)** for EU)
5. Klikk **Create new project**

## 2. Kjør migrasjoner

Når prosjektet er klart:

1. Gå til **SQL Editor** i Supabase-dashboardet
2. Kjør migrasjonene i rekkefølge:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_external_link_apps.sql`
   - `supabase/migrations/003_nytti_content_feed.sql`

Eller bruk Supabase CLI:

```bash
supabase link --project-ref DITT_PROJEKT_REF
supabase db push
```

## 3. Slå på Auth (e-post/passord)

1. Gå til **Authentication** → **Providers**
2. **Email** er vanligvis på som standard
3. Under **Email** kan du velge:
   - **Confirm email**: Av/På avhengig av om du vil ha e-postbekreftelse ved registrering
   - **Secure email change**: Anbefalt på

## 4. Storage (for app-ikoner og skjermbilder)

1. Gå til **Storage**
2. Opprett en bucket med navn f.eks. `app-assets`
3. Sett **Public bucket** til **On** (eller bruk signert URLs – sjekk `lib/storage.ts`)
4. Under **Policies** – legg til en policy som tillater:
   - Autentiserte brukere å laste opp (`INSERT`)
   - Alle å lese (`SELECT`) filer i bucketen

Eksempelpolicy for offentlig lesing:

```sql
CREATE POLICY "Public read for app assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-assets');
```

For opplasting (autentiserte brukere):

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'app-assets' AND auth.role() = 'authenticated');
```

## 5. Miljøvariabler

Legg disse i `.env.local` (eller Vercel/host-miljø):

```
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Finn verdiene under **Project Settings** → **API** i Supabase-dashboardet.

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (brukes kun på server, f.eks. for kurator-API)

## 6. Kurator-funksjon

Kurator-API bruker `SUPABASE_SERVICE_ROLE_KEY` for å godkjenne/avvise innhold.

Du kan også begrense tilgang til kun bestemte e-postadresser – sjekk `/api/curator/route.ts` og eventuelt `CURATOR_EMAIL` i env.

## 7. Sjekkliste

- [ ] Prosjekt opprettet
- [ ] Migrasjoner kjørt (001, 002, 003)
- [ ] Auth (e-post) aktivert
- [ ] Storage-bucket opprettet og policy satt
- [ ] `NEXT_PUBLIC_SUPABASE_URL` og `NEXT_PUBLIC_SUPABASE_ANON_KEY` satt
- [ ] `SUPABASE_SERVICE_ROLE_KEY` satt (for kurator)

## Tabeller som opprettes

| Tabell           | Bruk                                 |
|------------------|---------------------------------------|
| `apps`           | Apper (PWA, spill, etc.)             |
| `content`        | Dikt, kunstverk, ideer, apper i feed |
| `user_favorites` | Brukeres favoritter                   |
| `user_engagement`| Liker, lagre, åpne                    |
| `profiles`       | Brukerprofil, region, preferanser    |

## Eksterne lenker

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
