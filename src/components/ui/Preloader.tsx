import { Heart } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        {/* Animated logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary animate-pulse shadow-glow flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <h3 className="text-xl font-semibold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Curacloud
        </h3>
        <p className="text-muted-foreground mb-4">Loading your healthcare solutions</p>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  </div>
);

// Alternative minimal preloader
export const MinimalLoader = () => (
  <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="h-5 w-5 text-primary animate-pulse" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium">Curacloud</p>
    </div>
  </div>
);

// Modern gradient loader
export const GradientLoader = () => (
  <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
    <div className="text-center space-y-6">
      {/* Animated gradient circle */}
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 bg-gradient-primary rounded-full animate-pulse shadow-glow"></div>
        <div className="absolute inset-2 bg-background rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="h-8 w-8 text-primary animate-bounce" />
        </div>
      </div>
      
      {/* Text with typing effect */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Curacloud
        </h3>
        <div className="flex items-center justify-center space-x-1 text-muted-foreground">
          <span>Loading</span>
          <div className="flex space-x-1">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);


