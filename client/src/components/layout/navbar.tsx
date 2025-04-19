import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Menu, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link href="/" className="flex items-center">
            <span className="text-primary text-2xl font-bold">SPX STUDIO</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/#features" className="text-gray-700 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary transition-colors">
              Pricing
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary transition-colors">
                  Solutions <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="#" className="w-full">For Businesses</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">For Individuals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="#" className="w-full">For Agencies</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging Out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth?tab=login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth?tab=register">Sign Up</Link>
              </Button>
            </>
          )}
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>SPX STUDIO</SheetTitle>
                <SheetDescription>Website creation platform</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/" 
                      className="block py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/#features" 
                      className="block py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/pricing" 
                      className="block py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <p className="block py-2">Solutions</p>
                    <ul className="pl-4 space-y-2">
                      <li>
                        <Link 
                          href="#" 
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          For Businesses
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="#" 
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          For Individuals
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="#" 
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          For Agencies
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {user ? (
                    <>
                      <li>
                        <Link 
                          href="/dashboard" 
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button 
                          onClick={() => {
                            logoutMutation.mutate();
                            setMobileMenuOpen(false);
                          }}
                          className="block py-2 hover:text-primary transition-colors"
                          disabled={logoutMutation.isPending}
                        >
                          {logoutMutation.isPending ? "Logging Out..." : "Logout"}
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link 
                          href="/auth?tab=login" 
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/auth?tab=register" 
                          className="block py-2 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
