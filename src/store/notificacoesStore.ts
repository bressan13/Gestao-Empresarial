import { create } from 'zustand';

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  lida: boolean;
}

interface NotificacoesStore {
  notificacoes: Notificacao[];
  addNotificacao: (notificacao: Omit<Notificacao, 'id' | 'lida'>) => void;
  marcarComoLida: (id: string) => void;
  removerNotificacao: (id: string) => void;
}

export const useNotificacoesStore = create<NotificacoesStore>((set) => ({
  notificacoes: [],
  addNotificacao: (notificacao) =>
    set((state) => ({
      notificacoes: [
        ...state.notificacoes,
        { ...notificacao, id: crypto.randomUUID(), lida: false },
      ],
    })),
  marcarComoLida: (id) =>
    set((state) => ({
      notificacoes: state.notificacoes.map((n) =>
        n.id === id ? { ...n, lida: true } : n
      ),
    })),
  removerNotificacao: (id) =>
    set((state) => ({
      notificacoes: state.notificacoes.filter((n) => n.id !== id),
    })),
}));