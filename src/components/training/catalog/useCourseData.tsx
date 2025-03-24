
import { useState } from "react";
import { toast } from "sonner";
import { TrainingCourse } from "./types";

export const useCourseData = (initialActiveTab: string = "video") => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [editingCourse, setEditingCourse] = useState<TrainingCourse | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  
  const [courses, setCourses] = useState<TrainingCourse[]>([
    {
      id: "1",
      title: "Les bases du live streaming",
      description: "Apprenez comment configurer votre équipement et optimiser votre stream.",
      category: "video",
      url: "https://example.com/video1",
      thumbnail: "/placeholder.svg",
      duration: "15 min",
      theme: "Live TikTok"
    },
    {
      id: "2",
      title: "Guide de l'interface TikTok Live",
      description: "Comprendre et maîtriser l'interface de streaming de TikTok.",
      category: "document",
      url: "https://example.com/doc1",
      theme: "Live TikTok"
    },
    {
      id: "3",
      title: "Interaction avec l'audience",
      description: "Techniques pour engager efficacement votre audience pendant les lives.",
      category: "video",
      url: "https://example.com/video2",
      thumbnail: "/placeholder.svg",
      duration: "22 min",
      theme: "Engagement"
    },
    {
      id: "4",
      title: "Ressources d'auto-formation",
      description: "Liste de ressources externes pour continuer à vous former.",
      category: "external",
      url: "https://www.tiktok.com/creator-center/",
      theme: "Ressources"
    },
    {
      id: "5",
      title: "Optimiser votre contenu TikTok",
      description: "Techniques pour augmenter la visibilité de vos vidéos TikTok.",
      category: "video",
      url: "https://example.com/video3",
      thumbnail: "/placeholder.svg",
      duration: "18 min",
      theme: "Contenu"
    },
    {
      id: "6",
      title: "Utiliser les effets TikTok efficacement",
      description: "Guide complet sur l'utilisation des filtres et effets lors des lives.",
      category: "video",
      url: "https://example.com/video4",
      thumbnail: "/placeholder.svg",
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

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    
    if (!editingCourse.title || !editingCourse.url) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const existingIndex = courses.findIndex(course => course.id === editingCourse.id);
    
    if (existingIndex !== -1) {
      const updatedCourses = [...courses];
      updatedCourses[existingIndex] = editingCourse;
      setCourses(updatedCourses);
      toast.success("Formation mise à jour avec succès");
    } else {
      setCourses([...courses, editingCourse]);
      toast.success("Formation ajoutée avec succès");
    }
    
    setIsEditModalOpen(false);
    setEditingCourse(null);
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
    editingCourse,
    setEditingCourse,
    handleAddCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleSaveCourse
  };
};
