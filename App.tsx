
import React, { useState, useEffect } from 'react';
import { ViewState, Meeting } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MeetingEditor from './components/MeetingEditor';
import IntegrationSettings from './components/IntegrationSettings';
import Login from './components/Login';
import { Search, Bell, Plus, Edit3, ChevronRight, Archive } from 'lucide-react';

const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: 'Rapat Sinkronisasi Program Kerja 2024',
    date: '2024-03-20',
    location: 'Ruang Rapat Candi Bentar',
    attendees: [
      { id: '1', name: 'Dr. Ahmad Subagjo', position: 'Kepala Dinas' },
      { id: '2', name: 'Siti Rohani, M.Si', position: 'Kabid Administrasi' }
    ],
    points: [
      { id: 'p1', category: 'Pembahasan', content: 'Rapat membahas sinkronisasi anggaran antara bidang A dan B.' },
      { id: 'p2', category: 'Kendala', content: 'Ditemukan adanya overlap pada pos belanja pegawai.' }
    ],
    followUp: 'Revisi RKA-SKPD segera dilakukan.',
    summary: 'Diskusi utama fokus pada efisiensi anggaran belanja pegawai.',
    actionItems: [
      { id: '101', task: 'Revisi RKA-SKPD Bidang B', assignee: 'Siti Rohani', deadline: '2024-03-25', status: 'Pending' }
    ],
    status: 'Final',
    category: 'Manajemen'
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('is_auth') === 'true';
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('bpkp_meetings');
    return saved ? JSON.parse(saved) : MOCK_MEETINGS;
  });

  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('bpkp_meetings', JSON.stringify(meetings));
  }, [meetings]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      sessionStorage.setItem('is_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('is_auth');
    setCurrentView('dashboard');
  };

  const handleSaveMeeting = (newMeeting: Meeting) => {
    if (selectedMeetingId) {
      setMeetings(meetings.map(m => m.id === selectedMeetingId ? newMeeting : m));
    } else {
      const meetingWithId = { ...newMeeting, id: Date.now().toString() };
      setMeetings([meetingWithId, ...meetings]);
    }
    setCurrentView('dashboard');
    setSelectedMeetingId(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    const isArchiveView = currentView === 'archive';
    const filteredMeetings = isArchiveView 
      ? meetings.filter(m => m.status === 'Archived') 
      : meetings;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard meetings={meetings} onViewMeeting={(id) => {
          setSelectedMeetingId(id);
          setCurrentView('create');
        }} />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'list':
      case 'archive':
        return (
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {isArchiveView ? 'Arsip Notulen Lama' : 'Semua Daftar Notulen'}
                </h2>
                <p className="text-sm text-slate-500">
                  {isArchiveView ? 'Menampilkan data yang telah dipindahkan ke arsip.' : 'Klik pada notulen untuk melakukan pengeditan.'}
                </p>
              </div>
              {!isArchiveView && (
                <button 
                  onClick={() => {
                    setSelectedMeetingId(null);
                    setCurrentView('create');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  <Plus size={18} /> Buat Baru
                </button>
              )}
            </header>
            <div className="grid gap-4">
              {filteredMeetings.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
                   <p className="text-slate-400 font-medium">Tidak ada data untuk ditampilkan.</p>
                </div>
              ) : (
                filteredMeetings.map(m => (
                  <div 
                    key={m.id} 
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => { setSelectedMeetingId(m.id); setCurrentView('create'); }}
                  >
                    <div className="flex gap-6 items-center">
                      <div className="bg-slate-50 p-4 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        {m.status === 'Archived' ? <Archive size={24} /> : <Edit3 size={24} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{m.title}</h4>
                        <p className="text-sm text-slate-500">{new Date(m.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} • {m.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                        m.status === 'Final' ? 'bg-emerald-100 text-emerald-700' : 
                        m.status === 'Archived' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {m.status}
                      </span>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'create':
        return (
          <MeetingEditor 
            onSave={handleSaveMeeting} 
            onCancel={() => {
              setSelectedMeetingId(null);
              setCurrentView('dashboard');
            }} 
            initialMeeting={meetings.find(m => m.id === selectedMeetingId)}
          />
        );
      default:
        return <div className="p-12 text-center text-slate-400">Halaman sedang dikembangkan</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex animate-in fade-in duration-500">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          if(view !== 'create') setSelectedMeetingId(null);
          setCurrentView(view);
        }} 
        onLogout={handleLogout}
      />
      
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-20 px-8 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between sticky top-0 z-40">
          <div className="flex-1 max-w-md relative text-slate-400 italic text-sm">
             E-Notulen BPKP Perwakilan Provinsi Papua Tengah
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800">Administrator</p>
                <p className="text-xs text-slate-500">Sesi Aktif</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
