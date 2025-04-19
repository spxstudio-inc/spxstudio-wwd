import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateWebsite, WebsiteGenerationResult } from "@/lib/ai-service";
import { useAuth } from "@/hooks/use-auth";
import { PlanLimits } from "@shared/schema";

interface PromptInputProps {
  onGenerate: (result: WebsiteGenerationResult) => void;
}

export default function PromptInput({ onGenerate }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a description of the website you want to create");
      return;
    }

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to use the AI generator",
        variant: "destructive",
      });
      return;
    }

    // Check if user has reached their AI usage limit
    const planLimit = PlanLimits[user.plan as keyof typeof PlanLimits];
    if (user.aiCreditsUsed >= planLimit.aiUsage && user.plan !== "pro") {
      toast({
        title: "AI Usage Limit Reached",
        description: `You've reached your ${planLimit.aiUsage} AI generations limit for your ${user.plan} plan. Upgrade to continue.`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateWebsite({ prompt });
      onGenerate(result);
      toast({
        title: "Website generated",
        description: "Your website has been generated successfully",
      });
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate website");
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Failed to generate website",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Website AI Generator</h3>
        <p className="text-gray-500 mb-4">
          Describe the website you want to create in detail. Include information about the layout, 
          color scheme, content sections, and any specific features you need.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Create a professional photography portfolio with a dark theme, gallery section, and contact form..."
          className="mb-4 min-h-[100px]"
        />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {user ? (
              user.plan === "pro" ? (
                "Unlimited AI generation available"
              ) : (
                `${user.aiCreditsUsed}/${PlanLimits[user.plan as keyof typeof PlanLimits].aiUsage} generations used`
              )
            ) : (
              "Login to use AI generation"
            )}
          </p>
          <Button onClick={handleGenerate} disabled={isGenerating || !user}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Website'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
