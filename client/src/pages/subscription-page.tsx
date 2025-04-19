import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started and building simple personal websites.",
    features: [
      { name: "15GB storage", included: true },
      { name: "Limited AI website generation", included: true },
      { name: "Basic code editor", included: true },
      { name: "SPX subdomain (yoursite.spxstudio.com)", included: true },
      { name: "Custom domains", included: false },
    ],
    highlighted: false,
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
  },
  {
    name: "Basic",
    price: 12,
    description: "For professionals who need more features and storage capacity.",
    features: [
      { name: "100GB storage", included: true },
      { name: "Standard AI website generation", included: true },
      { name: "Advanced code editor", included: true },
      { name: "1 custom domain included", included: true },
      { name: "GitHub integration", included: true },
    ],
    highlighted: false,
    planId: "basic",
    buttonText: "Choose Basic",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: 29,
    description: "Complete solution for agencies and serious website creators.",
    features: [
      { name: "4TB storage", included: true },
      { name: "Unlimited AI website generation", included: true },
      { name: "Professional code editor with all extensions", included: true },
      { name: "2 custom domains included", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
    ],
    highlighted: true,
    planId: "pro",
    buttonText: "Choose Pro",
    buttonVariant: "default" as const,
  }
];

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [cancellingPlan, setCancellingPlan] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const userPlan = user?.plan || "free";
  const hasActiveSubscription = !!user?.stripeSubscriptionId;
  
  // Handle URL params when returning from successful payment
  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");
    
    if (sessionId) {
      const processPayment = async () => {
        try {
          await apiRequest("POST", "/api/subscription/success", { sessionId });
          toast({ 
            title: "Subscription activated!",
            description: "Your account has been upgraded successfully."
          });
          
          // Remove the session_id from URL
          navigate("/subscription", { replace: true });
        } catch (error) {
          toast({ 
            title: "Subscription error",
            description: "There was an error processing your subscription. Please contact support.",
            variant: "destructive"
          });
        }
      };
      
      processPayment();
    }
  }, [toast, navigate]);
  
  const handleSelectPlan = async (planId: string) => {
    if (planId === userPlan) {
      toast({
        title: "Already subscribed",
        description: `You are already on the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`
      });
      return;
    }
    
    if (planId === "free" && hasActiveSubscription) {
      setCancellingPlan(true);
      try {
        await apiRequest("POST", "/api/subscription/cancel");
        toast({
          title: "Subscription cancelled",
          description: "Your subscription will remain active until the end of the billing period."
        });
      } catch (error) {
        toast({
          title: "Error cancelling subscription",
          description: "There was an error cancelling your subscription. Please try again.",
          variant: "destructive"
        });
      } finally {
        setCancellingPlan(false);
      }
      return;
    }
    
    try {
      setIsLoading(planId);
      const response = await apiRequest("POST", "/api/create-checkout-session", { plan: planId });
      const data = await response.json();
      
      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "There was an error creating your checkout session. Please try again.",
        variant: "destructive"
      });
      setIsLoading(null);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Choose the plan that fits your needs, from free personal websites to professional solutions with advanced features.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => {
          // Adjust button state based on current plan
          const isPlanActive = userPlan === (plan.planId || "free");
          const buttonText = isPlanActive 
            ? "Current Plan" 
            : (plan.planId === "free" && hasActiveSubscription) 
              ? "Cancel Subscription" 
              : plan.buttonText;
          
          const isButtonDisabled = isLoading !== null || cancellingPlan;
          
          return (
            <Card 
              key={plan.name}
              className={`bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                plan.highlighted 
                  ? "border-primary bg-primary/5 relative" 
                  : "border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <CardContent className={`p-6 ${plan.highlighted ? "pt-5" : ""}`}>
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-500">/month</span>}
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <XIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "" : "text-gray-400"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handleSelectPlan(plan.planId || "free")}
                  className="w-full" 
                  variant={plan.highlighted && !isPlanActive ? "default" : "outline"}
                  disabled={isButtonDisabled || isPlanActive}
                >
                  {isLoading === (plan.planId || "free") ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : cancellingPlan && plan.planId === "free" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}