import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PrimaryTabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

function PrimaryTabs({ children, className, ...props }: PrimaryTabsProps) {
  return (
    <Tabs className={className} {...props}>
      {children}
    </Tabs>
  );
}

export default PrimaryTabs;
