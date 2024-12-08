import { create } from 'zustand';
import type { Empresa } from '../types/empresa';

interface EmpresaStore {
  empresa: Empresa | null;
  setEmpresa: (empresa: Empresa) => void;
  clearEmpresa: () => void;
}

export const useEmpresaStore = create<EmpresaStore>((set) => ({
  empresa: null,
  setEmpresa: (empresa) => set({ empresa }),
  clearEmpresa: () => set({ empresa: null }),
}));