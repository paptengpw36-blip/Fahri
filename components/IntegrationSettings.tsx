
import React, { useState, useEffect } from 'react';
import { Database, Copy, Check, ExternalLink, Info } from 'lucide-react';
import { APPS_SCRIPT_SNIPPET } from '../services/googleSheetsService';

const IntegrationSettings: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem('gsheet_webhook_url');
    if (savedUrl) setWebhookUrl(savedUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem('gsheet_webhook_url', webhookUrl);
    alert('Konfigurasi Google Sheets berhasil disimpan!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Integrasi Layanan</h2>
        <p className="text-slate-500">Hubungkan E-Notulen dengan aplikasi eksternal untuk otomasi data.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-emerald-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Google Sheets Sync</h3>
              <p className="text-emerald-50 text-sm">Kirim data notulen langsung ke spreadsheet Anda.</p>
            </div>
          </div>
          <div className="bg-white/20 px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider">
            Ready
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 block">Webhook URL (Google Apps Script)</label>
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <button 
                onClick={handleSave}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
              >
                Simpan URL
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-4">
            <div className="flex items-start gap-3 text-blue-800">
              <Info className="shrink-0 mt-0.5" size={20} />
              <div className="space-y-2">
                <p className="font-bold text-sm">Cara Menghubungkan:</p>
                <ol className="text-sm list-decimal ml-4 space-y-2 text-blue-700/80">
                  <li>Buka Google Sheets Anda.</li>
                  <li>Buka menu <b>Extensions</b> &gt; <b>Apps Script</b>.</li>
                  <li>Salin kode di bawah ini dan tempel di editor script.</li>
                  <li>Klik <b>Deploy</b> &gt; <b>New Deployment</b> &gt; Pilih <b>Web App</b>.</li>
                  <li>Setel akses ke <b>Anyone</b>.</li>
                  <li>Salin Web App URL ke kotak di atas.</li>
                </ol>
              </div>
            </div>

            <div className="relative group">
              <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto">
                {APPS_SCRIPT_SNIPPET}
              </pre>
              <button 
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;
