import React from 'react';
import { Menu, User, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificacoesMenu } from './NotificacoesMenu';
import { ThemeToggle } from './ThemeToggle';
import { useEmpresaStore } from '../store/empresaStore';

export function Header() {
  const empresa = useEmpresaStore((state) => state.empresa);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Menu className="h-6 w-6 text-indigo-600 dark:text-indigo-400 cursor-pointer" />
            <LayoutGrid className="ml-2 h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
              {empresa?.nome || 'Gestão Empresarial'}
            </h1>
          </motion.div>
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <NotificacoesMenu />
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 rounded-full flex items-center justify-center cursor-pointer"
            >
              <User className="h-5 w-5 text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}