import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  File,
  Folder,
  MoreVertical,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { StorageItem } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/lib/utils";

interface FileBrowserProps {
  items: StorageItem[];
  currentPath: string;
  isLoading: boolean;
  onNavigate: (path: string) => void;
  onDelete: (item: StorageItem) => void;
}

export default function FileBrowser({
  items,
  currentPath,
  isLoading,
  onNavigate,
  onDelete,
}: FileBrowserProps) {
  const [itemBeingDeleted, setItemBeingDeleted] = useState<number | null>(null);

  const parentPath = () => {
    if (currentPath === "/") return null;
    const parts = currentPath.split("/");
    parts.pop();
    return parts.length ? parts.join("/") : "/";
  };

  const handleNavigate = (path: string, type: string) => {
    if (type === "folder") {
      onNavigate(path);
    }
  };

  const handleDelete = (item: StorageItem) => {
    setItemBeingDeleted(item.id);
    onDelete(item);
    // The state will be cleared when the items list updates after deletion
  };

  const renderPathBreadcrumb = () => {
    const parts = currentPath.split("/").filter(Boolean);
    
    return (
      <div className="flex items-center mb-4 overflow-x-auto pb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="min-w-fit"
          onClick={() => onNavigate("/")}
          disabled={currentPath === "/"}
        >
          <Folder className="h-4 w-4 mr-1" /> Root
        </Button>
        
        {parts.map((part, index) => {
          const path = `/${parts.slice(0, index + 1).join("/")}`;
          return (
            <div key={path} className="flex items-center">
              <ChevronLeft className="h-4 w-4 rotate-180 text-gray-400" />
              <Button 
                variant="ghost" 
                size="sm"
                className="min-w-fit"
                onClick={() => onNavigate(path)}
              >
                {part}
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading files...</p>
      </div>
    );
  }

  return (
    <div>
      {renderPathBreadcrumb()}
      
      {parentPath() !== null && (
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => onNavigate(parentPath() || "/")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to parent folder
        </Button>
      )}

      {items.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleNavigate(item.path, item.type)}
                  >
                    {item.type === "folder" ? (
                      <Folder className="h-4 w-4 mr-2 text-blue-500" />
                    ) : (
                      <File className="h-4 w-4 mr-2 text-gray-500" />
                    )}
                    <span className={item.type === "folder" ? "text-blue-500 hover:underline" : ""}>
                      {item.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.type === "folder" ? "—" : formatFileSize(item.size)}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(item.lastModified), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {itemBeingDeleted === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(item)}
                        disabled={itemBeingDeleted === item.id}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-gray-50">
          <AlertCircle className="h-8 w-8 text-gray-400 mb-4" />
          <h3 className="font-medium text-gray-700 mb-1">No files found</h3>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            This folder is empty. Upload files or create a new folder to get started.
          </p>
        </div>
      )}
    </div>
  );
}
