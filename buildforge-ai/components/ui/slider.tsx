"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue"> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const currentValue = value?.[0] ?? defaultValue?.[0] ?? 0;
    const percentage = ((currentValue - min) / (max - min)) * 100;

    return (
      <div className="flex w-full flex-col gap-2">
        <div className="relative flex h-2 w-full items-center">
          <div className="absolute h-2 w-full rounded-full bg-muted" />
          <div
            className="absolute h-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
            style={{ width: `${percentage}%` }}
          />
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={(e) => onValueChange?.([Number(e.target.value)])}
            className={cn(
              "absolute h-2 w-full cursor-pointer appearance-none bg-transparent opacity-0 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm",
              className,
            )}
            {...props}
          />
          <div
            className="absolute h-4 w-4 rounded-full border-2 border-primary bg-background shadow-sm transition-transform hover:scale-110 pointer-events-none"
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
        </div>
      </div>
    );
  },
);
Slider.displayName = "Slider";

export { Slider };
