export const dynamic = "force-dynamic";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ClientDetail from "./ClientDetail";
import { Client, ContentPiece, Finance, Meeting } from "@/types/database";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let client: Client | null = null;
  let pieces: ContentPiece[] = [];
  let finances: Finance[] = [];
  let meetings: Meeting[] = [];
  let reports: unknown[] = [];

  try {
    const supabase = await createServerClient();
    const [clientRes, piecesRes, financesRes, meetingsRes, reportsRes] = await Promise.all([
      supabase.from("clients").select("*").eq("id", id).single(),
      supabase.from("content_pieces").select("*").eq("client_id", id).order("scheduled_date", { ascending: false }),
      supabase.from("finances").select("*").eq("client_id", id).order("date", { ascending: false }),
      supabase.from("meetings").select("*").eq("client_id", id).order("date", { ascending: false }),
      supabase.from("reports").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    ]);

    if (!clientRes.data) notFound();

    client = clientRes.data as Client;
    pieces = (piecesRes.data ?? []) as ContentPiece[];
    finances = (financesRes.data ?? []) as Finance[];
    meetings = (meetingsRes.data ?? []) as Meeting[];
    reports = reportsRes.data ?? [];
  } catch {
    notFound();
  }

  if (!client) notFound();

  return (
    <ClientDetail
      client={client}
      pieces={pieces}
      finances={finances}
      meetings={meetings}
      reports={reports}
    />
  );
}
