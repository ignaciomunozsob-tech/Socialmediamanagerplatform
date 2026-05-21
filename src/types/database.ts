export type ClientStatus = "active" | "inactive" | "paused";
export type ContentStatus = "draft" | "pending_approval" | "approved" | "published" | "changes_requested";
export type LeadStatus = "lead" | "contacted" | "proposal" | "negotiation" | "won" | "lost";
export type FinanceType = "income" | "expense";

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: ClientStatus;
  color: string;
  billing_day: number | null;
  monthly_fee: number | null;
  notes: string | null;
  created_at: string;
}

export interface ContentPiece {
  id: string;
  client_id: string;
  title: string;
  caption: string | null;
  platform: string | null;
  scheduled_date: string | null;
  status: ContentStatus;
  media_urls: string[] | null;
  created_at: string;
  client?: Client;
}

export interface Comment {
  id: string;
  content_piece_id: string;
  author: string;
  body: string;
  is_client: boolean;
  created_at: string;
}

export interface Finance {
  id: string;
  client_id: string | null;
  type: FinanceType;
  description: string;
  amount: number;
  date: string;
  paid: boolean;
  created_at: string;
  client?: Client;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  notes: string | null;
  estimated_value: number | null;
  created_at: string;
}

export interface Meeting {
  id: string;
  client_id: string;
  title: string;
  date: string;
  notes: string | null;
  agreements: string | null;
  created_at: string;
  client?: Client;
}

export interface Report {
  id: string;
  client_id: string;
  title: string;
  file_url: string;
  created_at: string;
  client?: Client;
}
