import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

// Importação do Firebase
import { auth, googleProvider, signInWithPopup } from '../../config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Certifique-se de importar a instância do Firestore

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // Usando Firebase para autenticação com email e senha
    auth.signInWithEmailAndPassword(data.email, data.senha)
      .then(async (userCredential) => {
        const user = userCredential.user;

        login({
          id: user.uid,
          nome: user.displayName || 'Usuário',
          email: user.email || '',
          cargo: 'admin',
        });

        // Verificar se o usuário já tem uma empresa cadastrada
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const empresaCadastrada = userDoc.data()?.empresa;
          if (empresaCadastrada) {
            // Se a empresa já estiver cadastrada, carrega os dados
            console.log('Empresa cadastrada:', empresaCadastrada);
          } else {
            // Se não houver empresa, navegue para a página de cadastro da empresa
            navigate('/cadastro-empresa');
          }
        } else {
          console.log('Usuário não encontrado');
        }

        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        login({
          id: user.uid,
          nome: user.displayName || 'Usuário',
          email: user.email || '',
          cargo: 'admin',
        });

        // Verificar se o usuário já tem uma empresa cadastrada
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const empresaCadastrada = userDoc.data()?.empresa;
          if (empresaCadastrada) {
            // Se a empresa já estiver cadastrada, carrega os dados
            console.log('Empresa cadastrada:', empresaCadastrada);
          } else {
            // Se não houver empresa, navegue para a página de cadastro da empresa
            navigate('/cadastro-empresa');
          }
        } else {
          console.log('Usuário não encontrado');
        }

        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <motion.div
            className="mx-auto h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <LogIn className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Acesse sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="Email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="senha" className="sr-only">
                Senha
              </label>
              <input
                {...register('senha')}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-800"
                placeholder="Senha"
              />
              {errors.senha && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.senha.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Entrar
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </motion.div>
  );
}
