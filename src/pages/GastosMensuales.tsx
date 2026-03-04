import { useState } from 'react';
import { Plus, Search, Calendar, Filter, Download, ArrowDownRight, FileText, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data
const initialGastos = [
  { id: '1', date: new Date('2023-10-05'), category: 'Alquiler', amount: 25000, description: 'Alquiler local Banca Central', status: 'Pagado' },
  { id: '2', date: new Date('2023-10-10'), category: 'Servicios', amount: 8500, description: 'Factura Eléctrica (Edesur)', status: 'Pagado' },
  { id: '3', date: new Date('2023-10-15'), category: 'Mantenimiento', amount: 3500, description: 'Reparación de inversor', status: 'Pagado' },
  { id: '4', date: new Date('2023-11-05'), category: 'Alquiler', amount: 25000, description: 'Alquiler local Banca Central', status: 'Pendiente' },
  { id: '5', date: new Date('2023-11-10'), category: 'Servicios', amount: 4200, description: 'Internet y Teléfono (Claro)', status: 'Pendiente' },
];

const categoriasGasto = [
  { value: 'alquiler', label: 'Alquiler de Locales' },
  { value: 'servicios', label: 'Servicios (Luz, Agua, Internet)' },
  { value: 'mantenimiento', label: 'Mantenimiento y Reparaciones' },
  { value: 'suministros', label: 'Suministros de Oficina' },
  { value: 'impuestos', label: 'Impuestos y Licencias' },
  { value: 'otros', label: 'Otros Gastos Operativos' },
];

export default function GastosMensuales() {
  const [gastos, setGastos] = useState(initialGastos);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2023-11');

  const filteredGastos = gastos.filter(
    (g) =>
      g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Gastos Mensuales Fijos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Control de alquileres, servicios, mantenimiento y otros gastos operativos.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-2xl shadow-sm transition-colors">
            <Download className="size-4" strokeWidth={2.5} />
            Reporte
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
          >
            <Plus className="size-4" strokeWidth={3} />
            Registrar Gasto
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <ArrowDownRight className="text-rose-600 dark:text-rose-400 size-7" strokeWidth={3} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Total Gastos (Mes)</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD$66,200.00</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <FileText className="text-amber-600 dark:text-amber-400 size-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Cuentas por Pagar</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD$29,200.00</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">Mayor Gasto: Alquiler</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">75%</h3>
              <span className="text-sm font-medium text-slate-500">del total</span>
            </div>
          </div>
          <div className="relative size-16 drop-shadow-sm">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="4"></circle>
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#8B5CF6]" strokeWidth="4" strokeDasharray="100" strokeDashoffset="25" strokeLinecap="round"></circle>
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-[#8B5CF6]">
              75%
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por descripción o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
            />
          </div>
          <select className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
            <option value="all">Todas las Categorías</option>
            {categoriasGasto.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Monto
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredGastos.map((gasto) => (
                <tr
                  key={gasto.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">
                      {format(gasto.date, 'dd MMM yyyy', { locale: es })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {gasto.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-sm truncate">
                      {gasto.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                      RD${gasto.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border ${gasto.status === 'Pagado'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                        }`}
                    >
                      {gasto.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredGastos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No se encontraron gastos para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Registrar Nuevo Gasto Fijo
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-900/30 transition-colors"
              >
                <Plus className="size-5 rotate-45" />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Fecha de Facturación
                    </label>
                    <input
                      type="date"
                      defaultValue={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Categoría
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
                      <option value="">Seleccionar...</option>
                      {categoriasGasto.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Descripción del Gasto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Pago de alquiler mes actual"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Monto Total
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-bold sm:text-sm">RD$</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Estado de Pago
                    </label>
                    <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
                      <option value="pendiente">Pendiente de Pago</option>
                      <option value="pagado">Pagado</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Banca / Sucursal Asociada (Opcional)
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
                    <option value="">Aplica a todas (Gasto General)</option>
                    <option value="1">Banca Central</option>
                    <option value="2">Sucursal Herrera</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105">
                Registrar Gasto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
