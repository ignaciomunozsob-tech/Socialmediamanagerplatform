export const dynamic = "force-dynamic";
import { createServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PortalView from "./PortalView";

export default async function PortalPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const supabase = await createServiceClient();

  const [clientRes, piecesRes, meetingsRes, reportsRes] = await Promise.all([
    supabase.from("clients").select("*").eq("id", clientId).single(),
    supabase.from("content_pieces").select("*, comments(*)").eq("client_id", clientId).order("scheduled_date", { ascending: false }),
    supabase.from("meetings").select("*").eq("client_id", clientId).order("date", { ascending: false }),
    supabase.from("reports").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
  ]);

  if (!clientRes.data) notFound();

  return (
    <PortalView
      client={clientRes.data}
      pieces={piecesRes.data ?? []}
      meetings={meetingsRes.data ?? []}
      reports={reportsRes.data ?? []}
    />
  );
}
