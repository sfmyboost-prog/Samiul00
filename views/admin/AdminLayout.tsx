
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  List, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Maximize, 
  TrendingUp,
  ChevronDown,
  ChevronRight,
  FileText
} from '../../components/common/Icons';
import { useStore } from '../../context/StoreContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setAdmin, adminProfile } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEcommerceOpen, setIsEcommerceOpen] = useState(pathname === '/admin/products' || pathname === '/admin/categories');

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    setAdmin(false);
    navigate('/admin/login');
  };

  const isEcommerceActive = pathname === '/admin/products' || pathname === '/admin/categories';

  return (
    <div className="min-h-screen bg-[#f4f4f7] flex">
      {/* Sidebar */}
      <aside className={`bg-[#1e1e2d] text-gray-400 fixed h-full z-40 transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f85606] rounded-md flex-shrink-0 flex items-center justify-center font-bold text-white">S</div>
          <span className={`text-white font-bold text-xl tracking-tight transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>SuperAdmin</span>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          <Link 
            to="/admin/dashboard"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              pathname === '/admin/dashboard' ? 'bg-[#f85606] text-white' : 'hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard size={20} className={pathname === '/admin/dashboard' ? 'text-white' : 'group-hover:text-white'} />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Dashboard
            </span>
          </Link>

          {/* Ecommerce Collapsible Menu */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsEcommerceOpen(!isEcommerceOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                isEcommerceActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <ShoppingCart size={20} className={isEcommerceActive ? 'text-[#f85606]' : 'group-hover:text-white'} />
                <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  Ecommerce
                </span>
              </div>
              {isSidebarOpen && (
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${isEcommerceOpen ? 'rotate-180' : ''}`} 
                />
              )}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isEcommerceOpen ? 'max-h-40' : 'max-h-0'}`}>
              <div className="pl-12 space-y-1 py-1">
                <Link 
                  to="/admin/products"
                  className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                    pathname === '/admin/products' ? 'text-[#f85606] font-bold' : 'hover:text-white'
                  }`}
                >
                  Products
                </Link>
                <Link 
                  to="/admin/categories"
                  className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                    pathname === '/admin/categories' ? 'text-[#f85606] font-bold' : 'hover:text-white'
                  }`}
                >
                  Categories
                </Link>
              </div>
            </div>
          </div>

          <Link 
            to="/admin/media"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              pathname === '/admin/media' ? 'bg-[#f85606] text-white' : 'hover:bg-gray-800'
            }`}
          >
            <Package size={20} className={pathname === '/admin/media' ? 'text-white' : 'group-hover:text-white'} />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Media Manager
            </span>
          </Link>

          <Link 
            to="/admin/orders"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              pathname === '/admin/orders' ? 'bg-[#f85606] text-white' : 'hover:bg-gray-800'
            }`}
          >
            <ShoppingCart size={20} className={pathname === '/admin/orders' ? 'text-white' : 'group-hover:text-white'} />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Orders
            </span>
          </Link>

          <Link 
            to="/admin/customers"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              pathname === '/admin/customers' ? 'bg-[#f85606] text-white' : 'hover:bg-gray-800'
            }`}
          >
            <Users size={20} className={pathname === '/admin/customers' ? 'text-white' : 'group-hover:text-white'} />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Customers
            </span>
          </Link>

          <Link 
            to="/admin/report"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              pathname === '/admin/report' ? 'bg-[#f85606] text-white' : 'hover:bg-gray-800'
            }`}
          >
            <TrendingUp size={20} className={pathname === '/admin/report' ? 'text-white' : 'group-hover:text-white'} />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Reports
            </span>
          </Link>

          <Link 
            to="/admin/settings"
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              pathname === '/admin/settings' ? 'bg-[#f85606] text-white' : 'hover:bg-gray-800'
            }`}
          >
            <Settings size={20} className={pathname === '/admin/settings' ? 'text-white' : 'group-hover:text-white'} />
            <span className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              Store Setting
            </span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all group mt-auto"
          >
            <LogOut size={20} />
            <span className={`font-medium whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Log Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <header className="bg-white h-20 shadow-sm flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
            >
              <Maximize size={20} />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f85606]" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-64 outline-none focus:ring-1 focus:ring-[#f85606] transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-md">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{adminProfile.firstName} {adminProfile.lastName}</p>
                <p className="text-[10px] text-gray-500">{adminProfile.role}</p>
              </div>
              <img src="https://picsum.photos/seed/admin/40/40" className="w-10 h-10 rounded-full border-2 border-gray-100 group-hover:border-[#f85606] transition-all" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
