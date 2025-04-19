import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import PreviewSection from "@/components/home/preview-section";
import PricingSection from "@/components/home/pricing-section";
import TemplateShowcase from "@/components/home/template-showcase";
import CTASection from "@/components/home/cta-section";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <PreviewSection />
        <PricingSection />
        <TemplateShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
