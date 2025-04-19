import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import StorageStats from "@/components/storage/storage-stats";
import FileBrowser from "@/components/storage/file-browser";
import { StorageItem } from "@shared/schema";
import { uploadFile, createFolder, deleteStorageItem } from "@/lib/storage-service";
import { 
  FolderPlus, 
  Upload, 
  HardDrive, 
  AlertCircle,
  Loader2 
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function StoragePage() {
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState("/");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const {
    data: storageItems = [],
    isLoading: isLoadingFiles,
  } = useQuery<StorageItem[]>({
    queryKey: ["/api/storage/items", currentPath],
  });

  const {
    data: storageUsage = { used: 0, total: 0 },
  } = useQuery<{ used: number, total: number }>({
    queryKey: ["/api/storage/usage"],
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const path = currentPath === "/" ? `/${name}` : `${currentPath}/${name}`;
      return await createFolder(path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/storage/items", currentPath] });
      toast({
        title: "Folder created",
        description: `Folder "${newFolderName}" has been created successfully.`,
      });
      setNewFolderName("");
      setShowNewFolder(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create folder",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      // Simulate progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress > 95) {
            clearInterval(interval);
            progress = 95;
          }
          setUploadProgress(Math.min(95, progress));
        }, 300);
        
        return uploadFile(file, currentPath).then(result => {
          clearInterval(interval);
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 1000);
          return result;
        });
      };
      
      return simulateProgress();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/storage/items", currentPath] });
      queryClient.invalidateQueries({ queryKey: ["/api/storage/usage"] });
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      return await deleteStorageItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/storage/items", currentPath] });
      queryClient.invalidateQueries({ queryKey: ["/api/storage/usage"] });
      toast({
        title: "Item deleted",
        description: "The item has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    uploadFileMutation.mutate(file);
  };

  const handleCreateFolder = () => {
    if (!newFolderName) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the folder",
        variant: "destructive",
      });
      return;
    }
    
    createFolderMutation.mutate(newFolderName);
  };

  const handleDeleteItem = (item: StorageItem) => {
    deleteItemMutation.mutate(item.id);
  };

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      
      <div className="flex-1 p-6 lg:p-10 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Storage</h1>
          <p className="text-gray-500">Manage your files and storage space</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>Manage your files and folders</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNewFolder(!showNewFolder)}
                  >
                    <FolderPlus className="h-4 w-4 mr-1" />
                    New Folder
                  </Button>
                  <Button variant="outline" size="sm" className="relative">
                    <Input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleFileUpload}
                    />
                    <Upload className="h-4 w-4 mr-1" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNewFolder && (
                  <div className="mb-4 flex items-center space-x-2">
                    <Input 
                      placeholder="Folder Name" 
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <Button 
                      onClick={handleCreateFolder}
                      disabled={createFolderMutation.isPending}
                    >
                      {createFolderMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Create"
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowNewFolder(false);
                        setNewFolderName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                
                {uploadProgress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <FileBrowser 
                  items={storageItems}
                  currentPath={currentPath}
                  isLoading={isLoadingFiles}
                  onNavigate={navigateToFolder}
                  onDelete={handleDeleteItem}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <StorageStats usage={storageUsage} />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Storage Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <span>Optimize images before uploading to save space</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <span>Regularly remove unused files to free up storage</span>
                  </li>
                  <li className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5 mr-2" />
                    <span>Use compressed formats like WebP for images</span>
                  </li>
                </ul>
                
                <Separator className="my-4" />
                
                <Button className="w-full">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Upgrade Storage
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
