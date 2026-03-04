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
  { value: 'ventas', label: 'Ventas', color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' },
  { value: 'ganancias', label: 'Ganancias', color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' },
  { value: 'premios', label: 'Premios', color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30' },
  { value: 'recargas', label: 'Recargas', color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' },
  { value: 'gastos', label: 'Material Gastable', color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30' },
  { value: 'dieta', label: 'Dieta', color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30' },
  { value: 'cuentas_pagar', label: 'Cuentas por Pagar', color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30' },
  { value: 'cuentas_cobrar', label: 'Cuentas por Cobrar', color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' },
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
    return found ? found.color : 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/30';
  };

  const getTipoLabel = (type: string) => {
    const found = tiposMovimiento.find(t => t.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Operaciones Diarias
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Registro de movimientos, ventas, premios y gastos.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg shadow-sm transition-colors">
            <Download className="size-4" />
            Exportar
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="size-4" />
            Registrar Operación
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por descripción o banca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            />
          </div>
          <select className="w-full sm:w-auto px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
            <option value="all">Todos los Tipos</option>
            {tiposMovimiento.map(tipo => (
              <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Banca / Usuario
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Monto
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOperaciones.map((op) => (
                <tr
                  key={op.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {format(op.date, 'dd MMM yyyy', { locale: es })}
                    </div>
                    <div className="text-xs text-slate-500">
                      {format(op.date, 'hh:mm a')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${getTipoColor(op.type)}`}>
                      {getTipoLabel(op.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                      {op.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {op.banca}
                    </div>
                    <div className="text-xs text-slate-500">
                      Por: {op.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`text-sm font-bold flex items-center justify-end gap-1 ${
                      ['ventas', 'ganancias', 'recargas', 'cuentas_cobrar'].includes(op.type)
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {['ventas', 'ganancias', 'recargas', 'cuentas_cobrar'].includes(op.type) ? (
                        <ArrowUpRight className="size-4" />
                      ) : (
                        <ArrowDownRight className="size-4" />
                      )}
                      ${op.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOperaciones.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No se encontraron operaciones para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
          <span>Mostrando {filteredOperaciones.length} resultados</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">
              Anterior
            </button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold">
              1
            </button>
            <button className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal (Flexible Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Registrar Operación Diaria
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <Plus className="size-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Fecha de Operación
                  </label>
                  <input
                    type="date"
                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Tipo de Movimiento
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
                    <option value="">Seleccionar tipo...</option>
                    {tiposMovimiento.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Monto
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Banca Asociada
                  </label>
                  <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500">
                    <option value="">Seleccionar banca...</option>
                    <option value="1">Banca Central</option>
                    <option value="2">Sucursal Herrera</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Descripción / Notas
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  placeholder="Detalles adicionales de la operación..."
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                Guardar Operación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
