import { Card, CardContent } from "@/components/ui/card";
import { WandSparkles, CodeIcon, PaletteIcon, GlobeIcon, DatabaseIcon, GithubIcon } from "lucide-react";

const features = [
  {
    icon: <WandSparkles className="h-6 w-6" />,
    iconBg: "bg-primary/10 text-primary",
    title: "AI Website Generator",
    description: "Describe your website in plain language and let our AI create it for you. Fine-tune and customize as needed."
  },
  {
    icon: <CodeIcon className="h-6 w-6" />,
    iconBg: "bg-secondary/10 text-secondary",
    title: "Professional Code Editor",
    description: "Built-in VS Code-inspired editor with syntax highlighting, live preview, and integrated development tools."
  },
  {
    icon: <PaletteIcon className="h-6 w-6" />,
    iconBg: "bg-accent/10 text-accent",
    title: "Canva Design Import",
    description: "Import your Canva designs directly and convert them into responsive websites with our intelligent technology."
  },
  {
    icon: <GlobeIcon className="h-6 w-6" />,
    iconBg: "bg-green-500/10 text-green-500",
    title: "Custom Domains",
    description: "Connect your own domain or get free domains with our premium plans. Easy setup with guided DNS configuration."
  },
  {
    icon: <DatabaseIcon className="h-6 w-6" />,
    iconBg: "bg-yellow-500/10 text-yellow-500",
    title: "Generous Storage",
    description: "From 15GB for free accounts to 4TB for professional users. Store all your assets, backups, and more."
  },
  {
    icon: <GithubIcon className="h-6 w-6" />,
    iconBg: "bg-primary/10 text-primary",
    title: "GitHub Integration",
    description: "Connect your GitHub repositories for version control, collaboration, and continuous deployment."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Create Amazing Websites</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">From AI-powered website generation to professional code editing, SPX STUDIO provides all the tools you need in one place.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-50 hover:shadow-lg transition-shadow border-0">
              <CardContent className="pt-6">
                <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <a href="#" className="text-primary font-medium flex items-center">
                  Learn more 
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 ml-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
