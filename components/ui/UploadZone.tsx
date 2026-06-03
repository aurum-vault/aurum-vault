"use client";

import React, { useRef, useState } from "react";
import { clsx } from "clsx";

interface UploadZoneProps {
  onFiles: (files: string[]) => void;
  onCapture?: () => void;
  className?: string;
}

export function UploadZone({ onFiles, onCapture, className }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFiles = (files: FileList | null) => {
    if (!files) return;
    const results: string[] = [];
    Array.from(files)
      .slice(0, 8)
      .forEach((f) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          results.push(e.target?.result as string);
          if (results.length === Math.min(files.length, 8)) {
            onFiles(results);
          }
        };
        reader.readAsDataURL(f);
      });
  };

  return (
    <>
      <div
        className={clsx(
          "border-2 border-dashed border-[var(--border-active)] rounded-xl p-8 text-center bg-[var(--gold-light)] transition-all",
          dragging && "bg-[rgba(184,134,11,0.15)] border-[var(--gold)]",
          className
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          readFiles(e.dataTransfer.files);
        }}
      >
        <div className="text-[36px] mb-2">📸</div>
        <p className="text-[var(--sec)] mb-3">Drag & drop images here, or</p>
        <div className="flex gap-2.5 justify-center flex-wrap">
          <button
            type="button"
            className="btn btn-outline border-[var(--gold)] text-[var(--gold)] btn-sm uppercase tracking-[1px] hover:bg-[var(--gold-light)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
            onClick={() => inputRef.current?.click()}
          >
            📁 Upload from Device
          </button>
          {onCapture && (
            <button
              type="button"
              className="btn-gold btn btn-sm uppercase tracking-[1px]"
              onClick={onCapture}
            >
              📷 Capture with Camera
            </button>
          )}
        </div>
        <p className="text-[11px] text-[var(--muted)] mt-3">
          Front · Back · Detail/Clasp · Hallmark. Max 8 images, 5MB each.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { readFiles(e.target.files); e.target.value = ""; }}
      />
    </>
  );
}

interface ImageThumbsProps {
  images: string[];
  onRemove: (i: number) => void;
}

export function ImageThumbs({ images, onRemove }: ImageThumbsProps) {
  if (!images.length) return null;
  return (
    <div className="flex gap-2.5 flex-wrap mt-3">
      {images.map((img, i) => (
        <div key={i} className="relative w-20 h-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-[var(--border-color)]" />
          <button
            onClick={() => onRemove(i)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--red)] text-white text-[13px] flex items-center justify-center leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
