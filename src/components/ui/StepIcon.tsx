import React from 'react';
import * as Icons from 'lucide-react';

interface StepIconProps {
  iconName: string;
  className?: string;
}

export function StepIcon({ iconName, className = "" }: StepIconProps) {
  // Get the icon component from Lucide
  const IconComponent = (Icons as any)[iconName] || Icons.HelpCircle;
  
  return (
    <IconComponent className={className} />
  );
} 