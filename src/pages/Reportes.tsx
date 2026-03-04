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

const COLORS = ['#8B5CF6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const performanceData = [
  { name: 'Banca Central', ventas: 45000, premios: 12500, gastos: 3200 },
  { name: 'Sucursal Herrera', ventas: 28500, premios: 18200, gastos: 2100 },
  { name: 'Agencia Los Mina', ventas: 15200, premios: 16500, gastos: 1800 },
];

export default function Reportes() {
  const [dateRange, setDateRange] = useState('Esta Semana');
  const [reportType, setReportType] = useState('general');

  const getMultiplier = (range: string) => {
    switch (range) {
      case 'Hoy': return 0.15;
      case 'Esta Semana': return 1;
      case 'Este Mes': return 4.2;
      case 'Mes Anterior': return 3.9;
      case 'Este Año': return 48;
      default: return 1;
    }
  };

  const multiplier = getMultiplier(dateRange);

  const dynamicSalesData = salesData.map(d => ({
    ...d,
    ventas: Math.floor(d.ventas * multiplier),
    premios: Math.floor(d.premios * multiplier)
  }));

  const dynamicExpenseData = expenseData.map(d => ({
    ...d,
    value: Math.floor(d.value * multiplier)
  }));

  const dynamicPerformance = performanceData.map(d => {
    const v = Math.floor(d.ventas * multiplier);
    const p = Math.floor(d.premios * multiplier);
    const g = Math.floor(d.gastos * multiplier);
    const neta = v - p - g;
    const margin = Math.round((neta / v) * 100);
    return { name: d.name, ventas: v, premios: p, gastos: g, neta, margin };
  });

  const handleExport = (type: string) => {
    alert(`Generando y descargando reporte ${type} para el periodo: ${dateRange}...`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Reportes y Analíticas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Visualiza el rendimiento financiero y operativo de las bancas.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-2xl shadow-sm transition-colors"
          >
            <Download className="size-4" strokeWidth={2.5} />
            Exportar PDF
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
          >
            <FileText className="size-4" strokeWidth={3} />
            Generar Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl">
          <button
            onClick={() => setReportType('general')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${reportType === 'general'
              ? 'bg-white text-[#8B5CF6] dark:bg-slate-700 dark:text-purple-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setReportType('ventas')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${reportType === 'ventas'
              ? 'bg-white text-[#8B5CF6] dark:bg-slate-700 dark:text-purple-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
          >
            Ventas vs Premios
          </button>
          <button
            onClick={() => setReportType('gastos')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${reportType === 'gastos'
              ? 'bg-white text-[#8B5CF6] dark:bg-slate-700 dark:text-purple-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
          >
            Análisis de Gastos
          </button>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full sm:w-auto pl-11 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] appearance-none transition-all"
            >
              <option value="Hoy">Hoy</option>
              <option value="Esta Semana">Esta Semana</option>
              <option value="Este Mes">Este Mes</option>
              <option value="Mes Anterior">Mes Anterior</option>
              <option value="Este Año">Este Año</option>
            </select>
          </div>
          <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Ventas vs Premios Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BarChart2 className="size-6 text-[#8B5CF6]" strokeWidth={2.5} />
                Ventas vs Premios
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Comparativa diaria ({dateRange})</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dynamicSalesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} tickFormatter={(value) => `RD$${value}`} />
                <Tooltip
                  cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  labelStyle={{ color: '#64748b', fontWeight: 700, marginBottom: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }} />
                <Bar dataKey="ventas" name="Ventas Brutas" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="premios" name="Premios Pagados" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Gastos Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PieChart className="size-6 text-amber-500" strokeWidth={2.5} />
                Distribución de Gastos
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Desglose por categoría ({dateRange})</p>
            </div>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={dynamicExpenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `RD$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                  labelStyle={{ display: 'none' }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600 }} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rendimiento por Banca (Table Summary) */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="size-6 text-emerald-500" strokeWidth={2.5} />
                Rendimiento por Sucursal
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Top bancas por ganancia neta ({dateRange})</p>
            </div>
            <button className="text-[#8B5CF6] text-sm font-bold hover:text-purple-700 transition-colors">Ver Reporte Completo &rarr;</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Sucursal</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Ventas</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Premios</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Gastos</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Ganancia Neta</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-center">Margen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {dynamicPerformance.map((sucursal, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-5 font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">{sucursal.name}</td>
                    <td className="px-6 py-5 text-right text-sm font-medium text-slate-600 dark:text-slate-300">RD${sucursal.ventas.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 text-right text-sm font-bold text-rose-500 dark:text-rose-400">-RD${sucursal.premios.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-5 text-right text-sm font-medium text-slate-500 dark:text-slate-400">-RD${sucursal.gastos.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className={`px-6 py-5 text-right text-[15px] font-black ${sucursal.neta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {sucursal.neta >= 0 ? '' : '-'}RD${Math.abs(sucursal.neta).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border ${sucursal.margin >= 0
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                          : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                        }`}>
                        {sucursal.margin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
