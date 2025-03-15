
import {
  MessageSquare,
  Image,
  Video,
  FileAudio,
  FileText
} from "lucide-react";

interface StatCardsProps {
  role: string;
}

export const StatCards = ({ role }: StatCardsProps) => {
  // Ces valeurs seraient normalement récupérées depuis une API
  const stats = [
    { title: "Chats", value: 0, icon: <MessageSquare className="w-6 h-6" /> },
    { title: "Images", value: 0, icon: <Image className="w-6 h-6" /> },
    { title: "Vidéos", value: 0, icon: <Video className="w-6 h-6" /> },
    { title: "Audio", value: 0, icon: <FileAudio className="w-6 h-6" /> },
    { title: "Documents", value: 0, icon: <FileText className="w-6 h-6" /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-[#1e293b]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:bg-[#1e293b] hover:border-gray-600/50"
        >
          <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
          <div className="flex items-center gap-2 text-gray-400">
            {stat.icon}
            <span>{stat.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
