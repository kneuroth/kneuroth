import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router';
import { Header } from './header';
import { Layout } from './layout';
import { Blog } from './pages/blog';
import { Home } from './pages/home';
import { Portfolio } from './pages/portfolio/portfolio';
import { ThreeDArt } from './pages/portfolio/three-d-art';
import { WordleLeague } from './pages/portfolio/wordle-league';

const About = lazy(async () => ({
  default: (await import('./pages/about/about')).About,
}));

/** Read by the layout to set the browser tab. Titles are lower case in source:
    the tab is the one place the site's lower-case transform can't reach. */
export interface RouteHandle {
  title?: string;
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // Lazy: the pyramid brings three.js, which nothing else needs. A
      // component-level lazy, not the route's `lazy`, so a direct visit shows
      // the desk and the header at once and only the pyramid waits.
      {
        path: 'about',
        handle: { title: 'about kelly' },
        element: (
          <Suspense fallback={<Header />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: 'portfolio',
        handle: { title: 'projects' },
        children: [
          { index: true, element: <Portfolio /> },
          // Every project with a page of its own lives under its card.
          {
            path: 'wordle-league',
            element: <WordleLeague />,
            handle: { title: 'wordle league' },
          },
          {
            path: '3d-art',
            element: <ThreeDArt />,
            handle: { title: '3d art' },
          },
        ],
      },
      { path: 'blog', element: <Blog />, handle: { title: 'blog' } },

      // Where these pages used to live, for anything already linking there.
      {
        path: 'wordle-league',
        element: <Navigate to="/portfolio/wordle-league" replace />,
      },
      {
        path: '3d-art',
        element: <Navigate to="/portfolio/3d-art" replace />,
      },

      // Anything unrecognised lands on the desk rather than an empty page.
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
];
