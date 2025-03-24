
import { MessageCircle, Send, MessageSquare } from "lucide-react";
import React from "react";

export interface CommunityLink {
  name: string;
  url: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
  shadowColor: string;
  hoverBg: string;
}

export const getCommunityLinks = (): CommunityLink[] => [
  {
    name: "WhatsApp",
    url: "https://chat.whatsapp.com/CW5td9nAqOR9P058nwi7Ft",
    bgColor: "from-emerald-400 to-green-600",
    textColor: "text-white",
    icon: <MessageCircle className="h-6 w-6" />,
    shadowColor: "shadow-green-500/30",
    hoverBg: "hover:from-emerald-500 hover:to-green-700"
  },
  {
    name: "Snapchat",
    url: "https://snapchat.com/t/pyOCbCrj",
    bgColor: "from-yellow-300 to-yellow-500",
    textColor: "text-gray-900",
    icon: <Send className="h-6 w-6" />,
    shadowColor: "shadow-yellow-500/30",
    hoverBg: "hover:from-yellow-400 hover:to-yellow-600"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@phoceen_agency",
    bgColor: "from-neutral-800 to-gray-900",
    textColor: "text-white",
    icon: <MessageSquare className="h-6 w-6" />,
    shadowColor: "shadow-gray-800/30",
    hoverBg: "hover:from-neutral-900 hover:to-black"
  }
];
