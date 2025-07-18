
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { cn } from "@/lib/utils";

interface SavePropertyButtonProps {
  propertyId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
}

const SavePropertyButton = ({ 
  propertyId, 
  variant = "ghost", 
  size = "icon",
  className 
}: SavePropertyButtonProps) => {
  const { isPropertySaved, toggleSavedProperty, loading } = useSavedProperties();
  
  const isSaved = isPropertySaved(propertyId);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSavedProperty(propertyId);
      }}
      disabled={loading}
      className={cn(className)}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          isSaved ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )} 
      />
    </Button>
  );
};

export default SavePropertyButton;
