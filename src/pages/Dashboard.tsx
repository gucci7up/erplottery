import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Tag, Trophy, DollarSign, Store, Download, Eye } from 'lucide-react';

const data = [
  { name: 'MON', sales: 4000, profit: 2400 },
  { name: 'TUE', sales: 3000, profit: 1398 },
  { name: 'WED', sales: 2000, profit: 9800 },
  { name: 'THU', sales: 2780, profit: 3908 },
  { name: 'FRI', sales: 1890, profit: 4800 },
  { name: 'SAT', sales: 2390, profit: 3800 },
  { name: 'SUN', sales: 3490, profit: 4300 },
];

const recentOperations = [
  {
    id: '1',
    banca: 'Banca Central #01',
    code: 'B1',
    date: 'Hoy, 10:45 AM',
    amount: '$1,250.00',
    status: 'Completado',
  },
  {
    id: '2',
    banca: 'Sucursal Noroeste',
    code: 'B8',
    date: 'Hoy, 09:20 AM',
    amount: '$840.50',
    status: 'Pendiente',
  },
  {
    id: '3',
    banca: 'Agencia Los Alcarrizos',
    code: 'A2',
    date: 'Ayer',
    amount: '$3,100.00',
    status: 'Completado',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Bienvenido de nuevo
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Métricas de rendimiento en tiempo real y resumen operativo.
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Tag className="text-blue-600 size-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              +12.5%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ventas Totales</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            $125,430.00
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Trophy className="text-amber-600 size-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded-full">
              -2.4%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Premios Totales</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            $84,200.00
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <DollarSign className="text-emerald-600 size-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              +18.2%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ganancia Neta</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            $41,230.00
          </h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Store className="text-indigo-600 size-5" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
              +3%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Bancas Activas</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">142</h3>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Rendimiento Semanal
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Comparación de ventas y pagos en los últimos 7 días
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
              <Download className="size-4" />
              PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Eye className="size-4" />
              Detalles
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-8 mb-4">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-slate-500">Ventas Brutas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold text-slate-500">Ganancia Neta</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f8fafc',
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#34d399"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Tables / Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Operaciones Recientes</h4>
            <a href="#" className="text-blue-600 text-sm font-bold hover:underline">
              Ver Todas
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Banca
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOperations.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                          {op.code}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {op.banca}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {op.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100">
                      {op.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                          op.status === 'Completado'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {op.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Bancas Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h4 className="font-bold mb-6 text-slate-900 dark:text-slate-100">
            Distribución por Zona
          </h4>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700 dark:text-slate-300">Distrito Nacional</span>
                <span className="text-slate-500">65%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700 dark:text-slate-300">Santo Domingo Este</span>
                <span className="text-slate-500">20%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700 dark:text-slate-300">Santiago</span>
                <span className="text-slate-500">10%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-700 dark:text-slate-300">Otros</span>
                <span className="text-slate-500">5%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
          <button className="w-full mt-10 py-3 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            Ver Demografía Detallada
          </button>
        </div>
      </div>
    </div>
  );
}
