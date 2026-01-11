
import React, { useState } from 'react';
import { Save, UserPlus, MapPin, Calendar, ArrowLeft, Users, Trash2, Plus, UserMinus, FileDown, CloudUpload, Info, Shield, FileText } from 'lucide-react';
import { Meeting, Attendee, ActionItem, NotePoint, NoteCategory } from '../types';
import { generateMeetingPDF } from '../services/pdfService';
import { syncMeetingToSheets } from '../services/googleSheetsService';

interface MeetingEditorProps {
  onSave: (meeting: Meeting) => void;
  onCancel: () => void;
  initialMeeting?: Meeting;
}

const MeetingEditor: React.FC<MeetingEditorProps> = ({ onSave, onCancel, initialMeeting }) => {
  const [syncing, setSyncing] = useState(false);
  
  const [meeting, setMeeting] = useState<Meeting>(initialMeeting || {
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    attendees: [],
    points: [{ id: '1', category: 'Pembahasan', content: '' }],
    followUp: '',
    summary: '',
    actionItems: [],
    status: 'Draft',
    category: 'Rapat Koordinasi',
    scribeName: '',
    approverName: ''
  });

  const [newAttendee, setNewAttendee] = useState({ name: '', position: '' });

  const handleAddAttendee = () => {
    if (newAttendee.name) {
      setMeeting({
        ...meeting,
        attendees: [...(meeting.attendees || []), { id: Date.now().toString(), ...newAttendee }]
      });
      setNewAttendee({ name: '', position: '' });
    }
  };

  const handleRemoveAttendee = (id: string) => {
    setMeeting({
      ...meeting,
      attendees: (meeting.attendees || []).filter(a => a.id !== id)
    });
  };

  const handleAddPoint = () => {
    const newPoint: NotePoint = {
      id: Date.now().toString(),
      category: 'Pembahasan',
      content: ''
    };
    setMeeting({
      ...meeting,
      points: [...(meeting.points || []), newPoint]
    });
  };

  const handleRemovePoint = (id: string) => {
    setMeeting({
      ...meeting,
      points: (meeting.points || []).filter(p => p.id !== id)
    });
  };

  const handleUpdatePoint = (id: string, updates: Partial<NotePoint>) => {
    setMeeting({
      ...meeting,
      points: (meeting.points || []).map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const handleAddActionItem = () => {
    const newItem: ActionItem = {
      id: Date.now().toString(),
      task: '',
      assignee: '',
      deadline: '',
      status: 'Pending'
    };
    setMeeting({
      ...meeting,
      actionItems: [...(meeting.actionItems || []), newItem]
    });
  };

  const handleRemoveActionItem = (id: string) => {
    setMeeting({
      ...meeting,
      actionItems: (meeting.actionItems || []).filter(item => item.id !== id)
    });
  };

  const handleUpdateActionItem = (id: string, updates: Partial<ActionItem>) => {
    setMeeting({
      ...meeting,
      actionItems: (meeting.actionItems || []).map(item => item.id === id ? { ...item, ...updates } : item)
    });
  };

  const handleExportPDF = () => {
    generateMeetingPDF(meeting);
  };

  const handleSyncToSheets = async () => {
    const webhookUrl = localStorage.getItem('gsheet_webhook_url');
    if (!webhookUrl) {
      alert('Konfigurasi Webhook URL di menu Integrasi terlebih dahulu.');
      return;
    }

    setSyncing(true);
    try {
      await syncMeetingToSheets(meeting, webhookUrl);
      alert('Data berhasil dikirim ke Google Sheets!');
    } catch (error) {
      console.error(error);
      alert('Gagal mengirim data ke Google Sheets.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#f8fafc]/80 backdrop-blur py-4 z-10 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {initialMeeting ? 'Edit Notulen' : 'Buat Notulen Baru'}
            </h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">BPKP Perwakilan Provinsi Papua Tengah</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            disabled={syncing}
            onClick={handleSyncToSheets}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl font-semibold border border-emerald-200 hover:bg-emerald-100 transition-all disabled:opacity-50"
          >
            {syncing ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent" /> : <CloudUpload size={18} />}
            Sync Sheet
          </button>
          
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition-all"
          >
            <FileDown size={18} />
            Cetak PDF
          </button>

          <button 
            onClick={() => onSave(meeting)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-xl hover:bg-slate-800 transition-all active:scale-95"
          >
            <Save size={18} />
            Simpan Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Section Atas: Judul & Status */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Judul Rapat</label>
                    <input 
                        type="text" 
                        placeholder="Masukkan Topik Rapat..."
                        className="w-full text-2xl font-bold text-slate-800 focus:outline-none placeholder:text-slate-200"
                        value={meeting.title}
                        onChange={e => setMeeting({ ...meeting, title: e.target.value })}
                    />
                </div>
                <div className="space-y-2 w-44">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</label>
                    <select 
                        className={`w-full border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none transition-all ${
                            meeting.status === 'Final' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            meeting.status === 'Archived' ? 'bg-slate-50 text-slate-600 border-slate-200' : 
                            'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                        value={meeting.status}
                        onChange={e => setMeeting({ ...meeting, status: e.target.value as any })}
                    >
                        <option value="Draft">🚧 DRAFT</option>
                        <option value="Final">✅ FINAL</option>
                        <option value="Archived">📂 ARSIP</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} /> Tanggal
                </label>
                <input 
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-600"
                  value={meeting.date}
                  onChange={e => setMeeting({ ...meeting, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} /> Lokasi
                </label>
                <input 
                  type="text"
                  placeholder="Lokasi Rapat..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-600"
                  value={meeting.location}
                  onChange={e => setMeeting({ ...meeting, location: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Section Isi: Butir-butir Notulen */}
          <section className="space-y-4">
             <label className="text-sm font-bold text-slate-800">Isi Pembahasan & Keputusan</label>
             {(meeting.points || []).map((point, index) => (
               <div key={point.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-top-2">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Butir {index + 1}</span>
                    <button onClick={() => handleRemovePoint(point.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                  <div className="p-4 space-y-3">
                    <select 
                        value={point.category}
                        onChange={(e) => handleUpdatePoint(point.id, { category: e.target.value as NoteCategory })}
                        className="w-fit bg-slate-100 border-none rounded-lg px-3 py-1 text-[10px] font-black text-slate-600 outline-none uppercase"
                    >
                        <option value="Pembahasan">Pembahasan</option>
                        <option value="Keputusan">Keputusan</option>
                        <option value="Catatan">Catatan</option>
                        <option value="Kendala">Kendala</option>
                    </select>
                    <textarea 
                      placeholder="Tuliskan isi di sini..."
                      className="w-full min-h-[80px] bg-white border border-slate-100 rounded-lg p-1 text-sm text-slate-700 leading-relaxed outline-none resize-none"
                      value={point.content}
                      onChange={(e) => handleUpdatePoint(point.id, { content: e.target.value })}
                    />
                  </div>
               </div>
             ))}
             <button onClick={handleAddPoint} className="flex items-center gap-2 text-blue-600 text-xs font-bold hover:underline"><Plus size={14} /> Tambah Butir Notulen</button>
          </section>

          {/* Section: Ringkasan Manual */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-4 mb-2">
                <FileText size={18} className="text-indigo-600" />
                <h3>Ringkasan Rapat</h3>
            </div>
            <textarea 
              placeholder="Tuliskan ringkasan atau poin-poin utama rapat di sini..."
              className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={meeting.summary}
              onChange={(e) => setMeeting({ ...meeting, summary: e.target.value })}
            />
          </section>

          {/* Section: Tindak Lanjut */}
          <section className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Rencana Tindak Lanjut</label>
              <textarea 
                placeholder="Deskripsi tindak lanjut secara umum..."
                className="w-full min-h-[80px] bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed outline-none"
                value={meeting.followUp}
                onChange={(e) => setMeeting({ ...meeting, followUp: e.target.value })}
              />
            </div>

            {/* Sub-Section: Penanggungjawab Tindak Lanjut (SESUAI REQUEST) */}
            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-slate-800">Penanggungjawab Tindak Lanjut *</h3>
                <div className="space-y-4">
                    {meeting.actionItems.map((item) => (
                        <div key={item.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 flex flex-wrap md:flex-nowrap gap-4 items-end animate-in fade-in duration-300">
                            <div className="flex-1 space-y-2 min-w-[150px]">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">Nama *</label>
                                <input 
                                    type="text"
                                    placeholder="Nama"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700"
                                    value={item.assignee}
                                    onChange={(e) => handleUpdateActionItem(item.id, { assignee: e.target.value })}
                                />
                            </div>
                            <div className="flex-[1.5] space-y-2 min-w-[200px]">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">Tugas *</label>
                                <input 
                                    type="text"
                                    placeholder="Tugas"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700"
                                    value={item.task}
                                    onChange={(e) => handleUpdateActionItem(item.id, { task: e.target.value })}
                                />
                            </div>
                            <div className="w-full md:w-48 space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 ml-1">Deadline *</label>
                                <input 
                                    type="date"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700"
                                    value={item.deadline}
                                    onChange={(e) => handleUpdateActionItem(item.id, { deadline: e.target.value })}
                                />
                            </div>
                            <button 
                                onClick={() => handleRemoveActionItem(item.id)}
                                className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-100 mb-[1px]"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={handleAddActionItem}
                    className="flex items-center gap-2 bg-slate-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-all shadow-md active:scale-95"
                >
                    <Plus size={18} /> Tambah Penanggungjawab
                </button>
            </div>
          </section>

          {/* Section: Pengesahan (Notulis & Mengetahui) */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-100 pb-4 mb-4">
                <Shield size={18} className="text-blue-600" />
                <h3>Pengesahan Notulensi (Penandatangan)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Notulis</label>
                    <input 
                        type="text" 
                        placeholder="Nama Lengkap Notulis..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium"
                        value={meeting.scribeName}
                        onChange={e => setMeeting({ ...meeting, scribeName: e.target.value })}
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pejabat (Mengetahui)</label>
                    <input 
                        type="text" 
                        placeholder="Nama Pejabat / Kepala..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 font-medium"
                        value={meeting.approverName}
                        onChange={e => setMeeting({ ...meeting, approverName: e.target.value })}
                    />
                </div>
            </div>
          </section>
        </div>

        {/* Sidebar Kanan: Peserta */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={16} /> Peserta</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Nama..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  value={newAttendee.name}
                  onChange={e => setNewAttendee({ ...newAttendee, name: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Jabatan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  value={newAttendee.position}
                  onChange={e => setNewAttendee({ ...newAttendee, position: e.target.value })}
                />
                <button onClick={handleAddAttendee} className="w-full bg-blue-600 text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider">Tambah</button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {(meeting.attendees || []).map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 group transition-all">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[11px] font-bold text-slate-800 truncate">{a.name}</p>
                      <p className="text-[9px] text-slate-500 truncate">{a.position}</p>
                    </div>
                    <button onClick={() => handleRemoveAttendee(a.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 ml-2"><UserMinus size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <section className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
              <Info size={16} />
              <h4 className="text-xs">Informasi</h4>
            </div>
            <p className="text-[10px] text-indigo-600 leading-relaxed">
              Semua data disimpan secara lokal di peramban Anda. Pastikan untuk "Cetak PDF" atau "Sync Sheet" untuk cadangan data permanen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MeetingEditor;
