import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebsiteGenerationResult } from "@/lib/ai-service";
import { CodeIcon, EyeIcon, FileTypeIcon } from "lucide-react";

interface WebsitePreviewProps {
  website: WebsiteGenerationResult;
}

export default function WebsitePreview({ website }: WebsitePreviewProps) {
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Generated Website</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="preview" className="flex items-center">
              <EyeIcon className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="html" className="flex items-center">
              <CodeIcon className="mr-2 h-4 w-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="css" className="flex items-center">
              <FileTypeIcon className="mr-2 h-4 w-4" />
              CSS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-0">
            <div className="rounded border overflow-hidden bg-white">
              <div className="aspect-[16/9] w-full">
                {website.preview ? (
                  <img 
                    src={website.preview} 
                    alt="Website preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe
                    title="Website Preview"
                    className="w-full h-full"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>${website.css}</style>
                        </head>
                        <body>
                          ${website.html}
                          <script>${website.js}</script>
                        </body>
                      </html>
                    `}
                    sandbox="allow-scripts"
                  />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="html" className="mt-0">
            <div className="rounded border overflow-hidden bg-gray-100 p-4">
              <pre className="language-html overflow-auto max-h-[400px] code-editor">
                <code>{website.html}</code>
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="css" className="mt-0">
            <div className="rounded border overflow-hidden bg-gray-100 p-4">
              <pre className="language-css overflow-auto max-h-[400px] code-editor">
                <code>{website.css}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
