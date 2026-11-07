import { useEffect } from 'react';
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useMatches,
} from 'react-router';
import { Desk } from './desk/desk';
import { DeskProvider } from './desk/desk-state';
import type { RouteHandle } from './routes';

const SITE_TITLE = 'kelly neuroth - frontend engineer';

/** The room, then whatever is currently laid over it. */
export function Layout() {
  // The home route isn't a page over the desk — it IS the desk.
  const onDesk = useLocation().pathname === '/';
  useRouteTitle();

  return (
    <DeskProvider>
      <Desk live={onDesk} />
      <Outlet />
      <ScrollRestoration />
    </DeskProvider>
  );
}

/** The deepest route's `handle.title` becomes the tab; the home page keeps the
    site's own. */
function useRouteTitle() {
  const matches = useMatches();
  const title = matches
    .map((m) => (m.handle as RouteHandle | undefined)?.title)
    .filter(Boolean)
    .at(-1);
  useEffect(() => {
    document.title = title ?? SITE_TITLE;
  }, [title]);
}
