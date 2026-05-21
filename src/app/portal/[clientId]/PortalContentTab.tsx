"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ContentPiece, Comment } from "@/types/database";

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  pending_approval: "Pendiente",
  approved: "Aprobado",
  changes_requested: "Cambios solicitados",
  published: "Publicado",
};

const statusStyle: Record<string, string> = {
  draft: "bg-muted/20 text-muted",
  pending_approval: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/20 text-green-400",
  changes_requested: "bg-orange-500/20 text-orange-400",
  published: "bg-accent/20 text-accent",
};

export default function PortalContentTab({
  pieces,
  clientId,
}: {
  pieces: ContentPiece[];
  clientId: string;
}) {
  const [selectedPiece, setSelectedPiece] = useState<ContentPiece | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentName, setCommentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  async function openPiece(piece: ContentPiece) {
    setSelectedPiece(piece);
    setLoading(true);
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("content_piece_id", piece.id)
      .order("created_at");
    setComments(data ?? []);
    setLoading(false);
  }

  async function addComment() {
    if (!newComment.trim() || !selectedPiece) return;
    const author = commentName.trim() || "Cliente";
    const { data } = await supabase
      .from("comments")
      .insert({
        content_piece_id: selectedPiece.id,
        author,
        body: newComment,
        is_client: true,
      })
      .select()
      .single();
    if (data) setComments([...comments, data]);
    setNewComment("");
  }

  async function updateStatus(status: string) {
    if (!selectedPiece) return;
    setUpdating(true);
    await supabase.from("content_pieces").update({ status }).eq("id", selectedPiece.id);
    setSelectedPiece({ ...selectedPiece, status: status as ContentPiece["status"] });
    setUpdating(false);
  }

  return (
    <div>
      {pieces.length === 0 ? (
        <div className="text-center py-16 text-text-dim">No hay piezas de contenido todavía</div>
      ) : (
        <div className="space-y-3">
          {pieces.map((piece) => (
            <button
              key={piece.id}
              onClick={() => openPiece(piece)}
              className="w-full text-left bg-surface border border-border hover:border-accent/40 rounded-xl p-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text">{piece.title}</p>
                  {piece.caption && (
                    <p className="text-text-dim text-sm mt-1 line-clamp-2">{piece.caption}</p>
                  )}
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
                <div className="bg-bg border border-border rounded-lg p-4">
                  <p className="text-xs text-text-dim mb-2">Caption</p>
                  <p className="text-sm text-text whitespace-pre-wrap">{selectedPiece.caption}</p>
                </div>
              )}

              {selectedPiece.status === "pending_approval" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus("approved")}
                    disabled={updating}
                    className="flex-1 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => updateStatus("changes_requested")}
                    disabled={updating}
                    className="flex-1 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Solicitar cambios
                  </button>
                </div>
              )}

              <div>
                <p className="text-xs text-text-dim font-medium uppercase tracking-wider mb-3">Comentarios</p>
                {loading ? (
                  <p className="text-text-dim text-sm">Cargando...</p>
                ) : comments.length === 0 ? (
                  <p className="text-text-dim text-sm">Sin comentarios aún</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className={`flex gap-2 ${c.is_client ? "flex-row" : "flex-row-reverse"}`}>
                        <div className={`rounded-xl px-3 py-2 max-w-xs text-sm ${c.is_client ? "bg-accent/20 text-text" : "bg-border text-text"}`}>
                          <p className="text-xs font-medium mb-1" style={{ color: c.is_client ? "#7B6EFF" : "#9999AA" }}>{c.author}</p>
                          {c.body}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border flex-shrink-0 space-y-2">
              <input
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent"
              />
              <div className="flex gap-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
                  placeholder="Escribir comentario..."
                  className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent"
                />
                <button onClick={addComment}
                  className="px-4 py-2 bg-accent hover:bg-accent-dim text-white rounded-lg text-sm transition-colors">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
