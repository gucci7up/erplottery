import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Calendar, Filter, Download, ArrowDownRight, FileText, MoreVertical, Trash2, Edit2, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_URL } from '../config';

const categoriasGasto = [
  { value: 'alquiler', label: 'Alquiler de Locales' },
  { value: 'servicios', label: 'Servicios (Luz, Agua, Internet)' },
  { value: 'mantenimiento', label: 'Mantenimiento y Reparaciones' },
  { value: 'suministros', label: 'Suministros de Oficina' },
  { value: 'impuestos', label: 'Impuestos y Licencias' },
  { value: 'otros', label: 'Otros Gastos Operativos' },
];

export default function GastosMensuales() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [bancas, setBancas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
    description: '',
    amount: '',
    banca_id: '',
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resGastos, resBancas] = await Promise.all([
        fetch(`${API_URL}/gastos`).then(res => res.json()),
        fetch(`${API_URL}/bancas`).then(res => res.json())
      ]);
      setGastos(resGastos);
      setBancas(resBancas);
    } catch (error) {
      console.error('Error fetching Data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (gasto?: any) => {
    if (gasto) {
      setEditingId(gasto.id);
      setFormData({
        expense_date: format(new Date(gasto.expense_date), 'yyyy-MM-dd'),
        category: gasto.category,
        description: gasto.description,
        amount: gasto.amount.toString(),
        banca_id: gasto.banca_id ? gasto.banca_id.toString() : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        expense_date: format(new Date(), 'yyyy-MM-dd'),
        category: '',
        description: '',
        amount: '',
        banca_id: '',
      });
    }
    setIsModalOpen(false); // Quick toggle reset
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const handleSave = async () => {
    if (!formData.category || !formData.amount || !formData.description) return;

    try {
      const payload = {
        expense_date: formData.expense_date,
        category: formData.category, // Backend takes the raw string, we can send label directly. We map it nicely in ui or send plain string
        description: formData.description,
        amount: Number(formData.amount),
        banca_id: formData.banca_id ? Number(formData.banca_id) : null,
      };

      if (editingId) {
        const res = await fetch(`${API_URL}/gastos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchData();
      } else {
        const res = await fetch(`${API_URL}/gastos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) fetchData();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving Gasto:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      try {
        const res = await fetch(`${API_URL}/gastos/${id}`, { method: 'DELETE' });
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

  const filteredGastos = useMemo(() => {
    return gastos.filter((g) => {
      const matchesSearch = g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.category.toLowerCase().includes(searchTerm.toLowerCase());
      const gMonth = format(new Date(`${g.expense_date}T00:00:00`), 'yyyy-MM');
      const matchesDate = gMonth === selectedMonth;

      let matchesCat = true;
      if (categoryFilter !== 'all') {
        matchesCat = g.category === categoryFilter;
      }

      return matchesSearch && matchesDate && matchesCat;
    });
  }, [gastos, searchTerm, selectedMonth, categoryFilter]);

  // Derived Summary States based on selectedMonth filter
  const totalGastosMes = filteredGastos.reduce((sum, g) => sum + Number(g.amount), 0);
  const cuentasPorPagar = 0; // Gastos don't have status yet in the DB model, keeping zero for stats UI

  let topCategoryName = 'N/A';
  let topCategoryPercentage = 0;

  if (totalGastosMes > 0) {
    const categoryTotals = filteredGastos.reduce((acc: any, g) => {
      acc[g.category] = (acc[g.category] || 0) + Number(g.amount);
      return acc;
    }, {});
    const topCat = Object.entries(categoryTotals).sort(([, a]: any, [, b]: any) => b - a)[0];
    if (topCat) {
      topCategoryName = topCat[0];
      topCategoryPercentage = Math.round((Number(topCat[1]) / totalGastosMes) * 100);
    }
  }

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGastos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGastos.length / itemsPerPage);

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
            onClick={() => handleOpenModal()}
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
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD${totalGastosMes.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <FileText className="text-amber-600 dark:text-amber-400 size-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Cuentas por Pagar</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD${cuentasPorPagar.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-2 truncate max-w-[120px]">Mayor Gasto: {topCategoryName}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">{topCategoryPercentage}%</h3>
              <span className="text-sm font-medium text-slate-500">del total</span>
            </div>
          </div>
          <div className="relative size-16 drop-shadow-sm flex-shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="4"></circle>
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#8B5CF6]" strokeWidth="4" strokeDasharray="100" strokeDashoffset={100 - topCategoryPercentage} strokeLinecap="round"></circle>
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-[#8B5CF6]">
              {topCategoryPercentage}%
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
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
          >
            <option value="all">Todas las Categorías</option>
            {categoriasGasto.map(cat => (
              <option key={cat.value} value={cat.label}>{cat.label}</option>
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
                  Categoría
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Monto
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Banca
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {currentItems.map((gasto) => (
                <tr
                  key={gasto.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">
                      {format(new Date(`${gasto.expense_date}T00:00:00`), 'dd MMM yyyy', { locale: es })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {gasto.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-sm truncate" title={gasto.description}>
                      {gasto.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                      RD${Number(gasto.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-500">
                      {gasto.banca ? gasto.banca.name : 'General'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(gasto)}
                        className="p-2 text-slate-400 hover:text-[#8B5CF6] hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(gasto.id)}
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
              ))}
              {!loading && filteredGastos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No se encontraron gastos para los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <span>Mostrando {currentItems.length} de {filteredGastos.length} resultados</span>
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {editingId ? 'Editar Gasto' : 'Registrar Nuevo Gasto Fijo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-900/30 transition-colors"
              >
                <XCircle className="size-5" />
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
                      value={formData.expense_date}
                      onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    >
                      <option value="">Seleccionar...</option>
                      {categoriasGasto.map(cat => (
                        <option key={cat.value} value={cat.label}>{cat.label}</option>
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
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Banca / Sucursal Asociada (Opcional)
                    </label>
                    <select
                      value={formData.banca_id}
                      onChange={(e) => setFormData({ ...formData, banca_id: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    >
                      <option value="">Aplica a todas (Gasto General)</option>
                      {bancas.map(banca => (
                        <option key={banca.id} value={banca.id}>{banca.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div> {/* This div was misplaced, it should close the 'p-8 space-y-6 overflow-y-auto flex-1' div */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.category || !formData.amount || !formData.description}
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] disabled:opacity-50 disabled:pointer-events-none rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              >
                {editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
