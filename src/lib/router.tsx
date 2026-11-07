import { useRef, type MouseEvent } from 'react';
import { Link, useHref, useNavigate, type LinkProps } from 'react-router';
import { cx } from '@/components/ui/kn-utils';
import { useGlowSweep } from '@/components/ui/use-glow-sweep';

/** Prefix a file in `public/` with the deploy base, so it resolves from any
    route depth (`/portfolio/3d-art` included). */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/**
 * `href` + `onClick` that make a library `<a>` (GlowButton / GlassButton with
 * `href`) navigate client-side, while staying a real link: middle-click,
 * cmd-click and copy-link all still work.
 */
export function useRouterLink(to: string) {
  const href = useHref(to);
  const navigate = useNavigate();
  return {
    href,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      e.preventDefault();
      navigate(to);
    },
  };
}

/** The library's swept text link, as a router `<Link>`. */
export function SweepNavLink({
  pending,
  className,
  ...props
}: LinkProps & { pending?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useGlowSweep(ref);
  return (
    <Link
      ref={ref}
      className={cx('glow-sweep', pending && 'glow-sweep-pending', className)}
      {...props}
    />
  );
}

/** A swept word inside something else that's the link (a glass button, a
    projected label): the sweep fires when the word itself is hovered. */
export function SweptLabel({
  pending,
  className,
  children,
}: {
  pending?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useGlowSweep(ref);
  return (
    <span
      ref={ref}
      className={cx('glow-sweep', pending && 'glow-sweep-pending', className)}
    >
      {children}
    </span>
  );
}
