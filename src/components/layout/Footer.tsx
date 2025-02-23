
import { Button } from "@/components/ui/button";
import { WhatsappLogo } from "phosphor-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#1A1F2C] border-t border-gray-800 mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="/phoceenagency-logo.svg" 
            alt="Phocéen Agency"
            className="h-8 w-auto"
          />
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
