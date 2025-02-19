import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
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
  const [visualizacao, setVisualizacao] = useState<'semanal' | 'mensal'>('mensal');
  const [semanaSelecionada, setSemanaSelecionada] = useState<Date | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchEmpresaData(currentUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchEmpresaData = async (userId) => {
    try {
      const userDocRef = doc(db, 'usuarios', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const empresaData = userDoc.data()?.empresa;
        if (empresaData) {
          setEmpresa({
            nome: empresaData.nome,
            cnpj: empresaData.cnpj,
            segmento: empresaData.segmento,
            faturamentoMensal: empresaData.faturamentoMensal,
            despesasFixas: empresaData.despesasFixas,
            despesasVariaveis: empresaData.despesasVariaveis,
            financeiro: empresaData.financeiro || {} // Garantindo que o campo financeiro esteja presente
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empresa) {
      const dados = [];
      const faturamentoMensal = empresa.faturamentoMensal || 0;
      const despesasFixas = empresa.despesasFixas || 0;
      const despesasVariaveis = empresa.despesasVariaveis || 0;

      if (visualizacao === 'mensal') {
        const mesAtual = new Date();
        dados.push({
          mes: format(mesAtual, 'yyyy-MM'),
          receitas: faturamentoMensal,
          despesas: despesasFixas + despesasVariaveis,
          lucro: faturamentoMensal - (despesasFixas + despesasVariaveis),
        });
      } else if (visualizacao === 'semanal' && semanaSelecionada) {
        const start = startOfWeek(semanaSelecionada, { weekStartsOn: 0 });
        const end = endOfWeek(semanaSelecionada, { weekStartsOn: 0 });

        // Agrupando os dados por data
        const faturamentoSemanal = empresa.financeiro.faturamento || [];
        const despesasFixasSemanal = empresa.financeiro.despesasFixas || [];
        const despesasVariaveisSemanal = empresa.financeiro.despesasVariaveis || [];

        // Mapeando as entradas de faturamento por data
        const agrupadoPorData = {};

        faturamentoSemanal.forEach((item) => {
          const data = parseISO(item.data); // Convertendo data para Date
          if (isSameDay(data, start) || isSameDay(data, end) || (data >= start && data <= end)) {
            if (!agrupadoPorData[data]) {
              agrupadoPorData[data] = { receitas: 0, despesas: 0 };
            }
            agrupadoPorData[data].receitas += item.valor;
          }
        });

        // Mapeando as despesas por data
        despesasFixasSemanal.forEach((item) => {
          const data = parseISO(item.data);
          if (isSameDay(data, start) || isSameDay(data, end) || (data >= start && data <= end)) {
            if (!agrupadoPorData[data]) {
              agrupadoPorData[data] = { receitas: 0, despesas: 0 };
            }
            agrupadoPorData[data].despesas += item.valor;
          }
        });

        despesasVariaveisSemanal.forEach((item) => {
          const data = parseISO(item.data);
          if (isSameDay(data, start) || isSameDay(data, end) || (data >= start && data <= end)) {
            if (!agrupadoPorData[data]) {
              agrupadoPorData[data] = { receitas: 0, despesas: 0 };
            }
            agrupadoPorData[data].despesas += item.valor;
          }
        });

        // Convertendo para o formato desejado para o gráfico
        Object.keys(agrupadoPorData).forEach((dataKey) => {
          const data = new Date(dataKey);
          const totalReceitas = agrupadoPorData[dataKey].receitas;
          const totalDespesas = agrupadoPorData[dataKey].despesas;
          dados.push({
            mes: format(data, 'dd/MM/yyyy'), // Exibindo a data no gráfico
            receitas: totalReceitas,
            despesas: totalDespesas,
            lucro: totalReceitas - totalDespesas,
          });
        });
      }

      setDadosGrafico(dados);
    }
  }, [empresa, visualizacao, semanaSelecionada]);

  const handleSemanaChange = (date: Date | null) => {
    setSemanaSelecionada(date);
  };

  const handleVisualizacaoChange = (value: 'semanal' | 'mensal') => {
    setVisualizacao(value);
  };

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

      {/* Seletor de visualização */}
      <div className="mb-6">
        <button
          className={`px-4 py-2 mr-4 ${visualizacao === 'mensal' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleVisualizacaoChange('mensal')}
        >
          Visualizar Mensal
        </button>
        <button
          className={`px-4 py-2 ${visualizacao === 'semanal' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleVisualizacaoChange('semanal')}
        >
          Visualizar Semanal
        </button>
      </div>

      {/* Seletor de semana */}
      {visualizacao === 'semanal' && (
        <div className="mb-6">
          <DatePicker
            value={semanaSelecionada}
            onChange={handleSemanaChange}
            picker="week"
            locale="pt-BR"
            format="DD/MM/YYYY"
          />
        </div>
      )}

      {/* Gráfico de Desempenho Financeiro */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Desempenho Financeiro</h3>

        {/* Verificação se há dados para o gráfico */}
        {dadosGrafico.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart key={JSON.stringify(dadosGrafico)} data={dadosGrafico}>  {}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mes" 
                  tickFormatter={(value) => format(new Date(value), visualizacao === 'semanal' ? 'dd/MM/yyyy' : 'MMM/yyyy', { locale: ptBR })}
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
        ) : (
          <div className="text-center text-gray-500">Nenhum dado disponível para o gráfico.</div>
        )}
      </motion.div>
    </motion.div>
  );
}
