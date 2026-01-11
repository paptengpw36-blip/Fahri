
export type NoteCategory = 'Pembahasan' | 'Keputusan' | 'Catatan' | 'Kendala';

export interface NotePoint {
  id: string;
  category: NoteCategory;
  content: string;
}

export interface Attendee {
  id: string;
  name: string;
  position: string;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: Attendee[];
  points: NotePoint[];
  followUp: string;
  summary?: string;
  actionItems: ActionItem[];
  status: 'Draft' | 'Final' | 'Archived';
  category: string;
  scribeName?: string;
  approverName?: string;
}

export type ViewState = 'dashboard' | 'list' | 'create' | 'detail' | 'integrations' | 'archive';
