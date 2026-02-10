/*
 * EditableField — Inline editing component for admin mode
 * Design: "Anthropic Warmth" — Empathetic Admin UX
 * Pencil icons appear on hover, edits save automatically
 */
import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableFieldProps {
  value: string;
  fieldId: string;
  onSave: (value: string) => void;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
  multiline?: boolean;
}

export default function EditableField({
  value,
  fieldId,
  onSave,
  className = "",
  as: Tag = "span",
  multiline = false,
}: EditableFieldProps) {
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleSave();
    }
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (!isAdmin) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-flex items-center gap-1.5">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={cn(
              "bg-primary/5 border border-primary/30 rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none min-w-[200px]",
              className
            )}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={cn(
              "bg-primary/5 border border-primary/30 rounded-md px-2 py-0.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[120px]",
              className
            )}
          />
        )}
        <button
          onClick={handleSave}
          className="p-1 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <Tag
      className={cn(
        "relative group/edit cursor-pointer border border-dashed border-transparent hover:border-primary/30 rounded-md px-1 -mx-1 transition-all duration-200",
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      {value}
      <Pencil className="inline-block w-3 h-3 ml-1.5 opacity-0 group-hover/edit:opacity-60 text-primary transition-opacity duration-200" />
    </Tag>
  );
}
