import React, { useEffect } from 'react';
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
import Navbar from './components/Navbar'; // Importando a Navbar
import { onAuthStateChanged } from 'firebase/auth'; // Importando para verificar mudanças no estado de autenticação
import { auth } from './config/firebase'; // Importando a configuração do Firebase

function App() {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Monitorando as mudanças no estado de autenticação do Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    id: user.uid,
                    nome: user.displayName || 'Usuário',
                    email: user.email || '',
                    cargo: 'admin',
                });
            } else {
                setUser(null); // Limpa o estado se não houver usuário
            }
        });

        return () => unsubscribe(); // Limpa a assinatura quando o componente for desmontado
    }, [setUser]);

    return (
        <Router>
            <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
                {/* Exibindo a Navbar */}
                <Navbar />
                {isAuthenticated && <Header />}
                <Routes>
                    <Route path="/login" element={
                        isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />
                    } />
                    <Route path="/registro" element={
                        isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />
                    } />
                    <Route path="/acesso-negado" element={<AccessDenied />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    <div className="px-4 py-6 sm:px-0">
                                        <CadastroEmpresa />
                                        <Dashboard />
                                    </div>
                                </main>
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
