import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import DashboardSidebar from "@/components/layout/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon, CodeIcon, FolderIcon, RocketIcon, HardDriveIcon } from "lucide-react";
import { Link } from "wouter";
import { Website } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("recent");

  const { data: websites = [] } = useQuery<Website[]>({
    queryKey: ["/api/websites"],
  });

  // Get recent websites - last 3
  const recentWebsites = [...websites].sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  }).slice(0, 3);

  // Get published websites
  const publishedWebsites = websites.filter(website => website.isPublished);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      
      <div className="flex-1 p-6 lg:p-10 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.firstName || user?.username}</h1>
          <p className="text-gray-500">Manage your websites, storage, and settings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Websites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{websites.length}</div>
              <p className="text-sm text-gray-500 mt-1">Total created websites</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {Math.round((user?.storageUsed || 0) / (1024 * 1024 * 1024))} GB
              </div>
              <p className="text-sm text-gray-500 mt-1">
                of {user?.plan === 'pro' ? '4 TB' : user?.plan === 'basic' ? '100 GB' : '15 GB'} used
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold capitalize">{user?.plan || "Free"}</div>
              <p className="text-sm text-gray-500 mt-1 mb-2">
                {user?.plan === 'pro' ? 'Unlimited AI generation' : 
                 user?.plan === 'basic' ? 'Standard AI generation' : 
                 'Limited AI generation'}
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/subscription">
                  {user?.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Websites</CardTitle>
              <CardDescription>Manage and edit your websites</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent">
                  {recentWebsites.length > 0 ? (
                    <div className="space-y-4">
                      {recentWebsites.map((website) => (
                        <div key={website.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{website.name}</h3>
                            <p className="text-sm text-gray-500">
                              Last edited {formatDistanceToNow(new Date(website.lastModified))} ago
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/editor/${website.id}`}>
                                <CodeIcon className="h-4 w-4 mr-1" /> Edit
                              </Link>
                            </Button>
                            {website.isPublished ? (
                              <Button variant="outline" size="sm">
                                <RocketIcon className="h-4 w-4 mr-1" /> View Live
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <RocketIcon className="h-4 w-4 mr-1" /> Publish
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">You haven't created any websites yet</p>
                      <Button asChild>
                        <Link href="/create">
                          <PlusIcon className="h-4 w-4 mr-2" /> Create Website
                        </Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="published">
                  {publishedWebsites.length > 0 ? (
                    <div className="space-y-4">
                      {publishedWebsites.map((website) => (
                        <div key={website.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{website.name}</h3>
                            <p className="text-sm text-gray-500">
                              {website.domain || `spxstudio.com/${website.id}`}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/editor/${website.id}`}>
                                <CodeIcon className="h-4 w-4 mr-1" /> Edit
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <RocketIcon className="h-4 w-4 mr-1" /> View Live
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">You don't have any published websites</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  {websites.length > 0 ? (
                    <div className="space-y-4">
                      {websites.map((website) => (
                        <div key={website.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{website.name}</h3>
                            <p className="text-sm text-gray-500">
                              Last edited {formatDistanceToNow(new Date(website.lastModified))} ago
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/editor/${website.id}`}>
                                <CodeIcon className="h-4 w-4 mr-1" /> Edit
                              </Link>
                            </Button>
                            {website.isPublished ? (
                              <Button variant="outline" size="sm">
                                <RocketIcon className="h-4 w-4 mr-1" /> View Live
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <RocketIcon className="h-4 w-4 mr-1" /> Publish
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">You haven't created any websites yet</p>
                      <Button asChild>
                        <Link href="/create">
                          <PlusIcon className="h-4 w-4 mr-2" /> Create Website
                        </Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/create">
                    <PlusIcon className="h-4 w-4 mr-2" /> Create New Website
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/storage">
                    <FolderIcon className="h-4 w-4 mr-2" /> Manage Files
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/subscription">
                    <HardDriveIcon className="h-4 w-4 mr-2" /> {user?.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Create Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Create & Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <CardContent className="p-6">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center justify-center">
                  <CodeIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">Code Editor</h3>
                <p className="text-gray-600 mb-4">Create custom websites with our professional code editor</p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/editor">
                    Go to Code Editor
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
              <CardContent className="p-6">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center justify-center">
                  <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">AI Generator</h3>
                <p className="text-gray-600 mb-4">Use AI to generate professional websites from text prompts</p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/create">
                    Create with AI
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
              <CardContent className="p-6">
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Canva Import</h3>
                <p className="text-gray-600 mb-4">Convert your Canva designs into responsive websites</p>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/create?tab=canva">
                    Import from Canva
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
