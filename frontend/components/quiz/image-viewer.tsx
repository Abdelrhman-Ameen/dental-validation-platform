"use client";

import { useState } from "react";
import Image from "next/image";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImageViewer({ imageUrl, alt }: { imageUrl: string; alt: string }) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="overflow-hidden rounded-lg border bg-black">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#151a1b] px-3 py-2 text-white">
        <span className="text-xs font-medium uppercase text-slate-300">Radiograph viewer</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-200" onClick={() => setZoom((value) => Math.max(1, value - 0.2))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-200" onClick={() => setZoom(1)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-200" onClick={() => setZoom((value) => Math.min(3, value + 0.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative flex aspect-[2/1] min-h-[260px] items-center justify-center overflow-auto">
        <div className="relative h-full w-full transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
          <Image src={imageUrl} alt={alt} fill className="object-contain p-3" sizes="(max-width: 768px) 100vw, 64vw" />
        </div>
      </div>
    </div>
  );
}
