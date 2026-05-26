import * as React from "react";
import { cn } from "@/lib/utils";

type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  value: number;
  onValueChange: (value: number) => void;
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, value, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => (
  <input
    ref={ref}
    type="range"
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={(event) => onValueChange(Number(event.target.value))}
    className={cn("h-2 w-full cursor-pointer accent-primary", className)}
    {...props}
  />
));
Slider.displayName = "Slider";

export { Slider };
