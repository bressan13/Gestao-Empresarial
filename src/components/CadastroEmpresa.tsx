import React from 'react';
import { Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { segmentos } from '../data/segmentos';
import { useEmpresaStore } from '../store/empresaStore';
import { useNotificacoesStore } from '../store/notificacoesStore';

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

export function CadastroEmpresa() {
  const setEmpresa = useEmpresaStore((state) => state.setEmpresa);
  const addNotificacao = useNotificacoesStore((state) => state.addNotificacao);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmpresaForm>({
    resolver: zodResolver(empresaSchema),
  });

  const segmentoSelecionado = watch('segmento');
  const mostrarSegmentoPersonalizado = segmentoSelecionado === 'outro';

  const onSubmit = (data: EmpresaForm) => {
    const novaEmpresa = {
      ...data,
      id: crypto.randomUUID(),
    };
    
    setEmpresa(novaEmpresa);
    addNotificacao({
      titulo: 'Empresa Cadastrada',
      mensagem: `A empresa ${data.nome} foi cadastrada com sucesso!`,
      tipo: 'success',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="flex items-center mb-6">
        <Building2 className="h-8 w-8 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Cadastro da Empresa</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Empresa
          </label>
          <input
            {...register('nome')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CNPJ
          </label>
          <input
            {...register('cnpj')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
          />
          {errors.cnpj && (
            <p className="mt-1 text-sm text-red-600">{errors.cnpj.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Segmento
          </label>
          <select
            {...register('segmento')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
          >
            <option value="">Selecione um segmento</option>
            {segmentos.map((segmento) => (
              <option key={segmento.valor} value={segmento.valor}>
                {segmento.label}
              </option>
            ))}
          </select>
          {errors.segmento && (
            <p className="mt-1 text-sm text-red-600">{errors.segmento.message}</p>
          )}
        </motion.div>

        {mostrarSegmentoPersonalizado && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especifique seu Segmento
            </label>
            <input
              {...register('segmentoPersonalizado')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Faturamento Mensal
            </label>
            <input
              type="number"
              {...register('faturamentoMensal', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
            />
            {errors.faturamentoMensal && (
              <p className="mt-1 text-sm text-red-600">{errors.faturamentoMensal.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Despesas Fixas
            </label>
            <input
              type="number"
              {...register('despesasFixas', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
            />
            {errors.despesasFixas && (
              <p className="mt-1 text-sm text-red-600">{errors.despesasFixas.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Despesas Variáveis
            </label>
            <input
              type="number"
              {...register('despesasVariaveis', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50 backdrop-blur-sm transition-all"
            />
            {errors.despesasVariaveis && (
              <p className="mt-1 text-sm text-red-600">{errors.despesasVariaveis.message}</p>
            )}
          </motion.div>
        </div>

        <motion.button
          type="submit"
          className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cadastrar Empresa
        </motion.button>
      </form>
    </motion.div>
  );
}