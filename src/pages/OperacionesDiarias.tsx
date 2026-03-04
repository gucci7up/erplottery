import { useState } from 'react';
import { Plus, Search, Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data
const initialOperaciones = [
  { id: '1', date: new Date(), type: 'ventas', amount: 15000, description: 'Ventas del día - Turno Mañana', banca: 'Banca Central', user: 'Ana M.' },
  { id: '2', date: new Date(), type: 'premios', amount: 4500, description: 'Pago de premios - Sorteo Tarde', banca: 'Banca Central', user: 'Ana M.' },
  { id: '3', date: new Date(Date.now() - 86400000), type: 'gastos', amount: 1200, description: 'Material gastable (Rollos)', banca: 'Sucursal Herrera', user: 'Carlos R.' },
  { id: '4', date: new Date(Date.now() - 86400000), type: 'ventas', amount: 8500, description: 'Ventas del día', banca: 'Sucursal Herrera', user: 'Carlos R.' },
  { id: '5', date: new Date(Date.now() - 172800000), type: 'recargas', amount: 3000, description: 'Recargas telefónicas', banca: 'Agencia Los Mina', user: 'Luis P.' },
];

const tiposMovimiento = [
  { value: 'ventas', label: 'Ventas', color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:border-emerald-900/30 dark:text-emerald-400 dark:bg-emerald-900/20' },
  { value: 'ganancias', label: 'Ganancias', color: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:border-emerald-900/30 dark:text-emerald-400 dark:bg-emerald-900/20' },
  { value: 'premios', label: 'Premios', color: 'text-rose-600 bg-rose-50 border-rose-100 dark:border-rose-900/30 dark:text-rose-400 dark:bg-rose-900/20' },
  { value: 'recargas', label: 'Recargas', color: 'text-blue-600 bg-blue-50 border-blue-100 dark:border-blue-900/30 dark:text-blue-400 dark:bg-blue-900/20' },
  { value: 'gastos', label: 'Material Gastable', color: 'text-amber-600 bg-amber-50 border-amber-100 dark:border-amber-900/30 dark:text-amber-400 dark:bg-amber-900/20' },
  { value: 'dieta', label: 'Dieta', color: 'text-amber-600 bg-amber-50 border-amber-100 dark:border-amber-900/30 dark:text-amber-400 dark:bg-amber-900/20' },
  { value: 'cuentas_pagar', label: 'Cuentas por Pagar', color: 'text-rose-600 bg-rose-50 border-rose-100 dark:border-rose-900/30 dark:text-rose-400 dark:bg-rose-900/20' },
  { value: 'cuentas_cobrar', label: 'Cuentas por Cobrar', color: 'text-blue-600 bg-blue-50 border-blue-100 dark:border-blue-900/30 dark:text-blue-400 dark:bg-blue-900/20' },
];

export default function OperacionesDiarias() {
  const [operaciones, setOperaciones] = useState(initialOperaciones);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredOperaciones = operaciones.filter(
    (op) =>
      op.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.banca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (type: string) => {
    const found = tiposMovimiento.find(t => t.value === type);
    return found ? found.color : 'text-slate-600 bg-slate-50 border-slate-200 dark:border-slate-800 dark:text-slate-400 dark:bg-slate-900/30';
  };

  const getTipoLabel = (type: string) => {
    const found = tiposMovimiento.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Operaciones Diarias
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Registro de movimientos, ventas, premios y gastos.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-2xl shadow-sm transition-colors">
            <Download className="size-4" strokeWidth={2.5} />
            Exportar
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
          >
            <Plus className="size-4" strokeWidth={3} />
            Registrar Operación
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por descripción o banca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
            />
          </div>
          <select className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
            <option value="all">Todos los Tipos</option>
            {tiposMovimiento.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
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
                  Tipo
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Banca / Usuario
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Monto
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredOperaciones.map((op) => (
                <tr
                  key={op.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">
                      {format(op.date, 'dd MMM yyyy', { locale: es })}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {format(op.date, 'hh:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border ${getTipoColor(op.type)}`}>
                      {getTipoLabel(op.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {op.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {op.banca}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      Por: {op.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`text-sm font-black flex items-center justify-end gap-1 ${['ventas', 'ganancias', 'recargas', 'cuentas_cobrar'].includes(op.type)
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                      }`}>
                      {['ventas', 'ganancias', 'recargas', 'cuentas_cobrar'].includes(op.type) ? (
                        <ArrowUpRight className="size-4" strokeWidth={3} />
                      ) : (
                        <ArrowDownRight className="size-4" strokeWidth={3} />
                      )}
                      RD${op.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOperaciones.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No se encontraron operaciones para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <span>Mostrando {filteredOperaciones.length} resultados</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
              Anterior
            </button>
            <button className="px-4 py-2 rounded-xl border border-transparent bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-bold shadow-md">
              1
            </button>
            <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm bg-white dark:bg-slate-800">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal (Flexible Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Registrar Operación Diaria
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-900/30 transition-colors"
              >
                <Plus className="size-5 rotate-45" />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Fecha de Operación
                  </label>
                  <input
                    type="date"
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Tipo de Movimiento
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
                    <option value="">Seleccionar tipo...</option>
                    {tiposMovimiento.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Monto
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
                    Banca Asociada
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
                    <option value="">Seleccionar banca...</option>
                    <option value="1">Banca Central</option>
                    <option value="2">Sucursal Herrera</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  Descripción / Notas
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  placeholder="Detalles adicionales de la operación..."
                ></textarea>
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
                Guardar Operación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
