import { createContext } from "react";

/* Overlays portal into the phone root so scrims cover the tab bar too.
   Lives in its own module to keep ui ↔ chat imports acyclic. */
export const OverlayRoot = createContext<HTMLElement | null>(null);
