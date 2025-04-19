import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-secondary to-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Website?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are building stunning websites with SPX STUDIO today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            asChild 
            size="lg"
            variant="default" 
            className="bg-white text-primary hover:bg-gray-100 transition-colors"
          >
            <Link href="/auth?tab=register">Get Started for Free</Link>
          </Button>
          <Button 
            asChild 
            size="lg"
            variant="outline" 
            className="border-white text-white hover:bg-white/10 transition-colors"
          >
            <Link href="#contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
