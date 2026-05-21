import { Meeting } from "@/types/database";

export default function PortalMeetingsTab({ meetings }: { meetings: Meeting[] }) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-16 text-text-dim">No hay reuniones registradas</div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((m) => (
        <div key={m.id} className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-text">{m.title}</h3>
            <span className="text-xs text-text-dim flex-shrink-0 bg-bg border border-border px-2 py-1 rounded-full">
              {new Date(m.date).toLocaleDateString("es-ES", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {m.notes && (
            <div className="mb-3">
              <p className="text-xs text-text-dim font-medium uppercase tracking-wider mb-2">Notas</p>
              <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">{m.notes}</p>
            </div>
          )}

          {m.agreements && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-xs text-accent font-medium uppercase tracking-wider mb-2">Acuerdos</p>
              <p className="text-sm text-text whitespace-pre-wrap leading-relaxed">{m.agreements}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
