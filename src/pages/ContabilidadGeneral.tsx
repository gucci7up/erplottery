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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Contabilidad General
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Libro diario, mayor general y asientos contables automáticos.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg shadow-sm transition-colors">
            <FileText className="size-4" />
            Generar Estado de Resultados
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
            <Download className="size-4" />
            Exportar Libro Diario
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
            <ArrowUpRight className="text-emerald-600 size-6" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Débitos (Día)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
            <ArrowDownRight className="text-rose-600 size-6" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Créditos (Día)</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${totalDebit === totalCredit ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
            <FileText className={`size-6 ${totalDebit === totalCredit ? 'text-blue-600' : 'text-amber-600'}`} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Estado de Cuadre</p>
            <h3 className={`text-2xl font-bold ${totalDebit === totalCredit ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {totalDebit === totalCredit ? 'Cuadrado' : 'Descuadre'}
            </h3>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por cuenta, descripción o ref..."
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
          <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Libro Diario</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Fecha / Hora
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ref.
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Cuenta Contable
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Débito (Debe)
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Crédito (Haber)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLibro.map((entry, index) => {
                // Determine if this row is the start of a new transaction (based on reference)
                const isNewTransaction = index === 0 || entry.reference !== filteredLibro[index - 1].reference;
                
                return (
                  <tr
                    key={entry.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isNewTransaction ? 'border-t-2 border-slate-200 dark:border-slate-700' : ''}`}
                  >
                    <td className="px-6 py-3">
                      {isNewTransaction && (
                        <>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {format(entry.date, 'dd MMM yyyy', { locale: es })}
                          </div>
                          <div className="text-xs text-slate-500">
                            {format(entry.date, 'hh:mm a')}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {isNewTransaction && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-mono">
                          {entry.reference}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className={`text-sm font-bold font-mono ${entry.credit > 0 ? 'pl-6 text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {entry.account}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {entry.description}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {entry.debit > 0 ? (
                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ${entry.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-3 text-right">
                      {entry.credit > 0 ? (
                        <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                          ${entry.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {/* Totals Row */}
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-300 dark:border-slate-600">
                <td colSpan={4} className="px-6 py-4 text-right font-black text-slate-900 dark:text-slate-100">
                  TOTALES:
                </td>
                <td className="px-6 py-4 text-right font-black text-emerald-600 dark:text-emerald-400">
                  ${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-right font-black text-rose-600 dark:text-rose-400">
                  ${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {filteredLibro.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
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
