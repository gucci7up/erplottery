import { useState } from 'react';
import { Search, Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data
const initialLibroDiario = [
  { id: '1', date: new Date('2023-11-15T09:00:00'), account: '1001 - Efectivo en Caja', description: 'Apertura de caja Banca Central', debit: 5000, credit: 0, reference: 'OP-001' },
  { id: '2', date: new Date('2023-11-15T09:00:00'), account: '3001 - Capital Social', description: 'Apertura de caja Banca Central', debit: 0, credit: 5000, reference: 'OP-001' },
  { id: '3', date: new Date('2023-11-15T14:30:00'), account: '1001 - Efectivo en Caja', description: 'Ventas del día (Turno Mañana)', debit: 15000, credit: 0, reference: 'VD-045' },
  { id: '4', date: new Date('2023-11-15T14:30:00'), account: '4001 - Ingresos por Ventas', description: 'Ventas del día (Turno Mañana)', debit: 0, credit: 15000, reference: 'VD-045' },
  { id: '5', date: new Date('2023-11-15T16:00:00'), account: '5001 - Gasto de Premios', description: 'Pago de premio mayor', debit: 8000, credit: 0, reference: 'PR-102' },
  { id: '6', date: new Date('2023-11-15T16:00:00'), account: '1001 - Efectivo en Caja', description: 'Pago de premio mayor', debit: 0, credit: 8000, reference: 'PR-102' },
];

export default function ContabilidadGeneral() {
  const [libroDiario, setLibroDiario] = useState(initialLibroDiario);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredLibro = libroDiario.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDebit = filteredLibro.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = filteredLibro.reduce((sum, entry) => sum + entry.credit, 0);

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Contabilidad General
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Libro diario, mayor general y asientos contables automáticos.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-2xl shadow-sm transition-colors">
            <FileText className="size-4" strokeWidth={2.5} />
            Generar Estado de Resultados
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
            <Download className="size-4" strokeWidth={3} />
            Exportar Libro Diario
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <ArrowUpRight className="text-emerald-600 dark:text-emerald-400 size-7" strokeWidth={3} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Total Débitos (Día)</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/40 dark:to-pink-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <ArrowDownRight className="text-rose-600 dark:text-rose-400 size-7" strokeWidth={3} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Total Créditos (Día)</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className={`p-4 rounded-2xl border ${totalDebit === totalCredit ? 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border-white/50 dark:border-slate-700 shadow-sm' : 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-white/50 dark:border-slate-700 shadow-sm'}`}>
            <FileText className={`size-7 ${totalDebit === totalCredit ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`} strokeWidth={3} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Estado de Cuadre</p>
            <h3 className={`text-3xl font-black mt-1 ${totalDebit === totalCredit ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {totalDebit === totalCredit ? 'Cuadrado' : 'Descuadre'}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-[500px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por cuenta, descripción o ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-black text-lg text-slate-900 dark:text-slate-100">Libro Diario</h3>
          <span className="text-sm font-bold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: es })}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Fecha / Hora
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Ref.
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Cuenta Contable
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Débito (Debe)
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Crédito (Haber)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredLibro.map((entry, index) => {
                // Determine if this row is the start of a new transaction (based on reference)
                const isNewTransaction = index === 0 || entry.reference !== filteredLibro[index - 1].reference;

                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${isNewTransaction ? 'border-t-[3px] border-slate-100 dark:border-slate-800' : ''}`}
                  >
                    <td className="px-6 py-4">
                      {isNewTransaction && (
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {format(entry.date, 'dd MMM yyyy', { locale: es })}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                            {format(entry.date, 'hh:mm a')}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isNewTransaction && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 font-mono tracking-wider">
                          {entry.reference}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-[13px] font-bold font-mono ${entry.credit > 0 ? 'pl-8 text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {entry.account}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {entry.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {entry.debit > 0 ? (
                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                          RD${entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {entry.credit > 0 ? (
                        <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                          RD${entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-t-[3px] border-slate-200 dark:border-slate-700">
                <td colSpan={4} className="px-6 py-5 text-right font-black text-lg text-slate-900 dark:text-slate-100">
                  TOTALES:
                </td>
                <td className="px-6 py-5 text-right font-black text-lg text-emerald-600 dark:text-emerald-400">
                  RD${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-5 text-right font-black text-lg text-rose-600 dark:text-rose-400">
                  RD${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {filteredLibro.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No se encontraron registros contables para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
