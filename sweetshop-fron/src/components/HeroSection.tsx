import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import fallback from "/sweet-hero.jpg";

export default function HeroSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState<string>("/sweet-hero.jpg");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = imageRef.current;
    const handleScroll = () => {
      if (!el) return;
      if (window.scrollY > 100) el.classList.add("scrolled");
      else el.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => {
      console.warn("Hero image failed to load, falling back");
      setImgSrc(fallback);
      setIsLoaded(true);
    };
  }, [imgSrc]);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with blur effect until loaded */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${imgSrc})`,
          filter: isLoaded ? "none" : "blur(20px)",
          transform: isLoaded ? "scale(1)" : "scale(1.1)",
          opacity: isLoaded ? 1 : 0.8,
        }}
      />
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60 dark:from-black/80 dark:via-black/60 dark:to-black/70" />
      
      {/* Additional radial gradient for center focus */}
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)" />

      <div className="container relative z-10 px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Content with fade-in animation */}
          <div 
            className={`text-center space-y-8 transition-all duration-1000 transform ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Badge/Tag */}
            <div className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
              <span className="text-primary font-semibold text-sm tracking-wide">
                Since 1995 • Family Recipe
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
              <span className="block text-white drop-shadow-2xl">
                Freshly Made
              </span>
              <span className="block mt-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 bg-clip-text text-transparent animate-gradient">
                Indian Sweets
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-white/90 font-light leading-relaxed drop-shadow-lg">
              Handcrafted <span className="font-semibold text-amber-200">mithai</span> made with pure ghee, 
              premium dry fruits, and time-tested family recipes — rich, indulgent, 
              and made fresh daily.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
              <Button 
                size="lg" 
                className="px-12 py-6 rounded-full text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
              >
                Explore Sweets
                <svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>

              <Button 
                size="lg" 
                variant="outline" 
                className="px-12 py-6 rounded-full text-lg font-semibold border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 text-white shadow-lg hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <svg 
                  className="mr-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Visit Store
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { label: "100% Pure Ghee", icon: "🥘" },
                { label: "Daily Fresh", icon: "🌿" },
                { label: "Family Recipe", icon: "👨‍👩‍👧‍👦" },
                { label: "Premium Quality", icon: "⭐" },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <span className="text-sm font-medium text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image with parallax effect */}
          <div 
            ref={imageRef} 
            className={`mt-20 md:mt-28 relative z-20 transform transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
            }`}
          >
            <div className="relative max-w-5xl mx-auto">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-xl" />
              
              {/* Image container */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/30 border-4 border-white/10">
                <img 
                  src={imgSrc} 
                  alt="Assortment of traditional Indian sweets and mithai arranged beautifully"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                  onError={() => {
                    console.warn("Hero image failed to load, falling back");
                    setImgSrc(fallback);
                  }}
                />
                
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-500/20 rounded-full blur-md animate-pulse" />
              <div className="absolute -bottom-4 -left-6 w-16 h-16 bg-orange-500/20 rounded-full blur-md animate-pulse delay-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}