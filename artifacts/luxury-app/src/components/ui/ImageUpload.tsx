import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface ImageUploadProps {
  label: string;
  value?: string | null;
  onChange: (file: File) => void;
  aspect?: "square" | "banner";
  loading?: boolean;
}

export function ImageUpload({ label, value, onChange, aspect = "square", loading }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) onChange(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-white/60 uppercase tracking-widest">{label}</span>
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden
          ${aspect === "banner" ? "h-32" : "h-32 w-32"}
          ${dragging ? "border-gold bg-gold/10" : "border-white/20 hover:border-gold/50"}
          ${value ? "border-gold/30" : ""}`}
      >
        {value ? (
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white/40">
            {loading ? (
              <div className="w-6 h-6 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Drop or click</span>
              </>
            )}
          </div>
        )}
      </motion.div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}
