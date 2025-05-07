import React, { useEffect, useRef } from "react";
import Prism from "prismjs";
import { cn } from "@/lib/utils";

interface CodeProps {
  children: string;
  language?: string;
  className?: string;
}

export function Code({ children, language = "ruby", className }: CodeProps) {
  const codeRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [children]);
  
  return (
    <pre className={cn("rounded-md overflow-auto bg-[#1E1E1E] p-4 my-4 text-sm", className)}>
      <code ref={codeRef} className={`language-${language}`}>
        {children}
      </code>
    </pre>
  );
}
