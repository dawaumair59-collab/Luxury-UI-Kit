import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { getMyRestaurant, getMenuItems, getVideos, addVideo, deleteVideo, type MenuItem, type Video } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/upload";
import { useToast } from "@/components/ui/LuxToast";

function VideoCard({ video, onDelete }: { video: Video; onDelete: () => void }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else { videoRef.current.play(); setPlaying(true); }
  };

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="glass-dark border border-white/10 rounded-2xl overflow-hidden group"
    >
      <div className="relative aspect-video bg-black cursor-pointer" onClick={toggle}>
        <video
          ref={videoRef}
          src={video.video_url}
          className="w-full h-full object-cover"
          muted loop playsInline
          poster={video.thumbnail_url ?? undefined}
          onEnded={() => setPlaying(false)}
        />
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-gold ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <p className="text-sm text-white font-medium truncate">{video.title}</p>
        <button onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all flex-shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

function UploadModal({
  restaurantId,
  menuItems,
  onUploaded,
  onClose,
}: {
  restaurantId: string;
  menuItems: MenuItem[];
  onUploaded: (v: Video) => void;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [menuItemId, setMenuItemId] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleUpload = async () => {
    if (!file || !title.trim()) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, setProgress);
      const video = await addVideo({
        restaurant_id: restaurantId,
        menu_item_id: menuItemId || null,
        title: title.trim(),
        video_url: result.url,
        thumbnail_url: result.thumbnailUrl,
      });
      onUploaded(video);
      showToast("Video uploaded successfully!", "success");
      onClose();
    } catch (e: unknown) {
      showToast((e as Error).message, "error");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-dark border border-white/15 rounded-2xl p-6 w-full max-w-md space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-serif text-white">Upload Cinematic Video</h3>

        {/* Drop zone */}
        <div
          ref={dropRef}
          className="relative h-44 border-2 border-dashed border-white/15 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gold/40 transition-colors"
          onClick={() => document.getElementById("video-input")?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("video/")) setFile(f); }}
        >
          {file ? (
            <div className="text-center px-4">
              <p className="text-gold font-medium text-sm">✓ {file.name}</p>
              <p className="text-white/40 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
              </svg>
              <p className="text-white/40 text-sm">Drop video or click to browse</p>
              <p className="text-white/25 text-xs">MP4, MOV, WebM — auto compressed by Cloudinary</p>
            </>
          )}
          <input id="video-input" type="file" accept="video/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/50">
              <span>Uploading & compressing…</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gold rounded-full" animate={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title *"
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold/60" />

        <select value={menuItemId} onChange={(e) => setMenuItemId(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-gold/60">
          <option value="" className="bg-neutral-900">Attach to menu item (optional)</option>
          {menuItems.map((it) => <option key={it.id} value={it.id} className="bg-neutral-900">{it.name}</option>)}
        </select>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={uploading} className="flex-1 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm hover:text-white transition-colors disabled:opacity-40">Cancel</button>
          <button onClick={handleUpload} disabled={!file || !title.trim() || uploading}
            className="flex-1 py-2.5 rounded-xl bg-gold text-black font-semibold text-sm disabled:opacity-40 hover:bg-gold/90 transition-colors">
            {uploading ? `${progress}%` : "Upload"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function VideosPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const r = await getMyRestaurant();
      if (!r) { setLoading(false); return; }
      setRestaurantId(r.id);
      const [vs, its] = await Promise.all([getVideos(r.id), getMenuItems(r.id)]);
      setVideos(vs);
      setMenuItems(its);
      setLoading(false);
    })();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      showToast("Video deleted", "success");
    } catch (e: unknown) { showToast((e as Error).message, "error"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (!restaurantId) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-white/50">
      <p>Complete restaurant setup first.</p>
      <a href="/dashboard/setup" className="text-gold text-sm hover:underline">Go to Setup →</a>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-white">Cinematic Videos</h1>
          <p className="text-sm text-white/40 mt-0.5">Auto-compressed via Cloudinary. Attach to menu items.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-black rounded-xl font-semibold text-sm hover:bg-gold/90 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Video
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 border border-dashed border-white/10 rounded-2xl text-white/30">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
          </svg>
          <p className="text-sm">No videos yet. Upload your first cinematic clip.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} onDelete={() => handleDelete(v.id)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && restaurantId && (
          <UploadModal
            restaurantId={restaurantId}
            menuItems={menuItems}
            onUploaded={(v) => setVideos((prev) => [v, ...prev])}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
