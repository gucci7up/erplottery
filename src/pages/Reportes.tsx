import { useState } from 'react';
import { Download, Calendar, Filter, FileText, PieChart, BarChart2, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for charts
const salesData = [
  { name: 'Lun', ventas: 4000, premios: 2400 },
  { name: 'Mar', ventas: 3000, premios: 1398 },
  { name: 'Mié', ventas: 2000, premios: 9800 },
  { name: 'Jue', ventas: 2780, premios: 3908 },
  { name: 'Vie', ventas: 1890, premios: 4800 },
  { name: 'Sáb', ventas: 2390, premios: 3800 },
  { name: 'Dom', ventas: 3490, premios: 4300 },
];

const expenseData = [
  { name: 'Alquiler', value: 25000 },
  { name: 'Nómina', value: 111500 },
  { name: 'Servicios', value: 12700 },
  { name: 'Mantenimiento', value: 3500 },
  { name: 'Otros', value: 5000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Reportes() {
  const [dateRange, setDateRange] = useState('Esta Semana');
  const [reportType, setReportType] = useState('general');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Reportes y Analíticas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Visualiza el rendimiento financiero y operativo de las bancas.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg shadow-sm transition-colors">
            <Download className="size-4" />
            Exportar PDF
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
            <FileText className="size-4" />
            Generar Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setReportType('general')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
              reportType === 'general'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setReportType('ventas')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
              reportType === 'ventas'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Ventas vs Premios
          </button>
          <button
            onClick={() => setReportType('gastos')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
              reportType === 'gastos'
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Análisis de Gastos
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 appearance-none"
            >
              <option value="Hoy">Hoy</option>
              <option value="Esta Semana">Esta Semana</option>
              <option value="Este Mes">Este Mes</option>
              <option value="Mes Anterior">Mes Anterior</option>
              <option value="Este Año">Este Año</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas vs Premios Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart2 className="size-5 text-blue-600" />
                Ventas vs Premios
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comparativa diaria ({dateRange})</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="ventas" name="Ventas Brutas" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="premios" name="Premios Pagados" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Gastos Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PieChart className="size-5 text-amber-500" />
                Distribución de Gastos
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Desglose por categoría ({dateRange})</p>
            </div>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rendimiento por Banca (Table Summary) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="size-5 text-emerald-500" />
                Rendimiento por Sucursal
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Top bancas por ganancia neta ({dateRange})</p>
            </div>
            <button className="text-blue-600 text-sm font-bold hover:underline">Ver Reporte Completo</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Sucursal</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ventas</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Premios</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Gastos</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ganancia Neta</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Margen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Banca Central</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">$45,000.00</td>
                  <td className="px-6 py-4 text-right text-sm text-rose-600 dark:text-rose-400">-$12,500.00</td>
                  <td className="px-6 py-4 text-right text-sm text-amber-600 dark:text-amber-400">-$3,200.00</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">$29,300.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      65%
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Sucursal Herrera</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">$28,500.00</td>
                  <td className="px-6 py-4 text-right text-sm text-rose-600 dark:text-rose-400">-$18,200.00</td>
                  <td className="px-6 py-4 text-right text-sm text-amber-600 dark:text-amber-400">-$2,100.00</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">$8,200.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      28%
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">Agencia Los Mina</td>
                  <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">$15,200.00</td>
                  <td className="px-6 py-4 text-right text-sm text-rose-600 dark:text-rose-400">-$16,500.00</td>
                  <td className="px-6 py-4 text-right text-sm text-amber-600 dark:text-amber-400">-$1,800.00</td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600 dark:text-rose-400">-$3,100.00</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                      -20%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
