import { useState, useEffect, useMemo } from 'react';
import { Download, Calendar, Filter, FileText, PieChart, BarChart2, TrendingUp, Loader2 } from 'lucide-react';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { API_URL } from '../config';

const COLORS = ['#8B5CF6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#6366f1'];

export default function Reportes() {
  const [dateRange, setDateRange] = useState('Esta Semana');
  const [reportType, setReportType] = useState('general');
  const [operaciones, setOperaciones] = useState<any[]>([]);
  const [gastos, setGastos] = useState<any[]>([]);
  const [nomina, setNomina] = useState<any[]>([]);
  const [bancas, setBancas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ops, gsts, noms, bncs] = await Promise.all([
          fetch(`${API_URL}/operaciones`).then(res => res.json()),
          fetch(`${API_URL}/gastos`).then(res => res.json()),
          fetch(`${API_URL}/pagos-nomina`).then(res => res.json()),
          fetch(`${API_URL}/bancas`).then(res => res.json()),
        ]);
        setOperaciones(ops);
        setGastos(gsts);
        setNomina(noms);
        setBancas(bncs);
      } catch (error) {
        console.error('Error fetching Data for reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStartDate = (range: string) => {
    const today = new Date();
    switch (range) {
      case 'Hoy': return startOfDay(today);
      case 'Esta Semana': return startOfWeek(today, { weekStartsOn: 1 });
      case 'Este Mes': return startOfMonth(today);
      case 'Mes Anterior': {
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        return lastMonth;
      }
      case 'Este Año': return startOfYear(today);
      default: return startOfWeek(today, { weekStartsOn: 1 });
    }
  };

  const startOfDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const isDateInRange = (dateString: string, rangeStartDate: Date, isLastMonthOnly = false) => {
    const d = new Date(`${dateString}T00:00:00`);
    if (isLastMonthOnly) {
      const today = new Date();
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      endOfLastMonth.setHours(23, 59, 59, 999);
      return isAfter(d, rangeStartDate) && !isAfter(d, endOfLastMonth);
    }
    return d >= rangeStartDate;
  };

  const filterData = (data: any[], dateField: string, rangeStr: string) => {
    const startDate = getStartDate(rangeStr);
    const isLastMonthOnly = rangeStr === 'Mes Anterior';
    return data.filter(item => isDateInRange(item[dateField], startDate, isLastMonthOnly));
  };

  const currentOperaciones = useMemo(() => filterData(operaciones, 'operation_date', dateRange), [operaciones, dateRange]);
  const currentGastos = useMemo(() => filterData(gastos, 'expense_date', dateRange), [gastos, dateRange]);
  const currentNomina = useMemo(() => filterData(nomina, 'payment_date', dateRange), [nomina, dateRange]);

  const dynamicSalesData = useMemo(() => {
    // Generate breakdown for Bar chart (By Day of short period, or By Month for year)
    // For simplicity formatting as Day of Week 'EEE' inside "Esta Semana", 'dd' for Month, etc.
    const aggregated: Record<string, { ventas: number, premios: number }> = {};

    currentOperaciones.forEach((op) => {
      let formatStr = 'eee'; // short day like 'Mon'
      if (dateRange === 'Este Mes' || dateRange === 'Mes Anterior') formatStr = 'dd MMM';
      if (dateRange === 'Este Año') formatStr = 'MMM';
      if (dateRange === 'Hoy') formatStr = 'HH:mm';

      const key = format(new Date(`${op.operation_date}T00:00:00`), formatStr, { locale: es });

      if (!aggregated[key]) {
        aggregated[key] = { ventas: 0, premios: 0 };
      }
      aggregated[key].ventas += Number(op.ventas_brutas) || 0;
      aggregated[key].premios += Number(op.premios_pagados) || 0;
    });

    return Object.keys(aggregated).map(key => ({
      name: key.substring(0, 1).toUpperCase() + key.substring(1), // Capitalize first letter
      ventas: aggregated[key].ventas,
      premios: aggregated[key].premios
    }));
  }, [currentOperaciones, dateRange]);

  const dynamicExpenseData = useMemo(() => {
    const aggregated: Record<string, number> = {};

    currentGastos.forEach(g => {
      const cat = g.category || 'Otros';
      aggregated[cat] = (aggregated[cat] || 0) + Number(g.amount);
    });

    // Subtotal nominal since it's an expense but tracked differently
    const totalNomina = currentNomina.reduce((acc, n) => acc + Number(n.net_pay || 0), 0);
    if (totalNomina > 0) {
      aggregated['Nómina'] = (aggregated['Nómina'] || 0) + totalNomina;
    }

    return Object.keys(aggregated).map(key => ({
      name: key,
      value: aggregated[key]
    })).filter(x => x.value > 0).sort((a, b) => b.value - a.value); // sort largest slice first
  }, [currentGastos, currentNomina]);

  const dynamicPerformance = useMemo(() => {
    const agg: Record<string, { ventas: number, premios: number, gastos: number }> = {};

    bancas.forEach(b => {
      agg[b.name] = { ventas: 0, premios: 0, gastos: 0 };
    });

    currentOperaciones.forEach(op => {
      const bName = op.banca ? op.banca.name : 'Central';
      if (!agg[bName]) agg[bName] = { ventas: 0, premios: 0, gastos: 0 };
      agg[bName].ventas += Number(op.ventas_brutas) || 0;
      agg[bName].premios += Number(op.premios_pagados) || 0;
      agg[bName].gastos += Number(op.gastos_banca) || 0;
    });

    currentGastos.forEach(g => {
      if (g.banca) {
        if (!agg[g.banca.name]) agg[g.banca.name] = { ventas: 0, premios: 0, gastos: 0 };
        agg[g.banca.name].gastos += Number(g.amount) || 0;
      }
    });

    const perf = Object.keys(agg).map(name => {
      const d = agg[name];
      const neta = d.ventas - d.premios - d.gastos;
      const margin = d.ventas > 0 ? Math.round((neta / d.ventas) * 100) : 0;
      return { name, ventas: d.ventas, premios: d.premios, gastos: d.gastos, neta, margin };
    });

    return perf.sort((a, b) => b.neta - a.neta); // Sort by highest net income
  }, [bancas, currentOperaciones, currentGastos]);

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
      <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] z-10 rounded-3xl">
            <Loader2 className="size-8 text-[#8B5CF6] animate-spin" />
          </div>
        )}
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
                  {dynamicExpenseData.map((entry, index) => (
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
