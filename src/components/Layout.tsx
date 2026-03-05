import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  CalendarDays,
  Banknote,
  Receipt,
  Calculator,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { API_URL } from '../config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bancas', href: '/bancas', icon: Store },
  { name: 'Empleados', href: '/empleados', icon: Users },
  { name: 'Operaciones', href: '/operaciones', icon: CalendarDays },
  { name: 'Nómina', href: '/nomina', icon: Banknote },
  { name: 'Gastos', href: '/gastos', icon: Receipt },
  { name: 'Contabilidad', href: '/contabilidad', icon: Calculator },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
];

import { useState, useEffect } from 'react';

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('LotteryERP');
  const [companyLogo, setCompanyLogo] = useState('');

  useEffect(() => {
    const fetchCompanySettings = async () => {
      try {
        const res = await fetch(`${API_URL}/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.company_name) setCompanyName(data.company_name);
          if (data.company_logo) setCompanyLogo(data.company_logo);
        }
      } catch (err) {
        console.error('Error fetching settings for Layout:', err);
      }
    };
    fetchCompanySettings();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const currentRouteName = navigation.find(n => n.href === pathname)?.name || companyName;

  return (
    <div className="flex h-screen w-full bg-[#E5DDF9] dark:bg-slate-950 p-2 sm:p-4 lg:p-6 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <div className="flex-1 flex overflow-hidden relative bg-[#F8F9FA] dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-white/50">

        {/* Spacer for Sidebar to prevent content shift */}
        <div className="w-[88px] flex-shrink-0 hidden sm:block" />

        {/* Floating Expandable Sidebar */}
        <aside className="absolute left-0 top-0 h-full w-[88px] hover:w-[260px] group/sidebar bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 flex flex-col py-8 z-30 transition-all duration-300 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Brand Logo */}
          <div className="mb-10 px-4 flex items-center justify-center group/logo relative w-full">
            <div className="flex items-center gap-4 w-full justify-center group-hover/sidebar:justify-start group-hover/sidebar:px-2 transition-all duration-300">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0 transition-transform group-hover/sidebar:scale-105 overflow-hidden">
                {companyLogo ? (
                  <img src={`${API_URL.replace('/api', '')}${companyLogo}`} alt={companyName} className="w-full h-full object-contain bg-white" />
                ) : (
                  <Store className="size-6 shrink-0" />
                )}
              </div>
              {/* Expanded Text */}
              <span className="text-xl font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent opacity-0 w-0 -translate-x-4 group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:translate-x-0 transition-all duration-300 overflow-hidden whitespace-nowrap">
                {companyName}
              </span>
            </div>

            {/* Tooltip (only shows when collapsed) */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover/logo:opacity-100 group-hover/logo:visible group-hover/sidebar:hidden transition-all whitespace-nowrap z-50">
              {companyName}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-3 w-full px-4 overflow-y-auto no-scrollbar">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.name} className="relative group/navitem w-full flex justify-center group-hover/sidebar:justify-start">
                  {isActive && (
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] rounded-r-full" />
                  )}
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center w-12 group-hover/sidebar:w-full h-12 rounded-2xl transition-all duration-300 overflow-hidden',
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-[#7C3AED] dark:text-purple-400 shadow-sm shadow-purple-100'
                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600'
                    )}
                  >
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <item.icon className="size-6 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    {/* Expanded Text */}
                    <span className={cn(
                      "font-bold text-sm opacity-0 -translate-x-4 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 transition-all duration-300 whitespace-nowrap",
                      isActive ? "text-[#7C3AED] dark:text-purple-400" : "text-slate-600 dark:text-slate-400"
                    )}>
                      {item.name}
                    </span>
                  </Link>

                  {/* Tooltip (only shows when collapsed) */}
                  <div className="absolute left-[56px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible group-hover/sidebar:hidden transition-all whitespace-nowrap z-50">
                    {item.name}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto pt-4 flex flex-col gap-3 w-full px-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className="relative group/action w-full flex justify-center group-hover/sidebar:justify-start">
              <Link
                to="/configuracion"
                className={cn(
                  'flex items-center w-12 group-hover/sidebar:w-full h-12 rounded-2xl transition-all duration-300 overflow-hidden',
                  pathname === '/configuracion'
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-[#7C3AED] dark:text-purple-400'
                    : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-600'
                )}
              >
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <Settings className="size-6 shrink-0" strokeWidth={pathname === '/configuracion' ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "font-bold text-sm opacity-0 -translate-x-4 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 transition-all duration-300 whitespace-nowrap",
                  pathname === '/configuracion' ? "text-[#7C3AED] dark:text-purple-400" : "text-slate-600 dark:text-slate-400"
                )}>
                  Configuración
                </span>
              </Link>
              <div className="absolute left-[56px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible group-hover/sidebar:hidden transition-all whitespace-nowrap z-50">
                Configuración
              </div>
            </div>

            <div className="relative group/action w-full flex justify-center group-hover/sidebar:justify-start">
              <button
                onClick={handleLogout}
                className="flex items-center w-12 group-hover/sidebar:w-full h-12 rounded-2xl transition-all duration-300 overflow-hidden text-slate-400 dark:text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <LogOut className="size-6 shrink-0" strokeWidth={2} />
                </div>
                <span className="font-bold text-sm opacity-0 -translate-x-4 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 transition-all duration-300 whitespace-nowrap">
                  Cerrar Sesión
                </span>
              </button>
              <div className="absolute left-[56px] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover/action:opacity-100 group-hover/action:visible group-hover/sidebar:hidden transition-all whitespace-nowrap z-50">
                Cerrar Sesión
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header */}
          <header className="h-[88px] flex-shrink-0 px-8 lg:px-12 flex items-center justify-between border-b border-black/[0.03] dark:border-white/[0.02] bg-white/40 backdrop-blur-xl z-10">
            <h1 className="text-[28px] font-black bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
              {currentRouteName}
            </h1>

            <div className="flex items-center gap-6">
              {/* Search Bar - hidden on very small screens */}
              <div className="relative w-72 hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  type="text"
                  placeholder="Buscar cualquier cosa..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all placeholder:text-slate-400 shadow-sm shadow-slate-200/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="relative p-3 text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-colors shadow-sm shadow-transparent hover:shadow-slate-200/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                  <Bell className="size-5" />
                  <span className="absolute top-3 right-3 size-2 bg-red-500 rounded-full border-2 border-[#F8F9FA] dark:border-slate-900"></span>
                </button>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="size-11 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-white dark:border-slate-700 shadow-sm flex items-center justify-center p-0.5 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=8B5CF6&color=fff&bold=true" alt="User" className="w-full h-full rounded-xl object-cover" />
                </div>
                <div className="hidden lg:flex flex-col items-start leading-tight">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">Admin User</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">System Manager</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto w-full p-8 lg:p-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
