import { createClient } from "@/lib/supabase/server";
import CalendarView from "./CalendarView";

export default async function CalendarPage() {
  const supabase = await createClient();
  const [piecesRes, clientsRes] = await Promise.all([
    supabase.from("content_pieces").select("*, client:clients(name,color)").not("scheduled_date", "is", null).order("scheduled_date"),
    supabase.from("clients").select("id,name,color"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Calendario</h1>
        <p className="text-text-dim text-sm mt-1">Vista semanal de piezas de contenido</p>
      </div>
      <CalendarView pieces={piecesRes.data ?? []} clients={clientsRes.data ?? []} />
    </div>
  );
}
