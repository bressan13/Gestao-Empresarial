import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const empresaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos'),
  segmento: z.string().min(1, 'Selecione um segmento'),
  faturamentoMensal: z.number().min(0, 'Faturamento deve ser positivo'),
  despesasFixas: z.number().min(0, 'Despesas fixas devem ser positivas'),
  despesasVariaveis: z.number().min(0, 'Despesas variáveis devem ser positivas'),
});

type EmpresaForm = z.infer<typeof empresaSchema>;

export function CadastroEmpresa() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
  });

  const [empresaExistente, setEmpresaExistente] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDadosEmpresa = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data()?.empresa) {
          const dados = userDoc.data()?.empresa;
          setEmpresaExistente(true);
          // Preencher o formulário com os dados existentes
          setValue('nome', dados.nome);
          setValue('cnpj', dados.cnpj);
          setValue('segmento', dados.segmento);
          setValue('faturamentoMensal', dados.faturamentoMensal);
          setValue('despesasFixas', dados.despesasFixas);
          setValue('despesasVariaveis', dados.despesasVariaveis);
        }
      }
      setLoading(false);
    };

    carregarDadosEmpresa();
  }, [setValue]);

  const onSubmit = async (data: EmpresaForm) => {
    const user = getAuth().currentUser;
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(db, 'usuarios', userId);

      try {
        const currentDate = new Date().toISOString().split('T')[0]; // Data no formato "YYYY-MM-DD"
        
        const userDoc = await getDoc(userDocRef);
        let empresaData = userDoc.exists() ? userDoc.data()?.empresa : {};

        if (!empresaData) {
          // Inicialize a estrutura de dados caso a empresa não exista
          empresaData = {
            financeiro: {
              faturamento: [],
              despesasFixas: [],
              despesasVariaveis: []
            }
          };
        } else {
          // Certifique-se de que as listas existam e estejam vazias se não houver dados anteriores
          empresaData.financeiro = empresaData.financeiro || {};
          empresaData.financeiro.faturamento = empresaData.financeiro.faturamento || [];
          empresaData.financeiro.despesasFixas = empresaData.financeiro.despesasFixas || [];
          empresaData.financeiro.despesasVariaveis = empresaData.financeiro.despesasVariaveis || [];
        }

        // Adicionar novo dado à lista semanal
        empresaData.financeiro.faturamento.push({ valor: data.faturamentoMensal, data: currentDate });
        empresaData.financeiro.despesasFixas.push({ valor: data.despesasFixas, data: currentDate });
        empresaData.financeiro.despesasVariaveis.push({ valor: data.despesasVariaveis, data: currentDate });

        // Atualizando ou criando os dados da empresa no Firestore
        if (empresaExistente) {
          // Atualizar os dados financeiros
          await updateDoc(userDocRef, { empresa: empresaData });
        } else {
          // Criar uma nova empresa
          await setDoc(userDocRef, { empresa: empresaData, empresaCadastrada: true }, { merge: true });
        }

        navigate('/dashboard');
      } catch (error) {
        console.error('Erro ao salvar os dados:', error);
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-semibold mb-4">
        {empresaExistente ? 'Atualizar Dados da Empresa' : 'Cadastrar Nova Empresa'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome da Empresa</label>
          <input
            {...register('nome')}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={empresaExistente} // Não permitir editar nome após cadastro
          />
          {errors.nome && <p className="text-red-600">{errors.nome.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">CNPJ</label>
          <input
            {...register('cnpj')}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={empresaExistente} // Não permitir editar CNPJ após cadastro
          />
          {errors.cnpj && <p className="text-red-600">{errors.cnpj.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Faturamento Mensal</label>
          <input
            {...register('faturamentoMensal', { valueAsNumber: true })}
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.faturamentoMensal && <p className="text-red-600">{errors.faturamentoMensal.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Despesas Fixas</label>
          <input
            {...register('despesasFixas', { valueAsNumber: true })}
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.despesasFixas && <p className="text-red-600">{errors.despesasFixas.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Despesas Variáveis</label>
          <input
            {...register('despesasVariaveis', { valueAsNumber: true })}
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.despesasVariaveis && <p className="text-red-600">{errors.despesasVariaveis.message}</p>}
        </div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
          {empresaExistente ? 'Atualizar Dados' : 'Salvar'}
        </button>
      </form>
    </motion.div>
  );
}
