import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FiGithub, FiUser, FiLock, FiMail, FiChevronLeft } from "react-icons/fi";
import { Link } from "wouter";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const extendedRegisterSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof extendedRegisterSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessingSocial, setIsProcessingSocial] = useState(false);

  // Get plan from URL params if any
  const [searchParams] = useLocation();
  const urlParams = new URLSearchParams(searchParams);
  const planFromUrl = urlParams.get("plan");
  const tabFromUrl = urlParams.get("tab");
  
  // Set active tab based on URL param if present
  useEffect(() => {
    if (tabFromUrl && (tabFromUrl === "login" || tabFromUrl === "register")) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      terms: false,
    },
  });

  function onLoginSubmit(values: z.infer<typeof loginUserSchema>) {
    loginMutation.mutate(values);
  }

  function onRegisterSubmit(values: RegisterFormValues) {
    const { confirmPassword, terms, ...registrationData } = values;
    
    // Add the plan from URL if present
    if (planFromUrl && ["basic", "pro"].includes(planFromUrl)) {
      registrationData.plan = planFromUrl;
    }
    
    registerMutation.mutate(registrationData);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Link href="/" className="self-start mb-8 flex items-center text-primary hover:underline">
          <FiChevronLeft className="mr-1" /> Back to Home
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Welcome to SPX STUDIO</CardTitle>
              <CardDescription>Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiUser className="absolute left-3 top-3 text-gray-500" />
                                <Input placeholder="username" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiLock className="absolute left-3 top-3 text-gray-500" />
                                <Input placeholder="••••••••" type="password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Remember me
                          </label>
                        </div>
                        <Button variant="link" className="p-0 h-auto">Forgot password?</Button>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={async () => {
                          try {
                            setIsProcessingSocial(true);
                            const result = await signInWithGithub();
                            const idToken = await result.user.getIdToken();
                            
                            // Send token to backend to create or authenticate user
                            const res = await fetch('/api/auth/firebase', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ idToken }),
                            });
                            
                            if (!res.ok) {
                              throw new Error('Failed to authenticate with server');
                            }
                            
                            // Trigger a refetch of the user data
                            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
                            
                            toast({
                              title: "Login successful",
                              description: "You have been logged in with GitHub",
                            });
                          } catch (error) {
                            toast({
                              title: "Authentication failed",
                              description: error instanceof Error ? error.message : "Unknown error occurred",
                              variant: "destructive",
                            });
                          } finally {
                            setIsProcessingSocial(false);
                          }
                        }}
                        disabled={isProcessingSocial || loginMutation.isPending}
                      >
                        <FiGithub className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={async () => {
                          try {
                            setIsProcessingSocial(true);
                            const result = await signInWithGoogle();
                            const idToken = await result.user.getIdToken();
                            
                            // Send token to backend to create or authenticate user
                            const res = await fetch('/api/auth/firebase', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ idToken }),
                            });
                            
                            if (!res.ok) {
                              throw new Error('Failed to authenticate with server');
                            }
                            
                            // Trigger a refetch of the user data
                            queryClient.invalidateQueries({ queryKey: ['/api/user'] });
                            
                            toast({
                              title: "Login successful",
                              description: "You have been logged in with Google",
                            });
                          } catch (error) {
                            toast({
                              title: "Authentication failed",
                              description: error instanceof Error ? error.message : "Unknown error occurred",
                              variant: "destructive",
                            });
                          } finally {
                            setIsProcessingSocial(false);
                          }
                        }}
                        disabled={isProcessingSocial || loginMutation.isPending}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Google
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="register">
                  {planFromUrl && (
                    <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <h3 className="text-lg font-medium mb-2">
                        {planFromUrl === "pro" ? "Pro Plan Selected" : "Basic Plan Selected"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You're signing up for the {planFromUrl === "pro" ? "Pro" : "Basic"} plan 
                        (${planFromUrl === "pro" ? "29" : "12"}/month). You can manage your subscription after registration.
                      </p>
                    </div>
                  )}
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiUser className="absolute left-3 top-3 text-gray-500" />
                                <Input placeholder="username" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiMail className="absolute left-3 top-3 text-gray-500" />
                                <Input placeholder="your@email.com" type="email" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiLock className="absolute left-3 top-3 text-gray-500" />
                                <Input placeholder="••••••••" type="password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <FiLock className="absolute left-3 top-3 text-gray-500" />
                                <Input placeholder="••••••••" type="password" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Sign Up"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="hidden md:flex flex-col justify-center bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Create Stunning Websites with SPX STUDIO</h2>
            <p className="mb-6">Join our platform and start building beautiful websites with AI assistance, professional tools, and generous storage.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-powered website generation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Professional code editor with live preview</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Canva design import capability</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Up to 4TB storage for PRO users</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
