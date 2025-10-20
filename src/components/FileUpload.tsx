import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Image as ImageIcon, Video, File, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { uploadFile, validateFile, formatFileSize } from "@/lib/fileUpload";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

const FileUpload = ({ 
  onUpload, 
  accept = "image/*,video/*", 
  maxSize = 10, 
  className = "",
  disabled = false 
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    // Validate file
    const validationError = validateFile(file, { maxSize, allowedTypes: accept.split(',').map(t => t.trim()) });
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file using the utility
      const result = await uploadFile(file, { maxSize, allowedTypes: accept.split(',').map(t => t.trim()) });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setUploadedUrl(result.url);
      onUpload(result.url);
      
      toast.success(`File uploaded successfully! (${formatFileSize(result.size)})`);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : "Failed to upload file. Please try again.");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };


  const handleRemove = () => {
    setUploadedUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Upload File</Label>
      
      {!uploadedUrl ? (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            isDragging 
              ? 'border-nail-purple bg-nail-purple/5' 
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <CardContent className="p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {accept.includes('image') && accept.includes('video') 
                ? 'Images and videos up to 10MB'
                : accept.includes('image')
                ? 'Images up to 10MB'
                : 'Videos up to 10MB'
              }
            </p>
            <Button 
              type="button" 
              variant="outline" 
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose File
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Check className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-900">File uploaded successfully</p>
                    <p className="text-sm text-green-700">Click to preview</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Media Preview */}
              <div className="mt-3 border rounded-lg overflow-hidden bg-white">
                {uploadedUrl.match(/\.(mp4|webm|ogg|avi|mov)$/i) ? (
                  <div className="relative">
                    <video 
                      src={uploadedUrl} 
                      className="w-full h-48 object-cover"
                      controls
                      preload="metadata"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      <Video className="inline w-3 h-3 mr-1" />
                      Video
                    </div>
                  </div>
                ) : uploadedUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <div className="relative">
                    <img 
                      src={uploadedUrl} 
                      alt="Uploaded file preview" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      <ImageIcon className="inline w-3 h-3 mr-1" />
                      Image
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <File className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">File uploaded</p>
                    <p className="text-xs text-gray-500 truncate">{uploadedUrl}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default FileUpload;
