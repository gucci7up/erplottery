import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Calendar, Filter, Download, DollarSign, Users, FileText, CheckCircle2, MoreVertical, Trash2, Edit2, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { API_URL } from '../config';

export default function Nomina() {
  const [nomina, setNomina] = useState<any[]>([]);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    baseSalary: 0,
    deductions: 0,
    bonuses: 0,
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Pendiente',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, nomRes] = await Promise.all([
        fetch(`${API_URL}/empleados`),
        fetch(`${API_URL}/pagos-nomina`),
      ]);
      if (empRes.ok) setEmpleados(await empRes.json());
      if (nomRes.ok) {
        const pagos = await nomRes.json();
        const mapped = pagos.map((p: any) => ({
          id: p.id.toString(),
          employeeId: p.employee_id,
          employee: p.employee?.name || 'Desconocido',
          role: p.employee?.role || 'N/A',
          baseSalary: Number(p.base_salary),
          deductions: Number(p.deductions),
          bonuses: Number(p.bonuses),
          netPay: Number(p.net_pay),
          status: p.status,
          date: p.payment_date,
        }));
        setNomina(mapped);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      const emp = empleados.find(e => e.name === record.employee);
      setFormData({
        employeeId: emp ? emp.id.toString() : '',
        baseSalary: record.baseSalary,
        deductions: record.deductions,
        bonuses: record.bonuses,
        date: record.date,
        status: record.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        employeeId: '',
        baseSalary: 0,
        deductions: 0,
        bonuses: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'Pendiente',
      });
    }
    setIsModalOpen(true);
  };

  const handleEmployeeChange = (empId: string) => {
    const emp = empleados.find(e => e.id.toString() === empId);
    setFormData(prev => ({
      ...prev,
      employeeId: empId,
      baseSalary: emp ? Number(emp.base_salary) : 0,
    }));
  };

  const handleSave = async () => {
    if (!formData.employeeId) return;

    const emp = empleados.find(e => e.id.toString() === formData.employeeId);
    if (!emp) return;

    const netPay = formData.baseSalary - formData.deductions + formData.bonuses;
    const payload = {
      employee_id: formData.employeeId,
      payment_date: formData.date,
      base_salary: formData.baseSalary,
      deductions: formData.deductions,
      bonuses: formData.bonuses,
      net_pay: netPay,
      status: formData.status,
    };

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/pagos-nomina/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) fetchData();
      } else {
        const res = await fetch(`${API_URL}/pagos-nomina`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) fetchData();
      }
    } catch (err) {
      console.error("Error saving payment", err);
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro de nómina?')) {
      try {
        const res = await fetch(`${API_URL}/pagos-nomina/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchData();
          if (currentItems.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  const filteredNomina = useMemo(() => {
    return nomina.filter((n) => {
      const matchesSearch = n.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.role.toLowerCase().includes(searchTerm.toLowerCase());
      const nMonth = n.date.substring(0, 7);
      const matchesDate = nMonth === selectedMonth;
      const matchesStatus = statusFilter === 'all' || n.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [nomina, searchTerm, selectedMonth, statusFilter]);

  // Derived Summary States based on selectedMonth (unfiltered by search/status, just that month)
  const monthNomina = nomina.filter(n => n.date.substring(0, 7) === selectedMonth);
  const totalNominaQuincena = monthNomina.reduce((sum, n) => sum + n.netPay, 0);
  const pagosPendientes = monthNomina.filter(n => n.status === 'Pendiente').reduce((sum, n) => sum + n.netPay, 0);
  const uniqueEmpsInMonth = new Set(monthNomina.map(n => n.employee));
  const paidEmpsInMonth = new Set(monthNomina.filter(n => n.status === 'Pagado').map(n => n.employee));

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNomina.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNomina.length / itemsPerPage);

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Nómina y Pagos Quincenales
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Gestión de pagos quincenales a empleados, deducciones y bonificaciones.
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
            Procesar Pago
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <DollarSign className="text-blue-600 dark:text-blue-400 size-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Total Nómina (Mes)</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD${totalNominaQuincena.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <Users className="text-emerald-600 dark:text-emerald-400 size-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Empleados Pagados</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">{paidEmpsInMonth.size}</h3>
              <span className="text-slate-500 font-medium">/ {uniqueEmpsInMonth.size}</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-2xl border border-white/50 dark:border-slate-700 shadow-sm">
            <FileText className="text-amber-600 dark:text-amber-400 size-7" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Pagos Pendientes</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">RD${pagosPendientes.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar empleado o cargo..."
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
          >
            <option value="all">Todos los Estados</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <Loader2 className="size-8 text-purple-500 animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Empleado / Cargo
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Sueldo Quincenal
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Deducciones
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Bonos/Extras
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">
                  Pago Neto
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {currentItems.map((n) => (
                <tr
                  key={n.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">
                      {n.employee}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {n.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      RD${n.baseSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                      -RD${n.deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +RD${n.bonuses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                      RD${n.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-black border ${n.status === 'Pagado'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                          }`}
                      >
                        {n.status === 'Pagado' && <CheckCircle2 className="size-3.5 mr-1" strokeWidth={3} />}
                        {n.status}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                        <button
                          onClick={() => handleOpenModal(n)}
                          className="p-1.5 text-slate-400 hover:text-[#8B5CF6] hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNomina.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No se encontraron registros de nómina.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <span>Mostrando {currentItems.length} de {filteredNomina.length} resultados</span>
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

      {/* Process Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {editingId ? 'Editar Pago de Nómina' : 'Procesar Pago de Nómina'}
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
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Empleado
                  </label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  >
                    <option value="">Seleccionar empleado...</option>
                    {empleados.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Sueldo Quincenal
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-400 font-bold sm:text-sm">RD$</span>
                      </div>
                      <input
                        type="number"
                        disabled
                        value={formData.baseSalary}
                        className="w-full pl-8 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Fecha de Pago
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Deducciones (Adelantos)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-bold sm:text-sm">RD$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={formData.deductions}
                        onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                      Bonificaciones / Extras
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-bold sm:text-sm">RD$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={formData.bonuses}
                        onChange={(e) => setFormData({ ...formData, bonuses: Number(e.target.value) })}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Estado Actual
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Pagado">Pagado</option>
                  </select>
                </div>

                <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/50 flex justify-between items-center mt-6">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Pago Neto Estimado:</span>
                  <span className="text-2xl font-black text-[#8B5CF6] dark:text-purple-400">
                    RD${(Number(formData.baseSalary) - Number(formData.deductions || 0) + Number(formData.bonuses || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
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
              <button
                onClick={handleSave}
                disabled={!formData.employeeId}
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] disabled:opacity-50 disabled:pointer-events-none rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
              >
                {editingId ? 'Guardar Cambios' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
