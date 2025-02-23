
import { Button } from "@/components/ui/button";
import { WhatsappLogo } from "phosphor-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#1A1F2C] border-t border-gray-800 mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="agency-text text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
            Phocéen Agency
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="http://phoceenagency.fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            phoceenagency.fr
          </a>

          <Button 
            variant="outline" 
            asChild
            className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
          >
            <a 
              href="https://live-backstage.tiktok.com/" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Backstage
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            asChild
            className="border-green-600 text-green-500 hover:bg-green-600 hover:text-white transition-colors gap-2"
          >
            <a 
              href="https://chat.whatsapp.com/CW5td9nAqOR9P058nwi7Ft" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <WhatsappLogo className="w-5 h-5" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};
