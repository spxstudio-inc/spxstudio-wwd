import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary to-secondary py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Create, Design & Launch Websites with Ease</h1>
            <p className="text-lg mb-8">SPX STUDIO gives you everything you need to build and launch stunning websites with AI assistance, custom domains, and professional tools.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="default" className="bg-white text-primary hover:bg-gray-100">
                <Link href="/auth">Start Creating - It's Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block rounded-lg shadow-2xl overflow-hidden">
            <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
              <div className="p-8 text-gray-400 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <p className="text-sm">Website building concept image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
