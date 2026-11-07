import type { ReactNode } from 'react';

/** A page's heading, on the veiled desk: light type, or it vanishes into the
    room. */
export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mx-6 my-5 sm:mx-10">
      <h1 className="text-2xl text-frenchgrey">{title}</h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm text-white/75">{subtitle}</p>
      )}
    </div>
  );
}
