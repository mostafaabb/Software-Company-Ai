"use client";

import * as React from "react";

export function JsonView({ data, initialDepth = 2 }: { data: any; initialDepth?: number }) {
  return (
    <pre className="max-h-[60vh] overflow-auto rounded-md bg-zinc-950/50 p-4 text-xs leading-relaxed text-zinc-200">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
