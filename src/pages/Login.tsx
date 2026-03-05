import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#1e1b21] font-sans selection:bg-[#8B5CF6]/30 overflow-hidden">

      {/* LEFT PANE - Dark Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[45%] xl:w-[50%] relative flex-col justify-between overflow-hidden">

        {/* Abstract Background Concentric Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[400px] h-[400px] border border-[#8B5CF6]/20 rounded-full pointer-events-none"></div>

        {/* Top Text */}
        <div className="p-12 xl:p-16 z-20 relative flex flex-col items-center text-center mt-12">
          <p className="text-slate-400 text-sm font-medium mb-12 tracking-wide">
            Control de operaciones – gestión financiera simplificada para ti.
          </p>
          <h1 className="text-[3.5rem] xl:text-[4.5rem] font-bold text-white leading-[1.1] tracking-tight">
            Administra<br />tus bancas
          </h1>
        </div>

        {/* 3D Phone Showcase */}
        <div className="relative flex-1 flex items-end justify-center z-10">
          <img
            src="/login-showcase.png"
            alt="LotteryERP Mobile Dashboard"
            className="w-[85%] max-w-[550px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-4 duration-700 ease-out translate-y-12"
          />
        </div>

        {/* Decorative Bottom Icon matching Payoneer Accessibility icon position */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
          <div className="size-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 cursor-pointer hover:text-white/80 hover:border-white/40 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
        </div>

      </div>

      {/* RIGHT PANE - White Form Container */}
      <div className="flex-1 bg-white flex flex-col relative rounded-none lg:rounded-l-[40px] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] z-20 transition-all duration-300">

        {/* Header - Logo & Sign Up Link */}
        <div className="absolute top-8 left-8 xl:left-12 flex items-center gap-2.5 z-20 cursor-pointer">
          {/* Custom SVG Logo - Geometric Interlocking Rings */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="16" r="9" stroke="url(#paint0_linear)" strokeWidth="4" />
            <circle cx="21" cy="16" r="9" stroke="url(#paint1_linear)" strokeWidth="4" />
            <defs>
              <linearGradient id="paint0_linear" x1="2" y1="7" x2="20" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F43F5E" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="paint1_linear" x1="12" y1="7" x2="30" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-xl font-bold text-slate-900 tracking-tight">LotteryERP</span>
        </div>

        <div className="absolute top-8 right-8 xl:right-12 z-20 hidden sm:flex items-center gap-2">
          <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <span className="text-sm font-semibold text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">Soporte técnico</span>
        </div>

        {/* Center Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 mt-16 sm:mt-0 animate-fade-in-up">
          <div className="w-full max-w-[400px]">
            <h2 className="text-[2.2rem] sm:text-[2.75rem] font-medium text-slate-900 mb-10 tracking-tight">Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {error && (
                <div className="p-4 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Email / Username Input */}
                <div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo o Usuario"
                    className="w-full px-5 py-4 text-[15px] bg-white border border-slate-200 rounded-[1.25rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all shadow-sm"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-5 pr-14 py-4 text-[15px] bg-white border border-slate-200 rounded-[1.25rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/20 focus:border-[#8B5CF6] transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="pt-2">
                <a href="#" className="text-[13px] font-semibold text-[#f45d48] hover:text-[#d44835] transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 text-[15px] font-bold text-white rounded-[1.25rem] shadow-[0_8px_20px_-6px_rgba(244,63,94,0.4)] disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_12px_25px_-6px_rgba(244,63,94,0.5)] transition-all flex justify-center items-center gap-2 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(90deg, #f45d48 0%, #f43f5e 50%, #d946ef 100%)',
                    backgroundSize: '200% auto',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" /> Verificando...
                    </>
                  ) : (
                    <>
                      <span>Iniciar Sesión</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-80"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 right-8 xl:left-12 xl:right-12 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-400">
            © 2015-2026 LotteryERP Inc.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Contacto</a>
            <div className="flex items-center gap-1.5 cursor-pointer group">
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Español</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-600"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
