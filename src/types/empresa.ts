export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
  segmento: string;
  segmentoPersonalizado?: string;
  faturamentoMensal: number;
  despesasFixas: number;
  despesasVariaveis: number;
}

export interface DadosFinanceiros {
  mes: string;
  receitas: number;
  despesas: number;
  lucro: number;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
}

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface FluxoCaixa {
  id: string;
  data: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  valor: number;
  descricao: string;
}