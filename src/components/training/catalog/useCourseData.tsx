
import { useState } from "react";
import { toast } from "sonner";
import { TrainingCourse } from "./types";
import { getYoutubeVideoId } from "@/utils/videoHelpers";

export const useCourseData = (initialActiveTab: string = "video") => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  
  const [courses, setCourses] = useState<TrainingCourse[]>([
    {
      id: "1",
      title: "Les bases du live streaming",
      description: "Apprenez comment configurer votre équipement et optimiser votre stream pour une meilleure qualité et stabilité.",
      category: "video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "15 min",
      theme: "Live TikTok"
    },
    {
      id: "2",
      title: "Guide de l'interface TikTok Live",
      description: "Comprendre et maîtriser l'interface de streaming de TikTok pour des performances optimales.",
      category: "document",
      url: "https://example.com/doc1",
      theme: "Live TikTok"
    },
    {
      id: "3",
      title: "Interaction avec l'audience",
      description: "Techniques pour engager efficacement votre audience pendant les lives et augmenter votre rétention.",
      category: "video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "22 min",
      theme: "Engagement"
    },
    {
      id: "4",
      title: "Ressources d'auto-formation",
      description: "Liste de ressources externes pour continuer à vous former et améliorer vos compétences.",
      category: "external",
      url: "https://www.tiktok.com/creator-center/",
      theme: "Ressources"
    },
    {
      id: "5",
      title: "Optimiser votre contenu TikTok",
      description: "Techniques pour augmenter la visibilité de vos vidéos TikTok et atteindre plus d'utilisateurs.",
      category: "video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "18 min",
      theme: "Contenu"
    },
    {
      id: "6",
      title: "Utiliser les effets TikTok efficacement",
      description: "Guide complet sur l'utilisation des filtres et effets lors des lives pour un contenu plus engageant.",
      category: "video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      duration: "12 min",
      theme: "Live TikTok"
    }
  ]);

  const handleAddCourse = () => {
    setEditingCourse({
      id: Date.now().toString(),
      title: "",
      description: "",
      category: activeTab as "video" | "document" | "external",
      url: "",
      theme: "Live TikTok"
    });
    setIsEditModalOpen(true);
  };

  const handleEditCourse = (course: TrainingCourse) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("Formation supprimée avec succès");
  };

  const handleCourseChange = (updatedCourse: TrainingCourse) => {
    setEditingCourse(updatedCourse);
    
    // Si c'est une vidéo YouTube, on essaie d'extraire l'ID pour la vignette
    if (updatedCourse.category === "video" && !updatedCourse.thumbnail) {
      const videoId = getYoutubeVideoId(updatedCourse.url);
      if (videoId) {
        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setEditingCourse({...updatedCourse, thumbnail});
      }
    }
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    
    if (!editingCourse.title || !editingCourse.url) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Pour les vidéos YouTube, essayons d'obtenir une vignette si elle n'est pas définie
    let courseToSave = { ...editingCourse };
    
    if (courseToSave.category === "video" && !courseToSave.thumbnail) {
      const videoId = getYoutubeVideoId(courseToSave.url);
      if (videoId) {
        courseToSave.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    const existingIndex = courses.findIndex(course => course.id === courseToSave.id);
    
    if (existingIndex !== -1) {
      const updatedCourses = [...courses];
      updatedCourses[existingIndex] = courseToSave;
      setCourses(updatedCourses);
      toast.success("Formation mise à jour avec succès");
    } else {
      setCourses([...courses, courseToSave]);
      toast.success("Formation ajoutée avec succès");
    }
    
    setIsEditModalOpen(false);
    setEditingCourse(null);
  };

  const handleViewCourse = (course: TrainingCourse) => {
    setSelectedCourse(course);
    if (course.category === "video") {
      setIsVideoPlayerOpen(true);
    } else if (course.category === "document" || course.category === "external") {
      window.open(course.url, '_blank');
    }
  };

  // Extract unique themes from courses
  const themes = ["all", ...Array.from(new Set(courses.map(course => course.theme))).filter(Boolean)] as string[];

  // Filter courses by active tab and selected theme
  const filteredCourses = courses.filter(course => {
    const matchesTab = course.category === activeTab;
    const matchesTheme = selectedTheme === "all" || course.theme === selectedTheme;
    return matchesTab && matchesTheme;
  });

  return {
    courses,
    filteredCourses,
    themes,
    activeTab,
    setActiveTab,
    selectedTheme,
    setSelectedTheme,
    isEditModalOpen,
    setIsEditModalOpen,
    isVideoPlayerOpen,
    setIsVideoPlayerOpen,
    editingCourse,
    selectedCourse,
    setEditingCourse,
    handleCourseChange,
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleSaveCourse,
    handleViewCourse
  };
};
