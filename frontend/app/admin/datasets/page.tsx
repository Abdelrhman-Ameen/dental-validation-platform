import { DatasetManager } from "@/components/admin/dataset-manager";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminDatasetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Dataset management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Validation image bank</h1>
        <p className="mt-2 text-muted-foreground">
          Manage validation cases: toggle Live/Hidden status, delete cases, upload new images with auto-detected annotations.
        </p>
      </div>
      <ImageUpload />
      <DatasetManager />
    </div>
  );
}
