export const dynamic = "force-dynamic";
import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PortalView from "./PortalView";
import { Client, ContentPiece, Meeting, Report } from "@/types/database";

export default async function PortalPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;

  let client: Client | null = null;
  let pieces: ContentPiece[] = [];
  let meetings: Meeting[] = [];
  let reports: Report[] = [];

  try {
    const supabase = await createServiceClient();
    const [clientRes, piecesRes, meetingsRes, reportsRes] = await Promise.all([
      supabase.from("clients").select("*").eq("id", clientId).single(),
      supabase.from("content_pieces").select("*, comments(*)").eq("client_id", clientId).order("scheduled_date", { ascending: false }),
      supabase.from("meetings").select("*").eq("client_id", clientId).order("date", { ascending: false }),
      supabase.from("reports").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
    ]);

    if (!clientRes.data) notFound();

    client = clientRes.data as Client;
    pieces = (piecesRes.data ?? []) as ContentPiece[];
    meetings = (meetingsRes.data ?? []) as Meeting[];
    reports = (reportsRes.data ?? []) as Report[];
  } catch {
    notFound();
  }

  if (!client) notFound();

  return (
    <PortalView
      client={client}
      pieces={pieces}
      meetings={meetings}
      reports={reports}
    />
  );
}
