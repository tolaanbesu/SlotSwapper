// // src/components/Layout/Applayout.jsx
// import React from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { Link } from 'react-router-dom';
// import Sidebar from './Sidebar'; // Assuming you have a Sidebar component

// export default function AppLayout({ children, currentPage, setPage }) {
//   const { user, logout } = useAuth();

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <Sidebar currentPage={currentPage} setPage={setPage} />

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Navbar */}
//         <nav className="bg-white shadow p-4 flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <Link to="/" className="font-bold text-green-700">SlotSwapper</Link>
//             {user && (
//               <>
//                 <Link to="/" className="text-sm text-gray-600">Dashboard</Link>
//                 <Link to="/marketplace" className="text-sm text-gray-600">Marketplace</Link>
//                 <Link to="/requests" className="text-sm text-gray-600">Requests</Link>
//               </>
//             )}
//           </div>
//           <div>
//             {user ? (
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-700">{user.name}</span>
//                 <button
//                   onClick={logout}
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <div className="flex gap-2">
//                 <Link to="/login" className="text-sm text-gray-600">Login</Link>
//                 <Link to="/signup" className="text-sm text-gray-600">Sign up</Link>
//               </div>
//             )}
//           </div>
//         </nav>

//         {/* Children / Page Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';

export default function AppLayout({ children, currentPage, setPage }) {
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center w-full fixed top-0 left-0 z-20">
        <div className="flex items-center gap-4">
          <div className="font-bold text-green-700">SlotSwapper</div>
          {user && (
            <>
              <span className="text-sm text-gray-600">Dashboard</span>
              <span className="text-sm text-gray-600">Marketplace</span>
              <span className="text-sm text-gray-600">Requests</span>
            </>
          )}
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </nav>

      <div className="flex pt-16"> {/* Add padding-top to push content below navbar */}
        {/* Sidebar below navbar */}
        <Sidebar user={user} currentPage={currentPage} setPage={setPage} />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
