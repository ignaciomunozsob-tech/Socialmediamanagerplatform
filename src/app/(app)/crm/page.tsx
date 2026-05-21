import { createClient } from "@/lib/supabase/server";
import CRMBoard from "./CRMBoard";

export default async function CRMPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">CRM</h1>
        <p className="text-text-dim text-sm mt-1">Pipeline de leads</p>
      </div>
      <CRMBoard leads={leads ?? []} />
    </div>
  );
}
