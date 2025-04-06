
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useMobileMenu(onLogout: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  
  const handleNavigate = (path: string) => {
    navigate(path);
    handleClose();
  };
  
  const handleLogout = () => {
    onLogout();
    handleClose();
  };

  return {
    isOpen,
    handleOpen,
    handleClose,
    handleNavigate,
    handleLogout
  };
}
