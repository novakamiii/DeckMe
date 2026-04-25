import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Upload, FileJson } from "lucide-react";
import { toast } from "sonner";
import { saveSubject, generateSubjectId, validateSubjectData } from "../lib/subjectStorage";
import { useNavigate } from "react-router";

interface JsonUploaderProps {
  onUploadSuccess?: () => void;
}

export function JsonUploader({ onUploadSuccess }: JsonUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    setIsUploading(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!validateSubjectData(data)) {
        toast.error('Invalid JSON format. Please check the structure matches the required format.');
        setIsUploading(false);
        return;
      }

      const subjectId = generateSubjectId(data._meta.title);
      saveSubject(subjectId, data);

      toast.success(`Successfully uploaded "${data._meta.title}"!`);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please check the JSON format.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        variant="outline"
        className="w-full"
      >
        {isUploading ? (
          <>
            <FileJson className="size-4 mr-2 animate-pulse" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="size-4 mr-2" />
            Upload JSON File
          </>
        )}
      </Button>
    </div>
  );
}
