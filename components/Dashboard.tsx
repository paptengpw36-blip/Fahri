
import React from 'react';
import { Users, FileCheck, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Meeting } from '../types';

interface DashboardProps {
  meetings: Meeting[];
  onViewMeeting: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ meetings, onViewMeeting }) => {
  const stats = [
    { label: 'Total Rapat', value: meetings.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Finalisasi', value: meetings.filter(m => m.status === 'Final').length, icon: FileCheck, color: 'bg-emerald-500' },
    { label: 'Sedang Berjalan', value: meetings.filter(m => m.status === 'Draft').length, icon: Clock, color: 'bg-amber-500' },
    { label: 'Peserta Terlibat', value: 42, icon: Users, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Selamat Pagi, Admin</h2>
        <p className="text-slate-500">Pantau progres dokumentasi rapat Anda hari ini.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`${stat.color} p-4 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Rapat Terbaru</h3>
            <button className="text-sm text-blue-600 font-semibold hover:underline">Lihat Semua</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Topik Rapat</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meetings.slice(0, 5).map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => onViewMeeting(meeting.id)}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{meeting.title}</p>
                      <p className="text-xs text-slate-500">{meeting.location}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(meeting.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        meeting.status === 'Final' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {meeting.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors">
                        <TrendingUp size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Tindakan Menunggu</h3>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            {meetings.flatMap(m => m.actionItems).slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="mt-1">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 leading-snug">{item.task}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{item.assignee}</span>
                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{item.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
