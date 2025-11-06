
import {  LIGHT_BLUE_ACTIVE, LIGHT_GREEN_ACTIVE } from '../../api';
import { User, LayoutGrid, Repeat, Users, Info, Mail } from 'lucide-react';

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

const Sidebar = ({ currentPage, setPage }) => {
  const menuItems = [
    { name: 'My Schedule', page: 'dashboard', icon: LayoutGrid, activeColor: LIGHT_BLUE_ACTIVE },
    { name: 'Swaps', page: 'requests', icon: Repeat, activeColor: LIGHT_GREEN_ACTIVE },
    { name: 'Contacts', page: 'contacts', icon: Users, activeColor: LIGHT_BLUE_ACTIVE },
    { name: 'Profile', page: 'profile', icon: User, activeColor: LIGHT_BLUE_ACTIVE },
  ];

  return (
    <div className="w-64 h-full p-4 flex flex-col justify-between overflow-y-auto top-4">
      {/* Top Section - Profile & Main Nav */}
      <div>
        <nav className="space-y-1">
          {menuItems.slice(0, 2).map(item => (
            <NavItem key={item.page} {...item} currentPage={currentPage} setPage={setPage} />
          ))}
          {/* Direct Marketplace link for "New Swap" feel */}
          <NavItem
            name="Marketplace"
            page="marketplace"
            icon={Repeat}
            activeColor={LIGHT_GREEN_ACTIVE}
            currentPage={currentPage}
            setPage={setPage}
          />
          {menuItems.slice(2).map(item => (
            <NavItem key={item.page} {...item} currentPage={currentPage} setPage={setPage} />
          ))}
        </nav>
      </div>

      {/* Bottom Section - About / Contact */}
      <div className="mt-8">
        <nav className="space-y-1">
          <NavItem
            name="About"
            page="about"
            icon={Info}
            activeColor={LIGHT_BLUE_ACTIVE}
            currentPage={currentPage}
            setPage={setPage}
          />
          <NavItem
            name="Contact Us"
            page="contact"
            icon={Mail}
            activeColor={LIGHT_BLUE_ACTIVE}
            currentPage={currentPage}
            setPage={setPage}
          />
          
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
