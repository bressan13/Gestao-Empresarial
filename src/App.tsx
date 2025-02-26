// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CadastroEmpresa } from './components/CadastroEmpresa';
import { Calendar } from './components/Calendar/Calendar';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { AccessDenied } from './components/Auth/AccessDenied';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { doc, getDoc } from 'firebase/firestore'; // Importar Firestore
import { db } from './config/firebase'; // Configuração do Firebase


function App() {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const { isAuthenticated, user } = useAuthStore((state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
    }));
    const [empresaCadastrada, setEmpresaCadastrada] = useState<boolean>(false); // Inicializa como false
    const [empresa, setEmpresa] = useState<any>(null); // Estado para armazenar os dados da empresa

    // Aplica tema escuro/claro
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Verificar se a empresa está cadastrada
    useEffect(() => {
        const verificarCadastroEmpresa = async () => {
            if (isAuthenticated && user?.id) {
                try {
                    const userDocRef = doc(db, 'usuarios', user.id); // Referência ao documento do usuário
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const empresaData = userDoc.data().empresa;
                        setEmpresaCadastrada(!!empresaData); // Atualiza o estado com base na presença de dados da empresa
                        setEmpresa(empresaData || null); // Atualiza com os dados da empresa, ou null se não houver
                    } else {
                        console.error('Documento do usuário não encontrado.');
                        setEmpresaCadastrada(false); // Assume que não está cadastrada
                    }
                } catch (error) {
                    console.error('Erro ao verificar cadastro da empresa:', error);
                    setEmpresaCadastrada(false);
                }
            } else {
                setEmpresaCadastrada(false); // Caso não autenticado
            }
        };

        verificarCadastroEmpresa();
    }, [isAuthenticated, user]);

    // Renderizar carregamento até verificar estado
    if (empresaCadastrada === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Carregando...
            </div>
        );
    }

    return (
        <Router>
            <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
                
                <Header />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />} />
                    <Route path="/registro" element={isAuthenticated ? <Navigate to="/cadastro-empresa" replace /> : <RegisterForm />} />
                    <Route path="/acesso-negado" element={<AccessDenied />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                {empresaCadastrada ? <Dashboard /> : <Navigate to="/cadastro-empresa" replace />}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cadastro-empresa"
                        element={
                            <ProtectedRoute>
                                <CadastroEmpresa 
                                    setEmpresaCadastrada={setEmpresaCadastrada} 
                                    empresa={empresa} // Passando os dados da empresa para o CadastroEmpresa
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/calendario"
                        element={
                            <ProtectedRoute>
                                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    <Calendar />
                                </main>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
