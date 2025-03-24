
export interface TrainingCourse {
  id: string;
  title: string;
  description: string;
  category: "video" | "document" | "external";
  url: string;
  thumbnail?: string;
  duration?: string;
  theme?: string;
}

export interface CourseEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCourse: TrainingCourse | null;
  onCourseChange: (updatedCourse: TrainingCourse) => void;
  onSave: () => void;
}

export interface TrainingCardProps {
  course: TrainingCourse;
  role: string;
  onEdit: (course: TrainingCourse) => void;
  onDelete: (id: string) => void;
}

export interface ThemeFilterProps {
  themes: string[];
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

export interface TrainingCatalogProps {
  role: string;
}
