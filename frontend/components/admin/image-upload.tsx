"use client";

import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Clipboard, CloudUpload, ImageIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type UploadedImage = {
  id: string;
  imageUrl: string;
  publicId: string;
  originalName: string;
  uploadedBy?: string;
  uploadedAt?: unknown;
  bytes?: number;
  width?: number;
  height?: number;
};

type UploadResponse = {
  success?: boolean;
  imageUrl?: string;
  publicId?: string;
  error?: string;
  annotationsFound?: boolean;
  dominantCondition?: string;
  annotationCount?: number;
  questionId?: string;
  referenceFindings?: Array<{ condition: string; toothIds: string[] }>;
};

type GalleryResponse = {
  images?: UploadedImage[];
  error?: string;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes?: number) {
  if (!bytes) {
    return "Unknown size";
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageUpload() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [lastUploadedUrl, setLastUploadedUrl] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [galleryNotice, setGalleryNotice] = useState("");
  const [lastAnnotation, setLastAnnotation] = useState<UploadResponse | null>(null);

  const loadGallery = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/upload-image", { cache: "no-store" });
      const data = (await response.json()) as GalleryResponse;
      if (!response.ok || !data.images) {
        throw new Error(data.error || "Could not load uploaded image gallery.");
      }
      setImages(data.images);
      setGalleryNotice("");
    } catch (err) {
      setImages([]);
      setGalleryNotice(err instanceof Error ? err.message : "Could not load uploaded image gallery.");
    }
  }, []);

  useEffect(() => {
    void loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function validateFile(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error("Only JPG, PNG, and WebP images are allowed.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Image must be 10MB or smaller.");
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("Image URL copied to clipboard.");
    window.setTimeout(() => setMessage(""), 2500);
  }

  async function uploadFile(file: File) {
    setError("");
    setMessage("");
    validateFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData
      });
      const data = (await response.json()) as UploadResponse;

      if (!response.ok || !data.success || !data.imageUrl) {
        throw new Error(data.error || "Image upload failed.");
      }

      setLastUploadedUrl(data.imageUrl);
      setLastAnnotation(data.annotationsFound ? data : null);
      setMessage(
        data.annotationsFound
          ? `Image uploaded. Annotations auto-detected: ${data.dominantCondition} (${data.annotationCount} annotations). Added as ${data.questionId} in Hidden status.`
          : "Image uploaded to Cloudinary. No annotations found in dataset CSVs."
      );
      await loadGallery();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudUpload className="h-5 w-5 text-primary" />
            Cloudinary image upload
          </CardTitle>
          <CardDescription>
            Admin-only upload area for dataset radiographs. Images with matching filenames in _annotations.csv will have their answer keys auto-detected.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              "flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background p-6 text-center transition",
              dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/60",
              uploading ? "pointer-events-none opacity-80" : ""
            )}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleInputChange}
            />
            {previewUrl ? (
              <div className="mb-4 max-h-52 w-full max-w-md overflow-hidden rounded-md border bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Selected radiograph preview" className="mx-auto max-h-52 w-full object-contain" />
              </div>
            ) : (
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ImageIcon className="h-7 w-7" />
              </div>
            )}
            <p className="font-medium">{uploading ? "Uploading image..." : "Drop a radiograph here or click to browse"}</p>
            <p className="mt-2 text-sm text-muted-foreground">JPG, PNG, or WebP. Maximum file size is 10MB.</p>
            {uploading ? (
              <div className="mt-5 h-2 w-full max-w-md overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
              </div>
            ) : null}
          </div>

          {message ? (
            <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </div>
          ) : null}

          {lastAnnotation && lastAnnotation.referenceFindings && (
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-2">
              <p className="text-sm font-medium text-primary">Auto-detected answer key</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">{lastAnnotation.dominantCondition}</Badge>
                <Badge variant="outline">{lastAnnotation.annotationCount} annotations</Badge>
                {lastAnnotation.questionId && (
                  <Badge variant="secondary">{lastAnnotation.questionId}</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {lastAnnotation.referenceFindings.map((f, i) => (
                  <p key={i}>
                    <span className="font-medium text-foreground">{f.condition}:</span>{" "}
                    teeth {f.toothIds.join(", ")}
                  </p>
                ))}
              </div>
              <p className="text-xs text-amber-400">Status: Hidden — set to Live in the dataset manager below to include in quiz.</p>
            </div>
          )}

          {error ? (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          ) : null}

          {lastUploadedUrl ? (
            <div className="flex flex-col gap-3 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="break-all font-mono text-xs text-muted-foreground">{lastUploadedUrl}</span>
              <Button type="button" variant="outline" size="sm" onClick={() => void copyUrl(lastUploadedUrl)}>
                <Clipboard className="h-4 w-4" />
                Copy URL
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-normal">Uploaded image gallery</h2>
            <p className="text-sm text-muted-foreground">Cloudinary-hosted dataset images saved in Firestore metadata.</p>
          </div>
          <Badge variant="outline">{images.length} images</Badge>
        </div>

        {galleryNotice ? (
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            {galleryNotice}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="flex h-48 items-center justify-center bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.imageUrl} alt={image.originalName || image.publicId} className="max-h-48 w-full object-contain" />
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{image.originalName || "Uploaded image"}</p>
                  <p className="text-sm text-muted-foreground">
                    {image.width && image.height ? `${image.width} x ${image.height} px` : "Resolution pending"} · {formatBytes(image.bytes)}
                  </p>
                </div>
                <p className="break-all font-mono text-xs text-muted-foreground">{image.imageUrl}</p>
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => void copyUrl(image.imageUrl)}>
                  <Clipboard className="h-4 w-4" />
                  Copy URL
                </Button>
              </CardContent>
            </Card>
          ))}
          {!images.length ? (
            <Card className="sm:col-span-2 xl:col-span-3">
              <CardContent className="flex min-h-32 items-center justify-center text-center text-sm text-muted-foreground">
                No Cloudinary images uploaded yet.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </div>
  );
}
