 // src/components/layout/Sidebar.jsx

import { useAuth } from '../../context/AuthContext';
import { PRIMARY_GREEN, LIGHT_BLUE_ACTIVE, LIGHT_GREEN_ACTIVE } from '../../api';
import { LogOut, User, Settings, LayoutGrid, Repeat, Users } from 'lucide-react';

const NavItem = ({ name, page, activeColor, currentPage, setPage, icon: Icon }) => {
    const isActive = currentPage === page;
    const activeClass = isActive ? activeColor : 'hover:bg-gray-100';
    return (
      <button
        onClick={() => setPage(page)}
        className={`flex items-center p-3 rounded-xl w-full text-left font-medium transition duration-150 ${activeClass}`}
      >
        <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-current' : 'text-gray-500'}`} />
        {name}
      </button>
    );
};

const Sidebar = ({ user, currentPage, setPage }) => {
    const auth = useAuth();
    const menuItems = [
      { name: 'My Schedule', page: 'dashboard', icon: LayoutGrid, activeColor: LIGHT_BLUE_ACTIVE },
      { name: 'Swaps', page: 'requests', icon: Repeat, activeColor: LIGHT_GREEN_ACTIVE },
      { name: 'Contacts', page: 'contacts', icon: Users, activeColor: LIGHT_BLUE_ACTIVE },
      { name: 'Profile', page: 'profile', icon: User, activeColor: LIGHT_BLUE_ACTIVE },
    ];

    return (
      <div className="w-64 h-full p-4 flex flex-col justify-between overflow-y-auto top-2">
        {/* Top Section - Profile & Main Nav */}
        <div>
          

          <nav className="space-y-1">
            {menuItems.slice(0, 2).map(item => (
              <NavItem key={item.page} {...item} currentPage={currentPage} setPage={setPage} />
            ))}
            {/* Direct Marketplace link for "New Swap" feel */}
            <NavItem name="Marketplace" page="marketplace" icon={Repeat} activeColor={LIGHT_GREEN_ACTIVE} currentPage={currentPage} setPage={setPage} />
            {menuItems.slice(2).map(item => (
              <NavItem key={item.page} {...item} currentPage={currentPage} setPage={setPage} />
            ))}
          </nav>
        </div>

        {/* Bottom Section - Settings/Logout */}
        <div className="mt-8">
          <nav className="space-y-1">
            <NavItem name="Settings" page="settings" icon={Settings} activeColor={LIGHT_BLUE_ACTIVE} currentPage={currentPage} setPage={setPage} />
            <button
              onClick={auth.logout}
              className="flex items-center p-3 rounded-xl w-full text-left font-medium text-red-500 hover:bg-red-50 transition duration-150"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Log out
            </button>
          </nav>
        </div>
      </div>
    );
};

export default Sidebar;



