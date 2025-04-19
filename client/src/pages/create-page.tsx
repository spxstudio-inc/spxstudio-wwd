import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import PromptInput from "@/components/ai/prompt-input";
import WebsitePreview from "@/components/ai/website-preview";
import CanvaDesignImporter from "@/components/canva/design-importer";
import { WebsiteGenerationResult } from "@/lib/ai-service";
import { PlusIcon, Loader2 } from "lucide-react";

export default function CreatePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [generatedWebsite, setGeneratedWebsite] = useState<WebsiteGenerationResult | null>(null);

  const createWebsiteMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      htmlContent?: string;
      cssContent?: string;
      jsContent?: string;
    }) => {
      const res = await apiRequest("POST", "/api/websites", data);
      return await res.json();
    },
    onSuccess: (website) => {
      queryClient.invalidateQueries({ queryKey: ["/api/websites"] });
      toast({
        title: "Website created!",
        description: "Your new website has been created successfully.",
      });
      navigate(`/editor/${website.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create website",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateWebsite = () => {
    if (!name) {
      toast({
        title: "Name required",
        description: "Please enter a name for your website",
        variant: "destructive",
      });
      return;
    }

    createWebsiteMutation.mutate({
      name,
      description,
      htmlContent: generatedWebsite?.html,
      cssContent: generatedWebsite?.css,
      jsContent: generatedWebsite?.js,
    });
  };

  const handleAIGeneration = (result: WebsiteGenerationResult) => {
    setGeneratedWebsite(result);
  };

  const handleCanvaImport = (result: WebsiteGenerationResult) => {
    setGeneratedWebsite(result);
  };

  // Check for active tab in URL
  const searchParams = new URLSearchParams(window.location.search);
  const tabFromUrl = searchParams.get("tab");
  const [activeTabContent, setActiveTabContent] = useState(tabFromUrl === "canva" ? "canva" : "ai");

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      
      <div className="flex-1 p-6 lg:p-10 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Create New Website</h1>
          <p className="text-gray-500">Start a new website project using templates, AI, or code from scratch</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Website Details</CardTitle>
              <CardDescription>Enter the basic information for your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Website Name</Label>
                  <Input 
                    id="name" 
                    placeholder="My Awesome Website" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    placeholder="A brief description of your website" 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Create Website</CardTitle>
              <CardDescription>Complete the setup and create your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-amber-50 p-4">
                  <div className="flex">
                    <div className="text-amber-800">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-amber-800">
                        {generatedWebsite
                          ? "Your website content is ready! Click create to continue editing."
                          : "Use one of the methods below to generate content for your website."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  onClick={handleCreateWebsite}
                  disabled={createWebsiteMutation.isPending}
                >
                  {createWebsiteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Website
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Website Content</CardTitle>
            <CardDescription>Choose how to create your website content</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTabContent} onValueChange={setActiveTabContent}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="ai">AI Generator</TabsTrigger>
                <TabsTrigger value="canva">Canva Import</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai">
                <div className="space-y-6">
                  <PromptInput onGenerate={handleAIGeneration} />
                  {generatedWebsite && <WebsitePreview website={generatedWebsite} />}
                </div>
              </TabsContent>
              
              <TabsContent value="canva">
                <CanvaDesignImporter onImport={handleCanvaImport} />
                {generatedWebsite && <WebsitePreview website={generatedWebsite} />}
              </TabsContent>
              
              <TabsContent value="templates">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: 1,
                      name: "Portfolio",
                      description: "Perfect for showcasing your work",
                      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      id: 2,
                      name: "Business",
                      description: "Professional business website",
                      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      id: 3,
                      name: "E-Commerce",
                      description: "Online store template",
                      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      id: 4,
                      name: "Blog",
                      description: "Content-focused blog design",
                      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      id: 5,
                      name: "Landing Page",
                      description: "High-conversion landing page",
                      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    },
                    {
                      id: 6,
                      name: "Restaurant",
                      description: "Food and restaurant template",
                      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    }
                  ].map(template => (
                    <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-36 bg-gray-200 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                          Template Preview
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
