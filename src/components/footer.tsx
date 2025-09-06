import { Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
              <Image
                src="/images/logo-white.png"
                alt="devtoolskits"
                className="object-cover w-7 h-7"
                width={100}
                height={100}
              />
            </div>
            <span className="font-semibold bg-gradient-primary bg-clip-text text-transparent">
              devtoolskits
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for developers</span>
          </div>

          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} devtoolskits. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
