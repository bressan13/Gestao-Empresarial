import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEmpresaStore } from '../store/empresaStore';
import { motion } from 'framer-motion';

export function Dashboard() {
  const empresa = useEmpresaStore((state) => state.empresa);

  // Gera dados dos últimos 3 meses baseado nos dados da empresa
  const gerarDadosGrafico = () => {
    if (!empresa) return [];

    return Array.from({ length: 3 }).map((_, index) => {
      const mes = subMonths(new Date(), 2 - index);
      const variacao = Math.random() * 0.2 - 0.1; // Variação de ±10%

      return {
        mes: format(mes, 'yyyy-MM'),
        receitas: empresa.faturamentoMensal * (1 + variacao),
        despesas: (empresa.despesasFixas + empresa.despesasVariaveis) * (1 + variacao),
        lucro: (empresa.faturamentoMensal - (empresa.despesasFixas + empresa.despesasVariaveis)) * (1 + variacao)
      };
    });
  };

  const dadosGrafico = gerarDadosGrafico();

  if (!empresa) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Cadastre sua empresa para visualizar o dashboard</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Dashboard Financeiro - {empresa.nome}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Receita Mensal</h3>
          <p className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(empresa.faturamentoMensal)}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Despesas Totais</h3>
          <p className="text-3xl font-bold text-red-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(empresa.despesasFixas + empresa.despesasVariaveis)}
          </p>
          <div className="mt-2 text-sm">
            <p className="text-gray-600">Fixas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(empresa.despesasFixas)}</p>
            <p className="text-gray-600">Variáveis: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(empresa.despesasVariaveis)}</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Lucro Líquido</h3>
          <p className="text-3xl font-bold text-blue-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(empresa.faturamentoMensal - (empresa.despesasFixas + empresa.despesasVariaveis))}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Margem: {((empresa.faturamentoMensal - (empresa.despesasFixas + empresa.despesasVariaveis)) / empresa.faturamentoMensal * 100).toFixed(1)}%
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Desempenho Financeiro</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="mes" 
                tickFormatter={(value) => format(new Date(value), 'MMM', { locale: ptBR })}
              />
              <YAxis 
                tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value)}
              />
              <Tooltip 
                formatter={(value) => new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(value as number)}
                labelFormatter={(label) => format(new Date(label), 'MMMM/yyyy', { locale: ptBR })}
              />
              <Legend />
              <Bar dataKey="receitas" name="Receitas" fill="#10B981" />
              <Bar dataKey="despesas" name="Despesas" fill="#EF4444" />
              <Bar dataKey="lucro" name="Lucro" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}