
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image } from "lucide-react";

interface PropertyPhotosProps {
  data: any;
  onUpdate: (data: any) => void;
}

const PropertyPhotos = ({ data, onUpdate }: PropertyPhotosProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const currentPhotos = data.photos || [];
    const newPhotos = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    onUpdate({ photos: [...currentPhotos, ...newPhotos] });
  };

  const removePhoto = (index: number) => {
    const currentPhotos = data.photos || [];
    const updatedPhotos = currentPhotos.filter((_: any, i: number) => i !== index);
    onUpdate({ photos: updatedPhotos });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Upload Property Photos</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add at least 5 high-quality photos of your property. The first photo will be the main image.
        </p>
      </div>

      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Drop photos here or click to upload</p>
          <p className="text-sm text-muted-foreground mb-4">PNG, JPG up to 10MB each</p>
          <Button
            variant="outline"
            onClick={() => document.getElementById('photo-input')?.click()}
          >
            Choose Files
          </Button>
          <input
            id="photo-input"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* Photo Preview Grid */}
      {data.photos && data.photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.photos.map((photo: any, index: number) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="aspect-square relative">
                  <img
                    src={photo.preview}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main Photo
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(!data.photos || data.photos.length === 0) && (
        <Card className="border border-muted">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No photos uploaded yet</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyPhotos;
