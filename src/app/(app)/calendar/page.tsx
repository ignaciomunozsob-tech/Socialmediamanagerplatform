export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import CalendarView from "./CalendarView";

export default async function CalendarPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pieces: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let clients: any[] = [];

  try {
    const supabase = await createClient();
    const [piecesRes, clientsRes] = await Promise.all([
      supabase.from("content_pieces").select("*, client:clients(name,color)").not("scheduled_date", "is", null).order("scheduled_date"),
      supabase.from("clients").select("id,name,color"),
    ]);
    pieces = piecesRes.data ?? [];
    clients = clientsRes.data ?? [];
  } catch {
    pieces = [];
    clients = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Calendario</h1>
        <p className="text-text-dim text-sm mt-1">Vista semanal de piezas de contenido</p>
      </div>
      <CalendarView pieces={pieces} clients={clients} />
    </div>
  );
}
