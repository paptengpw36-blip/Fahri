
import { Meeting } from '../types';

export const syncMeetingToSheets = async (meeting: Meeting, webhookUrl: string) => {
  if (!webhookUrl) {
    throw new Error("Webhook URL belum dikonfigurasi.");
  }

  const payload = {
    id: meeting.id,
    title: meeting.title,
    date: meeting.date,
    location: meeting.location,
    attendees: meeting.attendees.map(a => `${a.name} (${a.position})`).join(', '),
    summary: meeting.summary || '',
    points: meeting.points.map(p => `[${p.category}] ${p.content}`).join('\n'),
    followUp: meeting.followUp,
    actionItems: meeting.actionItems.map(i => `${i.task} (PJ: ${i.assignee}, Deadline: ${i.deadline})`).join('\n'),
    scribe: meeting.scribeName || '',
    approver: meeting.approverName || ''
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response;
};

export const APPS_SCRIPT_SNIPPET = `
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Menambahkan baris baru ke sheet (dengan kolom tambahan untuk Notulis dan Pejabat)
  sheet.appendRow([
    data.date,
    data.title,
    data.location,
    data.attendees,
    data.summary,
    data.points,
    data.followUp,
    data.actionItems,
    data.scribe,
    data.approver
  ]);
  
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
`;
