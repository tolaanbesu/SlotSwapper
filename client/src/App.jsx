// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import LoginScreen from './pages/Login';
import SignupScreen from './pages/Signup';
import DashboardScreen from './pages/Dashboard';
import RequestsScreen from './pages/Requests';
import MarketplaceScreen from './pages/Marketplace';

// Simple Router based on state for a single-file application
const Router = () => {
    const { user } = useAuth();
    const [currentPage, setPage] = useState(null); // initially null

    // Effect to handle navigation based on authentication state
    useEffect(() => {
        // Only set page once user state is loaded
        if (user !== undefined) {
            if (user && (currentPage === 'login' || currentPage === 'signup' || currentPage === null)) {
                setPage('dashboard');
            } else if (!user && (currentPage !== 'login' && currentPage !== 'signup')) {
                setPage('login');
            }
        }
    }, [user, currentPage]);

    if (!currentPage) {
        return <div className="p-8 text-center">Loading...</div>; // temporary fallback
    }

    const props = { currentPage, setPage };

    switch (currentPage) {
        case 'login':
            return <LoginScreen {...props} />;
        case 'signup':
            return <SignupScreen {...props} />;
        case 'dashboard':
            return <DashboardScreen {...props} />;
        case 'requests':
            return <RequestsScreen {...props} />;
        case 'marketplace':
            return <MarketplaceScreen {...props} />;
        default:
            return <div className="p-8 text-center">404 Page Not Found</div>;
    }
};

// Main application wrapper
const App = () => (
    <AuthProvider>
        <Router />
    </AuthProvider>
);

export default App;

// import { Routes, Route, Link, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import Marketplace from './pages/Marketplace';
// import Requests from './pages/Requests';

// function Nav() {
//   const { user, logout } = useAuth();
//   return (
//     <nav className="bg-white shadow p-4 flex justify-between items-center">
//       <div className="flex items-center gap-4">
//         <Link to="/" className="font-bold text-green-700">SlotSwapper</Link>
//         {user && <>
//           <Link to="/" className="text-sm text-gray-600">Dashboard</Link>
//           <Link to="/marketplace" className="text-sm text-gray-600">Marketplace</Link>
//           <Link to="/requests" className="text-sm text-gray-600">Requests</Link>
//         </>}
//       </div>
//       <div>
//         {user ? (
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-gray-700">{user.name}</span>
//             <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
//           </div>
//         ) : (
//           <div className="flex gap-2">
//             <Link to="/login" className="text-sm text-gray-600">Login</Link>
//             <Link to="/signup" className="text-sm text-gray-600">Sign up</Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

// function Protected({ children }) {
//   const { token } = useAuth();
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// }

// export default function App() {
//   return (
//     <div>
//       <div className="max-w-6xl mx-auto p-6">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/" element={<Protected><Dashboard /></Protected>} />
//           <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
//           <Route path="/requests" element={<Protected><Requests /></Protected>} />
//         </Routes>
//       </div>
//     </div>
//   );
// }
