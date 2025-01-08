import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { DatePicker } from 'antd';

export function Dashboard() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log('Usuário autenticado:', currentUser);
        setUser(currentUser);
        await fetchEmpresaData(currentUser.uid);
      } else {
        console.log('Nenhum usuário autenticado.');
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Limpeza do listener ao desmontar o componente
  }, []);

  const fetchEmpresaData = async (userId) => {
    try {
      console.log("Buscando dados da empresa para o usuário:", userId);
      const userDocRef = doc(db, 'usuarios', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const empresaData = userDoc.data()?.empresa;
        if (empresaData) {
          console.log("Empresa encontrada:", empresaData);
          setEmpresa({
            nome: empresaData.nome,
            cnpj: empresaData.cnpj,
            segmento: empresaData.segmento,
            faturamentoMensal: empresaData.faturamentoMensal,
            despesasFixas: empresaData.despesasFixas,
            despesasVariaveis: empresaData.despesasVariaveis,
          });
        } else {
          console.log("Nenhuma empresa vinculada ao usuário.");
        }
      } else {
        console.log("Documento do usuário não encontrado no Firestore.");
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empresa) {
      const faturamentoMensal = empresa.faturamentoMensal || 0;
      const despesasFixas = empresa.despesasFixas || 0;
      const despesasVariaveis = empresa.despesasVariaveis || 0;

      const mesAtual = new Date();
      const novosDados = [
        {
          mes: format(mesAtual, 'yyyy-MM'),
          receitas: faturamentoMensal,
          despesas: despesasFixas + despesasVariaveis,
          lucro: faturamentoMensal - (despesasFixas + despesasVariaveis),
        },
      ];

      setDadosGrafico(novosDados);
    }
  }, [empresa]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Carregando dados...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center text-gray-500">Você não está autenticado. Faça login para continuar.</div>;
  }

  if (!empresa || Object.keys(empresa).length === 0) {
    return <div className="p-6 text-center text-gray-500">Nenhuma empresa encontrada para este usuário.</div>;
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
        {/* Receita Mensal */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Receita Mensal</h3>
          <p className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(empresa.faturamentoMensal)}
          </p>
        </motion.div>

        {/* Despesas Totais */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Despesas Totais</h3>
          <p className="text-3xl font-bold text-red-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(empresa.despesasFixas + empresa.despesasVariaveis)}
          </p>
        </motion.div>

        {/* Lucro Líquido */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Lucro Líquido</h3>
          <p className="text-3xl font-bold text-blue-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(empresa.faturamentoMensal - (empresa.despesasFixas + empresa.despesasVariaveis))}
          </p>
        </motion.div>
      </div>

      {/* Gráfico de Desempenho Financeiro */}
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
                tickFormatter={(value) => format(new Date(value), 'MMM/yyyy', { locale: ptBR })}
              />
              <YAxis 
                tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(value)}
              />
              <Tooltip 
                formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
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
