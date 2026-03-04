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
  HelpCircle,
  Search,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bancas', href: '/bancas', icon: Store },
  { name: 'Empleados', href: '/empleados', icon: Users },
  { name: 'Operaciones Diarias', href: '/operaciones', icon: CalendarDays },
  { name: 'Nómina', href: '/nomina', icon: Banknote },
  { name: 'Gastos Mensuales', href: '/gastos', icon: Receipt },
  { name: 'Contabilidad General', href: '/contabilidad', icon: Calculator },
  { name: 'Reportes', href: '/reportes', icon: BarChart3 },
];

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout disabled for now
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-6 flex flex-col gap-8 h-full">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Store className="size-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">LotteryERP</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Admin Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm',
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <item.icon className="size-[22px]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/configuracion"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm',
                  pathname === '/configuracion'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <Settings className="size-[22px]" />
                <span>Configuración</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="size-[22px]" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Contextual Header Title could go here */}
          </div>
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <HelpCircle className="size-5" />
              </button>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold leading-tight">Admin User</span>
                <span className="text-[10px] text-slate-500 font-medium">System Manager</span>
              </div>
              <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
