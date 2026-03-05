import React, { useState, useEffect } from 'react';
import { Save, User, Building, Shield, Bell, Globe, Database, Key, Loader2, Download } from 'lucide-react';
import { API_URL } from '../config';

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    companyName: '',
    companyRnc: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyLogo: '',
    systemLanguage: 'es',
    systemCurrency: 'DOP',
    systemTimezone: 'America/Santo_Domingo',
    notifyEmailDraws: 'true',
    notifySmsDraws: 'false',
    notifySecurity: 'true',
  });

  // Profile State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchSettings();
    if (activeTab === 'perfil') {
      fetchProfile();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings({
          companyName: data.company_name || '',
          companyRnc: data.company_rnc || '',
          companyAddress: data.company_address || '',
          companyPhone: data.company_phone || '',
          companyEmail: data.company_email || '',
          companyLogo: data.company_logo || '',
          systemLanguage: data.system_language || 'es',
          systemCurrency: data.system_currency || 'DOP',
          systemTimezone: data.system_timezone || 'America/Santo_Domingo',
          notifyEmailDraws: data.notify_email_draws || 'true',
          notifySmsDraws: data.notify_sms_draws || 'false',
          notifySecurity: data.notify_security || 'true',
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Simulating fetch since there is no session token auth established yet in the standard requests
      // In a real app this would be a GET to /api/user or decoding the JWT
      // For now we assume a hardcoded admin user details to populate the form
      setProfile({
        name: 'Administrador ERP',
        email: 'admin@erplottery.com'
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const payload = {
        settings: {
          company_name: settings.companyName,
          company_rnc: settings.companyRnc,
          company_address: settings.companyAddress,
          company_phone: settings.companyPhone,
          company_email: settings.companyEmail,
          system_language: settings.systemLanguage,
          system_currency: settings.systemCurrency,
          system_timezone: settings.systemTimezone,
          notify_email_draws: settings.notifyEmailDraws,
          notify_sms_draws: settings.notifySmsDraws,
          notify_security: settings.notifySecurity,
        }
      };
      const res = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Configuración guardada exitosamente');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      };

      const res = await fetch(`${API_URL}/profile/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Contraseña actualizada correctamente');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.message || 'Error al actualizar la contraseña');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/settings/logo`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setSettings({ ...settings, companyLogo: data.logo_url });
        alert('Logo actualizado exitosamente');
      } else {
        alert(data.message || 'Error al subir el logo');
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    // Attempt download through a direct browser link to avoid dealing with blob responses manually
    window.open(`${API_URL}/backup`, '_blank');
  };

  const handleSave = () => {
    if (activeTab === 'general') handleSaveSettings();
    if (activeTab === 'perfil') handleSaveProfile();
    if (activeTab === 'sistema') handleSaveSettings();
    if (activeTab === 'notificaciones') handleSaveSettings();
  };

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
        <button
          onClick={handleSave}
          disabled={saving || !['general', 'perfil', 'sistema', 'notificaciones'].includes(activeTab)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/30 transition-all hover:scale-105 disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" strokeWidth={2.5} />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
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
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[600px] relative">

          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <Loader2 className="size-8 text-[#8B5CF6] animate-spin" />
            </div>
          )}

          {activeTab === 'general' && !loading && (
            <div className="p-8 sm:p-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 drop-shadow-sm">Información de la Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nombre Comercial</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      placeholder="Lottery ERP Solutions"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">RNC / Identificación Fiscal</label>
                    <input
                      type="text"
                      value={settings.companyRnc}
                      onChange={(e) => setSettings({ ...settings, companyRnc: e.target.value })}
                      placeholder="1-30-45678-9"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Dirección Principal</label>
                    <input
                      type="text"
                      value={settings.companyAddress}
                      onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                      placeholder="Av. Winston Churchill #12, Santo Domingo"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      value={settings.companyPhone}
                      onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                      placeholder="(809) 555-0100"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Correo de Soporte</label>
                    <input
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                      placeholder="soporte@lottery-erp.com"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 drop-shadow-sm">Logo de la Empresa</h3>
                <div className="flex items-center gap-8">
                  <div className="size-28 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center group hover:border-[#8B5CF6] transition-colors overflow-hidden">
                    {settings.companyLogo ? (
                      <img src={`${API_URL.replace('/api', '')}${settings.companyLogo}`} alt="Company Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Building className="size-10 text-slate-400 group-hover:text-[#8B5CF6] transition-colors" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="cursor-pointer px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm inline-block">
                      Subir Nuevo Logo
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Recomendado: 256x256px, PNG o JPG, máx 2MB.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perfil' && !loading && (
            <div className="p-8 sm:p-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3 drop-shadow-sm">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                    <User className="size-5 text-[#8B5CF6]" strokeWidth={2.5} />
                  </div>
                  Información Personal
                </h3>
                <div className="max-w-md space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nombre Completo</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="admin@erplottery.com"
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all"
                    />
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
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="size-4 animate-spin" />}
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

          {activeTab === 'sistema' && !loading && (
            <div className="p-8 sm:p-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3 drop-shadow-sm">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                    <Globe className="size-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
                  </div>
                  Preferencias Globales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Idioma del Sistema</label>
                    <select
                      value={settings.systemLanguage}
                      onChange={(e) => setSettings({ ...settings, systemLanguage: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all appearance-none cursor-pointer"
                    >
                      <option value="es">Español (República Dominicana)</option>
                      <option value="en">English (Estados Unidos)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Moneda por Defecto</label>
                    <select
                      value={settings.systemCurrency}
                      onChange={(e) => setSettings({ ...settings, systemCurrency: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all appearance-none cursor-pointer"
                    >
                      <option value="DOP">DOP - Peso Dominicano (RD$)</option>
                      <option value="USD">USD - Dólar Estadounidense ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Zona Horaria</label>
                    <select
                      value={settings.systemTimezone}
                      onChange={(e) => setSettings({ ...settings, systemTimezone: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all appearance-none cursor-pointer"
                    >
                      <option value="America/Santo_Domingo">America/Santo_Domingo (AST)</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Formato de Fecha</label>
                    <select
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#8B5CF6]/50 focus:border-[#8B5CF6] transition-all appearance-none cursor-pointer"
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notificaciones' && !loading && (
            <div className="p-8 sm:p-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3 drop-shadow-sm">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl">
                    <Bell className="size-5 text-yellow-600 dark:text-yellow-400" strokeWidth={2.5} />
                  </div>
                  Alertas y Avisos
                </h3>
                <div className="max-w-2xl space-y-6">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                    <div className="pr-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-[15px]">Cierre de Sorteos por Correo</p>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Recibir resumen automático de ganancias cuando finalice un sorteo.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifyEmailDraws === 'true'}
                        onChange={(e) => setSettings({ ...settings, notifyEmailDraws: e.target.checked ? 'true' : 'false' })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#8B5CF6]"></div>
                    </label>
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                    <div className="pr-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-[15px]">Alertas por SMS (Bancas)</p>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Avisos urgentes por SMS al administrador cuando una banca se desconecta.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifySmsDraws === 'true'}
                        onChange={(e) => setSettings({ ...settings, notifySmsDraws: e.target.checked ? 'true' : 'false' })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#8B5CF6]"></div>
                    </label>
                  </div>

                  {/* Security Notifications */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl">
                    <div className="pr-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-[15px]">Seguridad de Cuenta</p>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Notificarme por correo si ocurre un inicio de sesión desde un nuevo dispositivo.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifySecurity === 'true'}
                        onChange={(e) => setSettings({ ...settings, notifySecurity: e.target.checked ? 'true' : 'false' })}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#8B5CF6]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'respaldo' && !loading && (
            <div className="p-8 sm:p-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3 drop-shadow-sm">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
                    <Database className="size-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                  </div>
                  Copias de Seguridad (Backup)
                </h3>
                <div className="max-w-2xl bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 text-center space-y-6">
                  <div className="size-20 bg-emerald-50 dark:bg-emerald-900/30 mx-auto rounded-3xl flex items-center justify-center mb-6 ring-4 ring-emerald-50/50 dark:ring-emerald-900/10">
                    <Download className="size-10 text-emerald-600 dark:text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Descargar Base de Datos</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                      Genera y guarda una copia exacta de toda la información (ventas, tickets, configuraciones) en tu dispositivo actual para mayor seguridad.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleDownloadBackup}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[15px] font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Download className="size-5" />
                      Generar y Descargar Respaldo
                    </button>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-4">Formato: Archivo SQLite (.sqlite)</p>
                  </div>
                </div>
              </div>
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
