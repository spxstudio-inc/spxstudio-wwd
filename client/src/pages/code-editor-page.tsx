import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import Editor from "@/components/code-editor/editor";
import LivePreview from "@/components/code-editor/live-preview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Website } from "@shared/schema";
import { 
  Save, 
  PlayIcon,
  Code2, 
  Palette, 
  File,
  ExternalLink,
  ChevronLeft,
  Loader2
} from "lucide-react";

export default function CodeEditorPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const [activeTab, setActiveTab] = useState("html");
  const [websiteName, setWebsiteName] = useState("");
  const [previewKey, setPreviewKey] = useState(Date.now());

  const { data: website, isLoading } = useQuery<Website>({
    queryKey: [`/api/websites/${id}`],
    enabled: !!id,
    onSuccess: (data) => {
      setHtml(data.htmlContent || "");
      setCss(data.cssContent || "");
      setJs(data.jsContent || "");
      setWebsiteName(data.name);
    },
  });

  const saveWebsiteMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      htmlContent: string;
      cssContent: string;
      jsContent: string;
    }) => {
      const res = await apiRequest("PUT", `/api/websites/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/websites/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Changes saved",
        description: "Your website has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save changes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveWebsiteMutation.mutate({
      name: websiteName,
      htmlContent: html,
      cssContent: css,
      jsContent: js,
    });
  };

  const updatePreview = () => {
    setPreviewKey(Date.now()); // Force re-render of preview
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!id && !website) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">No Website Selected</h2>
          <p className="text-gray-500 mb-6">Please select a website to edit or create a new one</p>
          <Button onClick={() => navigate("/create")}>Create New Website</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center">
            <Input 
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="text-lg font-medium border-none focus-visible:ring-0 w-auto"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={updatePreview}
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveWebsiteMutation.isPending}
          >
            {saveWebsiteMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <DashboardSidebar minimal />
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-full">
          <div className="border-r flex flex-col h-full">
            <div className="border-b p-2 bg-gray-50">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="html" className="flex items-center">
                    <Code2 className="h-4 w-4 mr-2" />
                    HTML
                  </TabsTrigger>
                  <TabsTrigger value="css" className="flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="js" className="flex items-center">
                    <File className="h-4 w-4 mr-2" />
                    JavaScript
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1 overflow-auto">
              {activeTab === "html" && (
                <Editor
                  language="html"
                  value={html}
                  onChange={setHtml}
                />
              )}
              
              {activeTab === "css" && (
                <Editor
                  language="css"
                  value={css}
                  onChange={setCss}
                />
              )}
              
              {activeTab === "js" && (
                <Editor
                  language="javascript"
                  value={js}
                  onChange={setJs}
                />
              )}
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="border-b p-2 flex items-center justify-between bg-gray-50">
              <h3 className="font-medium">Preview</h3>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
            <div className="flex-1 bg-white overflow-auto">
              <LivePreview
                key={previewKey}
                html={html}
                css={css}
                js={js}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
