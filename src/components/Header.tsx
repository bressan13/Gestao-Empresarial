import React, { useState } from 'react';
import { Menu, User, LayoutGrid, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificacoesMenu } from './NotificacoesMenu';
import { ThemeToggle } from './ThemeToggle';
import { useEmpresaStore } from '../store/empresaStore';
import { Link } from 'react-router-dom';

export function Header() {
  const empresa = useEmpresaStore((state) => state.empresa);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gray-800 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Menu Toggle */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <button onClick={toggleMenu} className="text-white">
              {isMenuOpen ? (
                <X className="h-6 w-6 cursor-pointer" />
              ) : (
                <Menu className="h-6 w-6 cursor-pointer" />
              )}
            </button>
            <h1 className="ml-2 text-xl font-bold">
              {empresa?.nome}
            </h1>
          </motion.div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <NotificacoesMenu />
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer"
            >
              <User className="h-5 w-5 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gray-800 text-white rounded-md mt-2 p-4 space-y-4"
          >
            <Link to="/" className="block hover:text-gray-300">
              Dashboard
            </Link>
            <Link to="/calendario" className="block hover:text-gray-300">
              Calendário
            </Link>
            <Link to="/registro" className="block hover:text-gray-300">
              Minha Empresa
            </Link>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
