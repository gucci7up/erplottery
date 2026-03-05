import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, MoreVertical, Trash2, Edit2, XCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_URL } from '../config';

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
  const [operaciones, setOperaciones] = useState<any[]>([]);
  const [bancas, setBancas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    operation_date: format(new Date(), 'yyyy-MM-dd'),
    type: '', // To handle dropdown visually
    ventas_brutas: '0',
    premios_pagados: '0',
    gastos_banca: '0',
    balance_neto: '0',
    description: '',
    banca_id: '',
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [opsRes, bancasRes] = await Promise.all([
        fetch(`${API_URL}/operaciones`).then(r => r.json()),
        fetch(`${API_URL}/bancas`).then(r => r.json()),
      ]);
      setOperaciones(opsRes);
      setBancas(bancasRes);
    } catch (error) {
      console.error('Error fetching Data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (op?: any) => {
    if (op) {
      setEditingId(op.id);
      // Try to guess a "type" based on amounts for the dropdown, though our new model captures direct amounts
      let guessedType = 'ventas';
      if (Number(op.premios_pagados) > 0) guessedType = 'premios';
      if (Number(op.gastos_banca) > 0) guessedType = 'gastos';

      // Pick out highest amount for simplicity mapping back to single amount display
      const displayAmount = Math.max(op.ventas_brutas, op.premios_pagados, op.gastos_banca).toString();

      setFormData({
        operation_date: format(new Date(op.operation_date), 'yyyy-MM-dd'),
        type: guessedType,
        ventas_brutas: op.ventas_brutas.toString(),
        premios_pagados: op.premios_pagados.toString(),
        gastos_banca: op.gastos_banca.toString(),
        balance_neto: op.balance_neto.toString(),
        description: '', // DB Model didn't include description for Operaciones, keeping local state dummy for UI 
        banca_id: op.banca_id ? op.banca_id.toString() : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        operation_date: format(new Date(), 'yyyy-MM-dd'),
        type: '',
        ventas_brutas: '0',
        premios_pagados: '0',
        gastos_banca: '0',
        balance_neto: '0',
        description: '',
        banca_id: '',
      });
    }
    setIsModalOpen(false);
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const handleSave = async () => {
    if (!formData.banca_id) return;

    // Map UI "amount" + "type" to actual database layout mapping (ventas/premios/gastos/balance)
    let v_brutas = 0;
    let p_pagados = 0;
    let g_banca = 0;
    const amountVal = Number(formData.ventas_brutas) || 0; // Using ventas_brutas generic bound as amount payload initially for demo

    // We are hacking the single amount UI into the multiple column backend:
    if (formData.type === 'ventas' || formData.type === 'ganancias') v_brutas = amountVal;
    if (formData.type === 'premios') p_pagados = amountVal;
    if (formData.type === 'gastos') g_banca = amountVal;

    // For this rewrite, we will calculate dynamically if needed but we should rely on amount text
    if (formData.type !== 'ventas' && formData.type !== 'premios' && formData.type !== 'gastos') {
      v_brutas = amountVal; // Default capture
    }

    try {
      const payload = {
        banca_id: Number(formData.banca_id),
        operation_date: formData.operation_date,
        ventas_brutas: v_brutas,
        premios_pagados: p_pagados,
        gastos_banca: g_banca,
        balance_neto: v_brutas - p_pagados - g_banca, // generic mock calculation
      };

      if (editingId) {
        const res = await fetch(`${API_URL}/operaciones/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchData();
      } else {
        const res = await fetch(`${API_URL}/operaciones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchData();
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta operación?')) {
      try {
        const res = await fetch(`${API_URL}/operaciones/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
          if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const filteredOperaciones = operaciones.filter((op) => {
    const bancaName = (op.banca ? op.banca.name : '').toLowerCase();
    const typeLabel = op.ventas_brutas > 0 ? 'ventas' : (op.premios_pagados > 0 ? 'premios' : 'gastos');

    const matchesSearch = bancaName.includes(searchTerm.toLowerCase());
    const opDateStr = op.operation_date ? format(new Date(`${op.operation_date}T00:00:00`), 'yyyy-MM-dd') : '';
    const matchesDate = opDateStr === selectedDate;
    const matchesType = typeFilter === 'all' || typeLabel === typeFilter;

    return matchesSearch && matchesDate && matchesType;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOperaciones.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOperaciones.length / itemsPerPage);

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
            onClick={() => handleOpenModal()}
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
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
          >
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] z-10">
            <Loader2 className="size-8 text-[#8B5CF6] animate-spin" />
          </div>
        ) : null}
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
              {currentItems.map((op) => {
                let inferredType = 'ventas';
                let inferredAmount = op.ventas_brutas;
                let uiDescription = 'Registro General de Ventas';
                if (Number(op.premios_pagados) > Number(op.ventas_brutas)) { inferredType = 'premios'; inferredAmount = op.premios_pagados; uiDescription = 'Pago de premios'; }
                if (Number(op.gastos_banca) > Number(op.premios_pagados)) { inferredType = 'gastos'; inferredAmount = op.gastos_banca; uiDescription = 'Registro de Gastos'; }

                return (
                  <tr
                    key={op.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">
                        {op.operation_date ? format(new Date(`${op.operation_date}T00:00:00`), 'dd MMM yyyy', { locale: es }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border ${getTipoColor(inferredType)}`}>
                        {getTipoLabel(inferredType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate" title={uiDescription}>
                        {uiDescription}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {op.banca ? op.banca.name : 'No Asignada'}
                      </div>
                      <div className="text-xs font-medium text-slate-500">
                        Balance Neto: RD${Number(op.balance_neto).toLocaleString('en-US')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`text-sm font-black flex items-center justify-end gap-1 ${['ventas', 'ganancias', 'recargas', 'cuentas_cobrar'].includes(inferredType)
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {['ventas', 'ganancias', 'recargas', 'cuentas_cobrar'].includes(inferredType) ? (
                          <ArrowUpRight className="size-4" strokeWidth={3} />
                        ) : (
                          <ArrowDownRight className="size-4" strokeWidth={3} />
                        )}
                        RD${Number(inferredAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(op)}
                          className="p-2 text-slate-400 hover:text-[#8B5CF6] hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(op.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                          <MoreVertical className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filteredOperaciones.length === 0 && (
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
          <span>Mostrando {currentItems.length} de {filteredOperaciones.length} resultados</span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-xl border ${currentPage === i + 1 ? 'border-transparent bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white font-bold shadow-md' : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm bg-white dark:bg-slate-800'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm bg-white dark:bg-slate-800"
            >
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
                {editingId ? 'Editar Operación' : 'Registrar Operación Diaria'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-900/30 transition-colors"
              >
                <XCircle className="size-5" />
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
                    value={formData.operation_date}
                    onChange={(e) => setFormData({ ...formData, operation_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Tipo de Movimiento
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  >
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
                      value={formData.ventas_brutas}
                      onChange={(e) => setFormData({ ...formData, ventas_brutas: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Banca Asociada
                  </label>
                  <select
                    value={formData.banca_id}
                    onChange={(e) => setFormData({ ...formData, banca_id: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  >
                    <option value="">Seleccionar banca...</option>
                    {bancas.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  Descripción / Notas
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <button
                onClick={handleSave}
                disabled={!formData.type || !formData.ventas_brutas || !formData.banca_id}
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] disabled:opacity-50 disabled:pointer-events-none rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              >
                {editingId ? 'Guardar Cambios' : 'Guardar Operación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
