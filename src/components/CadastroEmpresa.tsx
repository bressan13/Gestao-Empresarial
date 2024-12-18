import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEmpresaStore } from '../store/empresaStore';
import { useNotificacoesStore } from '../store/notificacoesStore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { segmentos } from '../data/segmentos';
import { useNavigate } from 'react-router-dom';


const empresaSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cnpj: z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos'),
  segmento: z.string().min(1, 'Selecione um segmento'),
  segmentoPersonalizado: z.string().optional(),
  faturamentoMensal: z.number().min(0, 'Faturamento deve ser positivo'),
  despesasFixas: z.number().min(0, 'Despesas fixas devem ser positivas'),
  despesasVariaveis: z.number().min(0, 'Despesas variáveis devem ser positivas'),
});

type EmpresaForm = z.infer<typeof empresaSchema>;

const salvarCadastroEmpresa = async (userId: string, data: EmpresaForm) => {
  const userDocRef = doc(db, 'usuarios', userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    await setDoc(userDocRef, { empresaCadastrada: true, empresa: data }, { merge: true });
  } else {
    await setDoc(userDocRef, { empresaCadastrada: true, empresa: data });
  }
};

const FormularioEmpresa = ({ onSubmit, empresaExistente, setValue, errors, register, watch }) => {
  const segmentoSelecionado = watch('segmento');
  const mostrarSegmentoPersonalizado = segmentoSelecionado === 'outro';

  return (
    <form onSubmit={onSubmit} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-8 space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
        <input {...register('nome')} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
        {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
        <input {...register('cnpj')} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
        {errors.cnpj && <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
        <select {...register('segmento')} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
          <option value="">Selecione um segmento</option>
          {segmentos.map((segmento) => (
            <option key={segmento.valor} value={segmento.valor}>
              {segmento.label}
            </option>
          ))}
        </select>
        {errors.segmento && <p className="mt-1 text-sm text-red-600">{errors.segmento.message}</p>}
      </motion.div>

      {mostrarSegmentoPersonalizado && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Especifique seu Segmento</label>
          <input {...register('segmentoPersonalizado')} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Faturamento Mensal</label>
        <input type="number" {...register('faturamentoMensal', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
        {errors.faturamentoMensal && <p className="mt-1 text-sm text-red-600">{errors.faturamentoMensal.message}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Despesas Fixas</label>
        <input type="number" {...register('despesasFixas', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
        {errors.despesasFixas && <p className="mt-1 text-sm text-red-600">{errors.despesasFixas.message}</p>}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Despesas Variáveis</label>
        <input type="number" {...register('despesasVariaveis', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
        {errors.despesasVariaveis && <p className="mt-1 text-sm text-red-600">{errors.despesasVariaveis.message}</p>}
      </motion.div>

      <div className="mt-6">
        <button type="submit" className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg">
          Salvar
        </button>
      </div>
    </form>
  );
};

export function CadastroEmpresa() {
  const setEmpresa = useEmpresaStore((state) => state.setEmpresa);
  const addNotificacao = useNotificacoesStore((state) => state.addNotificacao);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
  });

  const [loading, setLoading] = useState(true);
  const [empresaExistente, setEmpresaExistente] = useState(false);

  const onSubmit = async (data: EmpresaForm) => {
    console.log('Dados do formulário:', data);

    const novaEmpresa = { ...data, id: crypto.randomUUID() };

    try {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data()?.empresaCadastrada) {
          console.log('Salvando empresa no Firestore...');
          await salvarCadastroEmpresa(userId, novaEmpresa);
          setEmpresa(novaEmpresa);
          addNotificacao({ titulo: 'Salvo', mensagem: 'Atualizações salvas!', tipo: 'error' });
          return;
        }

        console.log('Salvando empresa no Firestore...');
        await salvarCadastroEmpresa(userId, novaEmpresa);
        setEmpresa(novaEmpresa);
        addNotificacao({
          titulo: 'Empresa Cadastrada',
          mensagem: `A empresa ${data.nome} foi cadastrada com sucesso!`,
          tipo: 'success',
        });
      } else {
        console.error('Usuário não autenticado');
      }
    } catch (error) {
      addNotificacao({
        titulo: 'Erro',
        mensagem: 'Houve um erro ao salvar a empresa.',
        tipo: 'error',
      });
      console.error(error);
    }
    const navigate = useNavigate(); // Dentro do componente CadastroEmpresa

  const onSubmit = async (data: EmpresaForm) => {
    console.log('Dados do formulário:', data);

    const novaEmpresa = { ...data, id: crypto.randomUUID() };

    try {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data()?.empresaCadastrada) {
          console.log('Salvando empresa no Firestore...');
          await salvarCadastroEmpresa(userId, novaEmpresa);
          setEmpresa(novaEmpresa);
          addNotificacao({ titulo: 'Salvo', mensagem: 'Atualizações salvas!', tipo: 'error' });
          return;
        }

        console.log('Salvando empresa no Firestore...');
        await salvarCadastroEmpresa(userId, novaEmpresa);
        setEmpresa(novaEmpresa);
        addNotificacao({
          titulo: 'Empresa Cadastrada',
          mensagem: `A empresa ${data.nome} foi cadastrada com sucesso!`,
          tipo: 'success',
        });

        // Redireciona para o dashboard após o cadastro
        navigate('/dashboard'); // Altere o caminho para o que for correspondente ao seu dashboard
      } else {
        console.error('Usuário não autenticado');
      }
    } catch (error) {
      addNotificacao({
        titulo: 'Erro',
        mensagem: 'Houve um erro ao salvar a empresa.',
        tipo: 'error',
      });
      console.error(error);
    }
  };

  };

  useEffect(() => {
    const checkEmpresaExistente = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'usuarios', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data()?.empresa) {
          setEmpresaExistente(true);
          setLoading(false);
          const empresa = userDoc.data()?.empresa;
          if (empresa) {
            setValue('nome', empresa.nome);
            setValue('cnpj', empresa.cnpj);
            setValue('segmento', empresa.segmento);
            setValue('faturamentoMensal', empresa.faturamentoMensal);
            setValue('despesasFixas', empresa.despesasFixas);
            setValue('despesasVariaveis', empresa.despesasVariaveis);
            setValue('segmentoPersonalizado', empresa.segmentoPersonalizado || '');
          }
        } else {
          setLoading(false);
        }
      }
    };

    checkEmpresaExistente();
  }, [setValue]);

  if (loading) return <div>Carregando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="container mx-auto px-4 py-8"
    >
      <h2 className="text-2xl font-semibold mb-4">
        {empresaExistente ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
      </h2>
      <FormularioEmpresa
        onSubmit={handleSubmit(onSubmit)}
        empresaExistente={empresaExistente}
        setValue={setValue}
        errors={errors}
        register={register}
        watch={watch}
      />
    </motion.div>
  );
}
