"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ContentPiece, Comment } from "@/types/database";
import { useRouter } from "next/navigation";

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  pending_approval: "Pendiente",
  approved: "Aprobado",
  changes_requested: "Cambios",
  published: "Publicado",
};

const statusStyle: Record<string, string> = {
  draft: "bg-muted/20 text-muted",
  pending_approval: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/20 text-green-400",
  changes_requested: "bg-orange-500/20 text-orange-400",
  published: "bg-accent/20 text-accent",
};

export default function ContentTab({ clientId, pieces }: { clientId: string; pieces: ContentPiece[] }) {
  const [showNew, setShowNew] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<ContentPiece | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [form, setForm] = useState({ title: "", caption: "", platform: "", scheduled_date: "", status: "draft" });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function openPiece(piece: ContentPiece) {
    setSelectedPiece(piece);
    setLoadingComments(true);
    const { data } = await supabase.from("comments").select("*").eq("content_piece_id", piece.id).order("created_at");
    setComments(data ?? []);
    setLoadingComments(false);
  }

  async function addComment() {
    if (!newComment.trim() || !selectedPiece) return;
    const { data } = await supabase.from("comments").insert({
      content_piece_id: selectedPiece.id,
      author: "Freelancer",
      body: newComment,
      is_client: false,
    }).select().single();
    if (data) setComments([...comments, data]);
    setNewComment("");
  }

  async function savePiece(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("content_pieces").insert({
      client_id: clientId,
      title: form.title,
      caption: form.caption || null,
      platform: form.platform || null,
      scheduled_date: form.scheduled_date || null,
      status: form.status,
    });
    setSaving(false);
    setShowNew(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-dim text-white text-sm rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva pieza
        </button>
      </div>

      {pieces.length === 0 ? (
        <p className="text-text-dim text-sm text-center py-12">Sin piezas de contenido</p>
      ) : (
        <div className="space-y-2">
          {pieces.map((piece) => (
            <button key={piece.id} onClick={() => openPiece(piece)}
              className="w-full text-left bg-surface border border-border hover:border-accent/40 rounded-xl p-4 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text text-sm">{piece.title}</p>
                  {piece.caption && <p className="text-text-dim text-xs mt-1 line-clamp-2">{piece.caption}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    {piece.platform && <span className="text-xs text-text-dim">{piece.platform}</span>}
                    {piece.scheduled_date && (
                      <span className="text-xs text-text-dim">
                        {new Date(piece.scheduled_date).toLocaleDateString("es-ES")}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${statusStyle[piece.status]}`}>
                  {statusLabel[piece.status]}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">Nueva pieza</h2>
              <button onClick={() => setShowNew(false)} className="text-text-dim hover:text-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={savePiece} className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-text-dim mb-1">Título *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs text-text-dim mb-1">Caption</label>
                <textarea rows={3} value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-dim mb-1">Plataforma</label>
                  <input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    placeholder="Instagram, TikTok..."
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Fecha programada</label>
                  <input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-dim mb-1">Estado</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent">
                  <option value="draft">Borrador</option>
                  <option value="pending_approval">Pendiente aprobación</option>
                  <option value="approved">Aprobado</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)}
                  className="flex-1 py-2 border border-border rounded-lg text-sm text-text-dim hover:text-text transition-colors">Cancelar</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 bg-accent hover:bg-accent-dim disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPiece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
              <div>
                <h2 className="font-semibold text-text">{selectedPiece.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyle[selectedPiece.status]}`}>
                  {statusLabel[selectedPiece.status]}
                </span>
              </div>
              <button onClick={() => setSelectedPiece(null)} className="text-text-dim hover:text-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selectedPiece.caption && (
                <div className="bg-bg border border-border rounded-lg p-3">
                  <p className="text-xs text-text-dim mb-1">Caption</p>
                  <p className="text-sm text-text whitespace-pre-wrap">{selectedPiece.caption}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-text-dim font-medium uppercase tracking-wider mb-3">Comentarios</p>
                {loadingComments ? (
                  <p className="text-text-dim text-sm">Cargando...</p>
                ) : comments.length === 0 ? (
                  <p className="text-text-dim text-sm">Sin comentarios</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className={`flex gap-2 ${c.is_client ? "flex-row" : "flex-row-reverse"}`}>
                        <div className={`rounded-xl px-3 py-2 max-w-xs text-sm ${c.is_client ? "bg-border text-text" : "bg-accent/20 text-text"}`}>
                          <p className="text-xs font-medium mb-1" style={{ color: c.is_client ? "#9999AA" : "#7B6EFF" }}>{c.author}</p>
                          {c.body}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border flex-shrink-0 flex gap-2">
              <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                placeholder="Agregar comentario..."
                className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
              <button onClick={addComment}
                className="px-3 py-2 bg-accent hover:bg-accent-dim text-white rounded-lg text-sm transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
