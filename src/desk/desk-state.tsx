import { createContext, useContext, useState, type ReactNode } from 'react';

/**
 * Whether the desk is currently projecting its surfaces onto the photograph.
 *
 * That's a media decision made inside the manifest (a photo framed for
 * landscape can't hold a legible laptop screen on a portrait phone), so the
 * desk reports what the element actually laid out, and pages that need a
 * fallback read it here — never re-derive the breakpoint in CSS, where it would
 * drift from the manifest.
 */
interface DeskState {
  /** `null` until the photo has laid out (or failed) once — so the home page's
      fallback doesn't flash up on every load before the desk reports. */
  projecting: boolean | null;
  setProjecting: (projecting: boolean) => void;
}

const DeskContext = createContext<DeskState | null>(null);

export function DeskProvider({ children }: { children: ReactNode }) {
  const [projecting, setProjecting] = useState<boolean | null>(null);
  return (
    <DeskContext value={{ projecting, setProjecting }}>{children}</DeskContext>
  );
}

export function useDesk(): DeskState {
  const state = useContext(DeskContext);
  if (!state) throw new Error('useDesk() outside <DeskProvider>');
  return state;
}
