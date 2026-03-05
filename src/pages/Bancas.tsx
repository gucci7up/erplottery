import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { API_URL } from '../config';

interface Banca {
  id: number;
  name: string;
  address: string;
  balance: string | number; // Laravel returns string for decimal sometimes
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Bancas() {
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', status: 'Activa', balance: 0 });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBancas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/bancas`);
      if (res.ok) {
        const data = await res.json();
        setBancas(data);
      }
    } catch (error) {
      console.error('Error fetching bancas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBancas();
  }, []);

  const handleOpenModal = (banca?: Banca) => {
    if (banca) {
      setEditingId(banca.id);
      setFormData({ name: banca.name, address: banca.address, status: banca.status, balance: Number(banca.balance) });
    } else {
      setEditingId(null);
      setFormData({ name: '', address: '', status: 'Activa', balance: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return;

    try {
      if (editingId) {
        // Update
        const res = await fetch(`${API_URL}/bancas/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          fetchBancas(); // Refresh list
        }
      } else {
        // Create
        const res = await fetch(`${API_URL}/bancas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          fetchBancas();
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta banca?')) {
      try {
        const res = await fetch(`${API_URL}/bancas/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setBancas(bancas.filter(b => b.id !== id));
          if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const filteredBancas = bancas.filter((banca) => {
    const codeStr = `B00${banca.id}`;
    const matchesSearch = banca.name.toLowerCase().includes(searchTerm.toLowerCase()) || codeStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && banca.status === 'Activa') ||
      (statusFilter === 'inactive' && banca.status === 'Inactiva');
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBancas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBancas.length / itemsPerPage);

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Gestión de Bancas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Administra las sucursales, ubicaciones y estados operativos.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
        >
          <Plus className="size-4" strokeWidth={3} />
          Nueva Banca
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to page 1 on filter
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
          <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            Filtros
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
                  Código
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Nombre de Banca
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Balance Actual
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
              {currentItems.map((banca) => (
                <tr
                  key={banca.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black bg-purple-50 dark:bg-purple-900/20 text-[#8B5CF6] dark:text-purple-400 border border-purple-100 dark:border-purple-800">
                      B{banca.id.toString().padStart(3, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">
                      {banca.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <MapPin className="size-4 text-slate-400" />
                      {banca.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                      RD${Number(banca.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${banca.status === 'Activa' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span
                        className={`text-xs font-bold ${banca.status === 'Activa'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                          }`}
                      >
                        {banca.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(banca)}
                        className="p-2 text-slate-400 hover:text-[#8B5CF6] hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banca.id)}
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
              {!loading && filteredBancas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No se encontraron bancas que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <span>Mostrando {currentItems.length} de {filteredBancas.length} resultados</span>
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

      {/* Add Modal (Placeholder) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {editingId ? 'Editar Banca' : 'Registrar Nueva Banca'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="size-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 dark:bg-slate-800 dark:hover:bg-rose-900/30 transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  Nombre de la Banca
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  placeholder="Ej. Banca Los Ríos"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  placeholder="Dirección completa"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  Estado Inicial
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                >
                  <option value="Activa">Activa</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] disabled:opacity-50 disabled:pointer-events-none rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              >
                {editingId ? 'Guardar Cambios' : 'Guardar Banca'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
