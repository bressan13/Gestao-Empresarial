export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: 'admin' | 'gerente' | 'colaborador';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Permission {
  route: string;
  allowedRoles: Array<'admin' | 'gerente' | 'colaborador'>;
}