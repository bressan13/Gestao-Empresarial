import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useNotificacoesStore } from '../store/notificacoesStore';

export function NotificacoesMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { notificacoes, marcarComoLida, removerNotificacao } = useNotificacoesStore();
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6 text-indigo-600" />
        {naoLidas > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {naoLidas}
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-[9999]"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Notificações</h3>
              {notificacoes.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhuma notificação</p>
              ) : (
                <div className="space-y-3">
                  {notificacoes.map((notificacao) => (
                    <motion.div
                      key={notificacao.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-3 rounded-lg ${
                        notificacao.lida ? 'bg-gray-50' : 'bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{notificacao.titulo}</h4>
                          <p className="text-sm text-gray-600">
                            {notificacao.mensagem}
                          </p>
                        </div>
                        <button
                          onClick={() => removerNotificacao(notificacao.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {!notificacao.lida && (
                        <button
                          onClick={() => marcarComoLida(notificacao.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-800 mt-2"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}