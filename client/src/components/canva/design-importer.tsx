import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, FileUpIcon, Loader2 } from "lucide-react";
import { analyzeCanvaDesign, WebsiteGenerationResult } from "@/lib/ai-service";

interface DesignImporterProps {
  onImport: (result: WebsiteGenerationResult) => void;
}

export default function CanvaDesignImporter({ onImport }: DesignImporterProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    const file = e.target.files[0];
    if (!file.type.includes("image/")) {
      setError("Please select an image file (PNG, JPG, etc.)");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Please select a Canva design image to import");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      // Convert image to base64
      const reader = new FileReader();
      
      const imageDataPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1]; // Remove data:image/jpeg;base64, part
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(selectedFile);
      });

      const imageData = await imageDataPromise;
      const result = await analyzeCanvaDesign(imageData);
      
      onImport(result);
      toast({
        title: "Design imported",
        description: "Your Canva design has been successfully imported",
      });
    } catch (err) {
      console.error("Import error:", err);
      setError(err instanceof Error ? err.message : "Failed to import design");
      toast({
        title: "Import failed",
        description: err instanceof Error ? err.message : "Failed to import design",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Import from Canva</h3>
        <p className="text-gray-500 mb-4">
          Upload your Canva design export (PNG or JPG) and we'll convert it into a responsive website.
          For best results, export your design at full quality.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="border-dashed border-2 border-gray-300 rounded-md p-6 mb-4 text-center">
          <FileUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-500 mb-2">
            {selectedFile ? selectedFile.name : "Drag & drop your Canva design export here"}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            {selectedFile 
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` 
              : "PNG, JPG up to 10MB"}
          </p>
          <Input
            type="file"
            id="canva-design"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button 
            variant="outline" 
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleImport} 
            disabled={isImporting || !selectedFile}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              'Import Design'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
