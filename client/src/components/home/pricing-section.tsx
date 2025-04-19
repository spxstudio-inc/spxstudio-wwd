import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";

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
    buttonText: "Get Started",
    buttonLink: "/auth?tab=register",
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
    buttonText: "Choose Basic",
    buttonLink: "/auth?tab=register&plan=basic",
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
    buttonText: "Choose Pro",
    buttonLink: "/auth?tab=register&plan=pro",
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Select the plan that fits your needs, from free personal websites to professional solutions with advanced features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
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
              <CardContent className={plan.highlighted ? "p-6 pt-5" : "p-6"}>
                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
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
                  asChild
                  className="w-full" 
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href={plan.buttonLink}>{plan.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
