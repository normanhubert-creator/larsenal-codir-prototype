import { createContext, useContext } from 'react';
import type { Etats } from './finance/engine';
import type { Etablissement } from './types';

export interface ContexteEtab {
  etab: Etablissement;
  e: Etats;
  base: string;
}

export const EtabCtx = createContext<ContexteEtab | null>(null);

export function useEtab(): ContexteEtab {
  const c = useContext(EtabCtx);
  if (!c) throw new Error('useEtab hors d’un établissement');
  return c;
}
