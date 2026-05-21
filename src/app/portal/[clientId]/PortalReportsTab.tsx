import { Report } from "@/types/database";

export default function PortalReportsTab({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-16 text-text-dim">No hay reportes todavía</div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <a
          key={r.id}
          href={r.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-surface border border-border hover:border-accent/40 rounded-xl p-4 transition-colors group"
        >
          <div className="w-10 h-10 bg-accent/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="text-accent" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text group-hover:text-accent transition-colors truncate">{r.title}</p>
            <p className="text-text-dim text-xs mt-0.5">
              {new Date(r.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <svg className="text-text-dim group-hover:text-accent transition-colors flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      ))}
    </div>
  );
}
