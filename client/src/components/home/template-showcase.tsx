import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "wouter";

const templates = [
  {
    id: 1,
    name: "Creative Portfolio",
    description: "Perfect for photographers, designers, and artists",
    imagePlaceholder: "Portfolio template"
  },
  {
    id: 2,
    name: "Business Professional",
    description: "Clean and modern template for businesses",
    imagePlaceholder: "Business template"
  },
  {
    id: 3,
    name: "E-Commerce Shop",
    description: "Complete solution for online stores",
    imagePlaceholder: "E-commerce template"
  },
  {
    id: 4,
    name: "Modern Blog",
    description: "Elegant design for writers and journalists",
    imagePlaceholder: "Blog template"
  },
  {
    id: 5,
    name: "Startup Landing",
    description: "Conversion-focused design for new ventures",
    imagePlaceholder: "Startup template"
  },
  {
    id: 6,
    name: "Restaurant & Food",
    description: "Showcase menus and food photography",
    imagePlaceholder: "Restaurant template"
  }
];

export default function TemplateShowcase() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Start with Professional Templates</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Choose from hundreds of professionally designed templates or let our AI create a custom one for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  {template.imagePlaceholder}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                <Button variant="link" className="p-0 h-auto text-primary text-sm font-medium">
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="link" className="text-primary font-medium">
            <Link href="/auth">
              View all templates <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
