import SiteGateForm from '@/components/SiteGateForm';

export default function SiteGatePage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const redirectTo =
    searchParams?.redirect && searchParams.redirect.startsWith('/')
      ? searchParams.redirect
      : '/';

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold text-foreground">Privat tilgang</h1>
        <p className="mt-2 text-sm text-muted">
          Denne siden er passordbeskyttet. Skriv inn tilgangspassord for å fortsette.
        </p>
        <SiteGateForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}

