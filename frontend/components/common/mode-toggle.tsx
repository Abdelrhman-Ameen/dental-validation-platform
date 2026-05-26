"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const shouldUseDark = stored ? stored === "dark" : true;
    setDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle color mode">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
