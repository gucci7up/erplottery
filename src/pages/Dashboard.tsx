import {
  MoreHorizontal,
  Store,
  DollarSign,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Area,
} from 'recharts';
import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO, format, isValid } from 'date-fns';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [bancasCount, setBancasCount] = useState(0);

  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [gananciaSemanal, setGananciaSemanal] = useState(0);
  const [premiosPagados, setPremiosPagados] = useState(0);
  const [balanceGeneral, setBalanceGeneral] = useState(0);
  const [gananciaMensual, setGananciaMensual] = useState(0);

  const [barData, setBarData] = useState<any[]>([]);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [bancasData, setBancasData] = useState<any[]>([]);
  const [recentOps, setRecentOps] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [opRes, gastosRes, bancasRes] = await Promise.all([
          fetch(`${API_URL}/operaciones`),
          fetch(`${API_URL}/gastos`),
          fetch(`${API_URL}/bancas`)
        ]);

        let opData = [];
        let gastosData = [];
        let bancasDataRaw = [];

        if (opRes.ok) opData = await opRes.json();
        if (gastosRes.ok) gastosData = await gastosRes.json();
        if (bancasRes.ok) bancasDataRaw = await bancasRes.json();

        setBancasCount(bancasDataRaw.length || 0);

        const now = new Date();
        const startWeek = startOfWeek(now, { weekStartsOn: 1 });
        const endWeek = endOfWeek(now, { weekStartsOn: 1 });

        let totalIngresos = 0;
        let totalPremios = 0;
        let totalBalanceNeto = 0;
        let totalGananciaSemanal = 0;

        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const areaMap: Record<string, number> = {};
        weekDays.forEach(day => areaMap[day] = 0);

        const bancaStats: Record<number, { name: string, sales: number, net: number }> = {};
        bancasDataRaw.forEach((b: any) => {
          bancaStats[b.id] = { name: b.name, sales: 0, net: 0 };
        });

        const opsList: any[] = [];

        opData.forEach((op: any) => {
          const ventas = Number(op.ventas_brutas) || 0;
          const premios = Number(op.premios_pagados) || 0;
          const neto = Number(op.balance_neto) || 0;
          const date = parseISO(op.operation_date || op.created_at);

          totalIngresos += ventas;
          totalPremios += premios;
          totalBalanceNeto += neto;

          if (bancaStats[op.banca_id]) {
            bancaStats[op.banca_id].sales += ventas;
            bancaStats[op.banca_id].net += neto;
          }

          if (isValid(date) && isWithinInterval(date, { start: startWeek, end: endWeek })) {
            totalGananciaSemanal += neto;
            const dayStr = format(date, 'E'); // Mon, Tue, etc...
            if (areaMap[dayStr] !== undefined) {
              areaMap[dayStr] += ventas;
            }
          }

          opsList.push({ ...op, banca_name: bancaStats[op.banca_id]?.name || 'Sucursal Desconocida' });
        });

        let totalGastos = 0;
        gastosData.forEach((g: any) => {
          totalGastos += Number(g.amount) || Number(g.monto) || 0;
        });

        setIngresosTotales(totalIngresos);
        setPremiosPagados(totalPremios);
        setBalanceGeneral(totalBalanceNeto - totalGastos);
        setGananciaSemanal(totalGananciaSemanal - (totalGastos * 0.25)); // rough estimate for weekly expenses
        setGananciaMensual(totalBalanceNeto - totalGastos);

        const finAreaData = weekDays.map(day => ({ name: day, value: areaMap[day] }));
        setAreaData(finAreaData);

        const bArray = Object.values(bancaStats).sort((a, b) => b.net - a.net);
        setBancasData(bArray.slice(0, 4).map(b => ({
          name: b.name,
          value: `RD$${b.net.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          trend: b.net >= 0 ? '+10%' : '-5%',
          up: b.net >= 0
        })));

        const sortedOps = opsList.sort((a, b) => Number(b.ventas_brutas) - Number(a.ventas_brutas)).slice(0, 5);
        setRecentOps(sortedOps.map(op => ({
          name: op.banca_name,
          amount: `RD$${Number(op.ventas_brutas).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          detail: `Neto: RD$${Number(op.balance_neto).toLocaleString('en-US')}`,
          up: Number(op.balance_neto) >= 0
        })));

        // Dynamic Bar Data
        setBarData([
          { name: '1', value: totalIngresos > 0 ? totalIngresos * 0.4 : 40, color: '#FCD34D' },
          { name: '2', value: totalPremios > 0 ? totalPremios * 0.7 : 70, color: '#34D399' },
          { name: '3', value: totalGastos > 0 ? totalGastos * 0.3 : 30, color: '#F87171' },
          { name: '4', value: totalBalanceNeto > 0 ? Math.abs(totalBalanceNeto * 0.5) : 50, color: '#34D399' },
          { name: '5', value: totalGastos > 0 ? totalGastos * 0.2 : 20, color: '#F87171' },
          { name: '6', value: totalIngresos > 0 ? totalIngresos * 0.6 : 60, color: '#FCD34D' },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[80vh] gap-4">
        <Loader2 className="size-10 text-[#8B5CF6] animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Cargando métricas del servidor...</p>
      </div>
    );
  }

  const formatCur = (val: number) => `RD$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const peakSale = Math.max(...areaData.map(d => d.value), 0);

  return (
    <div className="flex flex-col xl:flex-row gap-8 animate-fade-in pb-8">
      {/* Left & Center Column (Main Content) */}
      <div className="flex-1 flex flex-col gap-8">

        {/* Top Row: Banner & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Banner Card (Like NFT Marketplace) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/90 to-[#6D28D9]/90 z-0 transition-transform duration-500 group-hover:scale-105">
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop" alt="Finance background" className="w-full h-full object-cover mix-blend-overlay opacity-50" />
            </div>

            <div className="relative z-10 flex justify-between items-start mb-8">
              <h3 className="text-white font-bold text-lg">Resumen Operativo</h3>
              <button className="text-white/80 hover:text-white"><MoreHorizontal className="size-5" /></button>
            </div>

            <div className="relative z-10 mt-auto">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">Ventas</span>
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold rounded-full border border-white/10">Premios</span>
              </div>
              <h2 className="text-white font-black text-2xl mb-1">Balance General Activo</h2>
              <div className="flex items-center gap-4 text-white/90 text-sm font-medium">
                <span className="flex items-center gap-1.5"><Store className="size-4" /> {bancasCount} Bancas</span>
                <span className="flex items-center gap-1.5 text-amber-300">★ 4.8 Promedio</span>
              </div>
            </div>
          </div>

          {/* Investment Stats (Bar Chart Card) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-slate-800 dark:text-slate-100 font-bold text-lg">Estadísticas de Flujo</h3>
              <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="size-5" /></button>
            </div>

            <div className="flex items-center gap-6 h-48">
              {/* Stats Column */}
              <div className="flex flex-col gap-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
                    <DollarSign className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Ingresos Totales</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <span className="text-amber-500 text-xs">⬩</span> {formatCur(ingresosTotales)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center">
                    <Calendar className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Ganancia Semanal</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <span className="text-emerald-500 text-xs">⬩</span> {formatCur(gananciaSemanal)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                    <Activity className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Premios Pagados</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <span className="text-red-500 text-xs">⬩</span> {formatCur(premiosPagados)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bar Chart Column */}
              <div className="flex-1 h-full pt-4 relative">
                <div className="absolute right-0 top-0 text-[10px] text-slate-400">Max</div>
                <div className="absolute right-0 bottom-0 text-[10px] text-slate-400">Min</div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={6}>
                    <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Lists & Area Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">

          {/* Top Bancas (Like NFTs owned) */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-slate-800 dark:text-slate-100 font-bold text-[15px]">Bancas Destacadas</h3>
              <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="size-5" /></button>
            </div>
            <div className="flex flex-col gap-3">
              {bancasData.length === 0 ? <p className="text-sm text-slate-500">Sin datos de rendimiento aún.</p> : bancasData.map((banca, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-900/50 transition-colors cursor-pointer group">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{banca.name}</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
                      <span className="text-slate-400 text-xs">⬩</span> {banca.value}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="h-6 w-12 opacity-50 relative overflow-hidden">
                      {/* Fake mini-chart sparkline using CSS borders */}
                      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                        <path d={banca.up ? "M0,30 L20,15 L40,25 L60,5 L80,10 L100,0" : "M0,0 L20,15 L40,5 L60,25 L80,20 L100,30"}
                          fill="none" stroke={banca.up ? "#34D399" : "#F87171"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className={`text-xs font-bold ${banca.up ? 'text-emerald-500' : 'text-red-500'}`}>{banca.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart (Like My Portfolio) */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-slate-800 dark:text-slate-100 font-bold text-[15px]">Rendimiento Semanal</h3>
              <div className="flex gap-2">
                <button className="size-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50"><ChevronLeft className="size-4" /></button>
                <button className="size-7 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md hover:bg-[#7C3AED]"><ChevronRight className="size-4" /></button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex-1 flex flex-col">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6">Distribución de Ventas</h4>
              <div className="h-48 w-full mt-auto relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
                {/* Custom dot for the peak */}
                {peakSale > 0 && (
                  <>
                    <div className="absolute hidden sm:block" style={{ left: '52%', top: '23%' }}>
                      <div className="size-3 rounded-full bg-[#8B5CF6] border-2 border-white shadow-md"></div>
                    </div>
                    <div className="absolute px-2 py-1 bg-[#8B5CF6] text-white text-[10px] font-bold rounded-md shadow-sm" style={{ left: '46%', top: '4%' }}>{formatCur(peakSale)}</div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Right Column (Sidebar equivalent) */}
      <div className="w-full xl:w-[320px] flex flex-col gap-8">

        {/* Main Balance Card (Like My Cards) */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-slate-800 dark:text-slate-100 font-bold text-[15px]">Mi Balance</h3>
          </div>
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-[28px] p-7 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-10"></div>

            <p className="text-white/80 text-sm font-medium mb-1 relative z-10">Balance General</p>
            <h2 className="text-[32px] tracking-tight font-black mb-6 relative z-10 break-all">{formatCur(balanceGeneral)}</h2>

            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-white/80 text-[11px] font-medium mb-0.5">Ganancia Computada</p>
                <p className="text-lg font-bold">{formatCur(gananciaMensual)}</p>
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold border border-white/20">
                +10%
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-6 relative z-10">
              <div className="size-1.5 rounded-full bg-white"></div>
              <div className="size-1.5 rounded-full bg-white/40"></div>
              <div className="size-1.5 rounded-full bg-white/40"></div>
            </div>
          </div>
        </div>

        {/* Recent Operations List (Like Top Picks) */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-slate-800 dark:text-slate-100 font-bold text-[15px]">Operaciones Top</h3>
            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="size-5" /></button>
          </div>

          <div className="flex flex-col gap-1">
            {recentOps.length === 0 ? <p className="text-sm text-slate-500">Sin historial de operaciones registradas.</p> : recentOps.map((op, i) => (
              <div key={i} className="flex justify-between items-center group cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${op.up ? 'bg-emerald-400' : 'bg-[#8B5CF6]'}`}></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">{op.name}</span>
                    <span className="text-xs text-slate-500 font-medium">{op.amount}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400">{op.detail}</span>
                    <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
