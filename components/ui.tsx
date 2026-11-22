export function Flash({ error, ok }: { error?: string; ok?: string }) {
  if (!error && !ok) return null;
  if (error) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </p>
    );
  }
  return (
    <p className="rounded-2xl border border-green/20 bg-green/10 px-4 py-3 text-sm text-leaf">{ok}</p>
  );
}

export function PageTitle({
  kicker,
  title,
  text,
}: {
  kicker?: string;
  title: string;
  text?: string;
}) {
  return (
    <header className="mb-6 grid gap-2">
      {kicker ? (
        <p className="text-xs font-bold tracking-[0.18em] text-green uppercase">{kicker}</p>
      ) : null}
      <h1 className="display text-3xl text-navy sm:text-4xl">{title}</h1>
      {text ? <p className="max-w-2xl text-sm leading-6 text-ink/70">{text}</p> : null}
    </header>
  );
}

export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="card px-5 py-8 text-center">
      <p className="font-semibold text-navy">{title}</p>
      <p className="mt-1 text-sm text-ink/65">{text}</p>
    </div>
  );
}
