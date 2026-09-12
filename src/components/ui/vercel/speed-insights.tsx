"use client";

import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function CustomSpeedInsights() {
  return (
    <Suspense fallback={null}>
      <SpeedInsights
        beforeSend={(event) => {
          if (event.url.includes("/admin")) {
            return null;
          }
          return event;
        }}
      />
    </Suspense>
  );
}
