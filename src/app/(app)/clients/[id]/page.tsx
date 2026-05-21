import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ClientDetail from "./ClientDetail";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const [clientRes, piecesRes, financesRes, meetingsRes, reportsRes] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase.from("content_pieces").select("*").eq("client_id", id).order("scheduled_date", { ascending: false }),
    supabase.from("finances").select("*").eq("client_id", id).order("date", { ascending: false }),
    supabase.from("meetings").select("*").eq("client_id", id).order("date", { ascending: false }),
    supabase.from("reports").select("*").eq("client_id", id).order("created_at", { ascending: false }),
  ]);

  if (!clientRes.data) notFound();

  return (
    <ClientDetail
      client={clientRes.data}
      pieces={piecesRes.data ?? []}
      finances={financesRes.data ?? []}
      meetings={meetingsRes.data ?? []}
      reports={reportsRes.data ?? []}
    />
  );
}
