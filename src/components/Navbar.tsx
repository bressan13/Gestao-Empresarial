import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Gestão Empresarial
                </Link>
                <div className="hidden md:flex space-x-4">
                    <Link to="/" className="hover:text-gray-300">Dashboard</Link>
                    <Link to="/calendario" className="hover:text-gray-300">Calendário</Link>
                    <Link to="/login" className="hover:text-gray-300">Login</Link>
                    <Link to="/registro" className="hover:text-gray-300">Registro</Link>
                </div>
                {/* Menu Toggle for Mobile */}
                <button onClick={toggleMenu} className="md:hidden text-white">
                    <span className="material-icons">menu</span>
                </button>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden flex flex-col space-y-4 mt-4">
                    <Link to="/" className="hover:text-gray-300">Dashboard</Link>
                    <Link to="/calendario" className="hover:text-gray-300">Calendário</Link>
                    <Link to="/login" className="hover:text-gray-300">Login</Link>
                    <Link to="/registro" className="hover:text-gray-300">Registro</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
