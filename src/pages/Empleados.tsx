import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Mail, Phone, Briefcase, CheckCircle2, XCircle } from 'lucide-react';

// Mock data
const initialEmpleados = [
  { id: '1', name: 'Carlos Rodríguez', role: 'Administrador', email: 'carlos@lottery.com', phone: '809-555-0101', salary: 45000, status: 'Activo' },
  { id: '2', name: 'Ana Martínez', role: 'Cajera', email: 'ana@lottery.com', phone: '809-555-0102', salary: 18000, status: 'Activo' },
  { id: '3', name: 'Luis Pérez', role: 'Supervisor', email: 'luis@lottery.com', phone: '809-555-0103', salary: 28000, status: 'Inactivo' },
  { id: '4', name: 'María Gómez', role: 'Cajera', email: 'maria@lottery.com', phone: '809-555-0104', salary: 18000, status: 'Activo' },
  { id: '5', name: 'José Santos', role: 'Soporte Técnico', email: 'jose@lottery.com', phone: '809-555-0105', salary: 25000, status: 'Activo' },
];

export default function Empleados() {
  const [empleados, setEmpleados] = useState(initialEmpleados);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEmpleados = empleados.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Directorio de Empleados
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Gestiona el personal, roles y salarios mensuales.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
        >
          <Plus className="size-4" strokeWidth={3} />
          Nuevo Empleado
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por nombre o cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select className="w-full sm:w-auto px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
            <option value="all">Todos los Cargos</option>
            <option value="admin">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="cajero">Cajero</option>
          </select>
          <button className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            Filtros
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
                  Empleado
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-wider">
                  Sueldo Mensual
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
              {filteredEmpleados.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 flex items-center justify-center text-[#8B5CF6] dark:text-purple-300 font-black text-sm border border-white/50 dark:border-slate-700 shadow-sm shadow-purple-100 dark:shadow-none">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#8B5CF6] transition-colors">
                        {emp.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                      <Briefcase className="size-4 text-slate-400" />
                      {emp.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Mail className="size-3.5 text-slate-400" />
                        {emp.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Phone className="size-3.5 text-slate-400" />
                        {emp.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                      RD${emp.salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${emp.status === 'Activo' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span
                        className={`text-xs font-bold ${emp.status === 'Activo'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                          }`}
                      >
                        {emp.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-[#8B5CF6] hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors">
                        <Edit2 className="size-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmpleados.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No se encontraron empleados que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 font-medium bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <span>Mostrando {filteredEmpleados.length} resultados</span>
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

      {/* Add Modal (Placeholder) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                Registrar Nuevo Empleado
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
                  Nombre Completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Cargo
                  </label>
                  <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
                    <option value="cajero">Cajero/a</option>
                    <option value="supervisor">Supervisor/a</option>
                    <option value="admin">Administrador/a</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                    Sueldo Mensual
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-bold text-slate-700 dark:text-slate-300">
                  Estado Inicial
                </label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all">
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
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
              <button className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105">
                Guardar Empleado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
