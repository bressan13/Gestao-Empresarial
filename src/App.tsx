import React from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CadastroEmpresa } from './components/CadastroEmpresa';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <CadastroEmpresa />
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;