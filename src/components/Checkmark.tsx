import React from "react";
import { CheckCircle } from "lucide-react";

export const Checkmark: React.FC<{ className?: string }> = ({
  className = "w-5 h-5 text-primary",
}) => <CheckCircle aria-label="Configured" className={className} />;
