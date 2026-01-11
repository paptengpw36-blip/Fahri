
import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulasi pengecekan kode akses internal
    // Kode default: BPKP123
    setTimeout(() => {
      if (accessCode === 'BPKP123') {
        onLogin(true);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/40 mb-4">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">E-Notulen BPKP</h1>
            <p className="text-slate-400 text-sm mt-1">Sistem Informasi Notulensi Internal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Kode Akses Digital</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password"
                  placeholder="Masukkan Kode Keamanan..."
                  className={`w-full bg-slate-900/50 border ${error ? 'border-red-500/50' : 'border-white/10'} text-white rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600`}
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (error) setError(false);
                  }}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs mt-2 ml-1 animate-in slide-in-from-top-1">
                  <AlertCircle size={14} />
                  <span>Kode akses salah. Silakan hubungi Sekretariat.</span>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Buka Akses <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">
              Provinsi Papua Tengah • 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
