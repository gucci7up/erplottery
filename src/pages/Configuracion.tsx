import { useState } from 'react';
import { Save, User, Building, Shield, Bell, Globe, Database, Key } from 'lucide-react';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Configuración del Sistema
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
            Ajustes generales, seguridad y preferencias de la plataforma.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105">
          <Save className="size-5" strokeWidth={2.5} />
          Guardar Cambios
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'general'
                    ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#8B5CF6]/5 text-[#8B5CF6] dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 shadow-sm border border-[#8B5CF6]/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'general' ? 'bg-[#8B5CF6]/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Building className="size-5" strokeWidth={activeTab === 'general' ? 2.5 : 2} />
                </div>
                Empresa
              </button>
              <button
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'perfil'
                    ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#8B5CF6]/5 text-[#8B5CF6] dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 shadow-sm border border-[#8B5CF6]/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'perfil' ? 'bg-[#8B5CF6]/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <User className="size-5" strokeWidth={activeTab === 'perfil' ? 2.5 : 2} />
                </div>
                Mi Perfil
              </button>
              <button
                onClick={() => setActiveTab('seguridad')}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'seguridad'
                    ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#8B5CF6]/5 text-[#8B5CF6] dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 shadow-sm border border-[#8B5CF6]/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'seguridad' ? 'bg-[#8B5CF6]/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Shield className="size-5" strokeWidth={activeTab === 'seguridad' ? 2.5 : 2} />
                </div>
                Seguridad y Accesos
              </button>
              <button
                onClick={() => setActiveTab('notificaciones')}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'notificaciones'
                    ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#8B5CF6]/5 text-[#8B5CF6] dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 shadow-sm border border-[#8B5CF6]/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'notificaciones' ? 'bg-[#8B5CF6]/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Bell className="size-5" strokeWidth={activeTab === 'notificaciones' ? 2.5 : 2} />
                </div>
                Notificaciones
              </button>
              <button
                onClick={() => setActiveTab('sistema')}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'sistema'
                    ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#8B5CF6]/5 text-[#8B5CF6] dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 shadow-sm border border-[#8B5CF6]/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'sistema' ? 'bg-[#8B5CF6]/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Globe className="size-5" strokeWidth={activeTab === 'sistema' ? 2.5 : 2} />
                </div>
                Preferencias
              </button>
              <button
                onClick={() => setActiveTab('respaldo')}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${activeTab === 'respaldo'
                    ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-[#8B5CF6]/5 text-[#8B5CF6] dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 shadow-sm border border-[#8B5CF6]/20'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeTab === 'respaldo' ? 'bg-[#8B5CF6]/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  <Database className="size-5" strokeWidth={activeTab === 'respaldo' ? 2.5 : 2} />
                </div>
                Respaldo de Datos
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[600px]">
          {activeTab === 'general' && (
            <div className="p-8 sm:p-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 drop-shadow-sm">Información de la Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nombre Comercial</label>
                    <input
                      type="text"
                      defaultValue="Lottery ERP Solutions"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">RNC / Identificación Fiscal</label>
                    <input
                      type="text"
                      defaultValue="1-30-45678-9"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Dirección Principal</label>
                    <input
                      type="text"
                      defaultValue="Av. Winston Churchill #12, Santo Domingo"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      defaultValue="(809) 555-0100"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Correo de Soporte</label>
                    <input
                      type="email"
                      defaultValue="soporte@lottery-erp.com"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 drop-shadow-sm">Logo de la Empresa</h3>
                <div className="flex items-center gap-8">
                  <div className="size-28 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center group hover:border-[#8B5CF6] transition-colors cursor-pointer">
                    <Building className="size-10 text-slate-400 group-hover:text-[#8B5CF6] transition-colors" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3">
                    <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                      Subir Nuevo Logo
                    </button>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Recomendado: 256x256px, PNG o JPG, máx 2MB.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="p-8 sm:p-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3 drop-shadow-sm">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                    <Key className="size-5 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                  </div>
                  Cambiar Contraseña
                </h3>
                <div className="max-w-md space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Contraseña Actual</label>
                    <input
                      type="password"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Actualizar Contraseña
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 drop-shadow-sm">Autenticación de Dos Factores (2FA)</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700/50 gap-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-[15px]">Protege tu cuenta con 2FA</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Añade una capa extra de seguridad requiriendo un código de tu dispositivo móvil.</p>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-sm transition-colors whitespace-nowrap">
                    Habilitar 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['perfil', 'notificaciones', 'sistema', 'respaldo'].includes(activeTab) && (
            <div className="p-10 flex flex-col items-center justify-center text-center h-[500px] animate-fade-in">
              <div className="size-20 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <SettingsIcon className="size-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Sección en Desarrollo</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-3 max-w-sm leading-relaxed">
                Las opciones de configuración para esta sección estarán disponibles en la próxima actualización.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper icon for placeholders
function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
