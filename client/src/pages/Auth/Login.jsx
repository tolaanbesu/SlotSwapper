
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../components/common/PasswordInput';
import Logo from '../../components/common/logo';
import { PRIMARY_BLUE } from '../../api';
import { Mail } from 'lucide-react';

const LoginScreen = ({ setPage }) => {
    const { handleAuth, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const result = await handleAuth('login', { email, password });

        if (!result.success) {
            setError(result.message);
        }else{
            setPage('dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-2xl transition duration-500">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                    Welcome Back!
                </h2>
                <p className="text-center text-gray-600 mb-8">
                    Sign in to access your dashboard.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                            required
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />

                    {error && (
                        <p className="text-sm text-red-500 font-medium text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white ${PRIMARY_BLUE} hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-300 disabled:opacity-50`}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setPage('signup')}
                            className={`font-semibold text-sky-600 hover:text-sky-800 transition duration-150 focus:outline-none`}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;