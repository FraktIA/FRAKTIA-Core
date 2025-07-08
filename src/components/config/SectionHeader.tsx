import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  section: string;
  isExpanded: boolean;
  onToggle: (section: string) => void;
  className?: string;
  count?: number;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon: Icon,
  section,
  isExpanded,
  onToggle,
  className = "",
  count,
}) => {
  return (
    <div
      className={`flex items-center justify-between cursor-pointer group ${className}`}
      onClick={() => onToggle(section)}
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-white tracking-wide">
          {title}
        </h3>
        {count !== undefined && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            {count}
          </span>
        )}
      </div>
      {isExpanded ? (
        <ChevronUp
          size={16}
          className="text-white/50 group-hover:text-white/70 transition-colors"
        />
      ) : (
        <ChevronDown
          size={16}
          className="text-white/50 group-hover:text-white/70 transition-colors"
        />
      )}
    </div>
  );
};

export default SectionHeader;
