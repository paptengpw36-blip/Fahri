
import { Meeting } from '../types';

export const generateMeetingPDF = (meeting: Meeting) => {
  // Access jsPDF from global window object because it's imported via script tag
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF();

  // Government Header Style
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('BADAN PENGAWASAN KEUANGAN DAN PEMBANGUNAN', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('PERWAKILAN PROVINSI PAPUA TENGAH', 105, 22, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 27, 190, 27);
  doc.setLineWidth(0.2);
  doc.line(20, 28, 190, 28);

  // Document Title
  doc.setFontSize(14);
  doc.text('NOTULEN RAPAT', 105, 40, { align: 'center' });
  
  // Meeting Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Judul Rapat : ${meeting.title || '-'}`, 20, 50);
  doc.text(`Tanggal      : ${meeting.date || '-'}`, 20, 56);
  doc.text(`Tempat       : ${meeting.location || '-'}`, 20, 62);

  let currentY = 75;

  // 1. Peserta
  doc.setFont('helvetica', 'bold');
  doc.text('I. DAFTAR PESERTA', 20, currentY);
  currentY += 5;

  const attendeesRows = (meeting.attendees || []).map((a, i) => [i + 1, a.name, a.position]);
  (doc as any).autoTable({
    startY: currentY,
    head: [['No', 'Nama', 'Jabatan']],
    body: attendeesRows.length > 0 ? attendeesRows : [['-', 'Tidak ada data', '-']],
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85] },
    margin: { left: 20, right: 20 },
    didDrawPage: (data: any) => { currentY = data.cursor.y; }
  });

  currentY += 15;
  if (currentY > 250) { doc.addPage(); currentY = 20; }

  // 2. Pembahasan & Keputusan
  doc.setFont('helvetica', 'bold');
  doc.text('II. PEMBAHASAN DAN KEPUTUSAN', 20, currentY);
  currentY += 8;
  doc.setFont('helvetica', 'normal');

  (meeting.points || []).forEach((point, index) => {
    if (currentY > 260) { doc.addPage(); currentY = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}. [${point.category.toUpperCase()}]`, 25, currentY);
    currentY += 6;
    doc.setFont('helvetica', 'normal');
    const splitContent = doc.splitTextToSize(point.content || '-', 160);
    doc.text(splitContent, 25, currentY);
    currentY += (splitContent.length * 5) + 5;
  });

  currentY += 10;
  if (currentY > 260) { doc.addPage(); currentY = 20; }

  // 3. Rencana Tindak Lanjut
  doc.setFont('helvetica', 'bold');
  doc.text('III. RENCANA TINDAK LANJUT', 20, currentY);
  currentY += 8;
  doc.setFont('helvetica', 'normal');
  const splitFollowUp = doc.splitTextToSize(meeting.followUp || '-', 170);
  doc.text(splitFollowUp, 20, currentY);
  currentY += (splitFollowUp.length * 5) + 15;

  if (currentY > 240) { doc.addPage(); currentY = 20; }

  // 4. Penanggungjawab Tindak Lanjut
  doc.setFont('helvetica', 'bold');
  doc.text('IV. PENANGGUNGJAWAB TINDAK LANJUT', 20, currentY);
  currentY += 5;

  const actionRows = (meeting.actionItems || []).map((item, i) => [i + 1, item.assignee, item.task, item.deadline]);
  (doc as any).autoTable({
    startY: currentY,
    head: [['No', 'Nama Penanggungjawab', 'Tugas', 'Tenggat Waktu']],
    body: actionRows.length > 0 ? actionRows : [['-', 'Belum ada', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85] },
    margin: { left: 20, right: 20 },
    didDrawPage: (data: any) => { currentY = data.cursor.y; }
  });

  // Footer for Signatures (Updated with actual names)
  currentY += 25;
  if (currentY > 240) { doc.addPage(); currentY = 20; }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Mengetahui,', 150, currentY, { align: 'center' });
  doc.text('Notulis,', 40, currentY, { align: 'center' });
  
  currentY += 25; // Space for signature
  
  doc.setFont('helvetica', 'bold');
  // Menampilkan Nama Notulis
  const scribe = meeting.scribeName && meeting.scribeName.trim() !== "" ? meeting.scribeName : "______________________";
  doc.text(scribe, 40, currentY, { align: 'center' });
  
  // Menampilkan Nama Pejabat
  const approver = meeting.approverName && meeting.approverName.trim() !== "" ? meeting.approverName : "______________________";
  doc.text(approver, 150, currentY, { align: 'center' });

  // Save the PDF
  const fileName = `Notulen_${meeting.title?.replace(/\s+/g, '_') || 'Rapat'}_${meeting.date || ''}.pdf`;
  doc.save(fileName);
};
