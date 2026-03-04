import {
  MoreHorizontal,
  Store,
  DollarSign,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
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

const areaData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 180 },
  { name: 'Wed', value: 150 },
  { name: 'Thu', value: 310 },
  { name: 'Fri', value: 250 },
  { name: 'Sat', value: 220 },
  { name: 'Sun', value: 280 },
];

const barData = [
  { name: '1', value: 40, color: '#FCD34D' }, // amber-300
  { name: '2', value: 70, color: '#34D399' }, // emerald-400
  { name: '3', value: 30, color: '#F87171' }, // red-400
  { name: '4', value: 50, color: '#34D399' },
  { name: '5', value: 20, color: '#F87171' },
  { name: '6', value: 60, color: '#FCD34D' },
];

const bancasData = [
  { name: 'Banca Central', value: '0.91k RD$', trend: '+10%', up: true },
  { name: 'Sucursal Norte', value: '0.89k RD$', trend: '+19%', up: true },
  { name: 'Los Alcarrizos', value: '1.1k RD$', trend: '-17%', up: false },
  { name: 'Villa Mella', value: '0.71k RD$', trend: '+22%', up: true }
];

const recentOps = [
  { name: 'Banca Central', amount: 'RD$400,000', detail: '0.000345 %', up: true },
  { name: 'Sucursal Sur', amount: 'RD$500,000', detail: '0.000678 %', up: true },
  { name: 'Agencia Este', amount: 'RD$786,000', detail: '0.000687 %', up: true },
  { name: 'Los Prados', amount: 'RD$667,000', detail: '0.000761 %', up: true },
  { name: 'Piantini', amount: 'RD$348,000', detail: '0.000302 %', up: false },
];

export default function Dashboard() {
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
                <span className="flex items-center gap-1.5"><Store className="size-4" /> 142 Bancas</span>
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
                      <span className="text-amber-500 text-xs">⬩</span> RD$125.4k
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
                      <span className="text-emerald-500 text-xs">⬩</span> RD$41.2k
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
                      <span className="text-red-500 text-xs">⬩</span> RD$84.2k
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
              {bancasData.map((banca, i) => (
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
                <div className="absolute hidden sm:block" style={{ left: '52%', top: '23%' }}>
                  <div className="size-3 rounded-full bg-[#8B5CF6] border-2 border-white shadow-md"></div>
                </div>
                <div className="absolute px-2 py-1 bg-[#8B5CF6] text-white text-[10px] font-bold rounded-md shadow-sm" style={{ left: '48%', top: '4%' }}>RD$310k</div>
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
            <h2 className="text-[32px] tracking-tight font-black mb-6 relative z-10">RD$521,652</h2>

            <div className="flex justify-between items-end relative z-10">
              <div>
                <p className="text-white/80 text-[11px] font-medium mb-0.5">Ganancia Mensual</p>
                <p className="text-lg font-bold">RD$14,225</p>
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
            {recentOps.map((op, i) => (
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
