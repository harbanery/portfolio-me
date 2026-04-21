"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";

export default function CustomSpeedInsights() {
  return (
    <SpeedInsights
      beforeSend={(event) => {
        if (event.url.includes("/admin")) {
          return null;
        }
        return event;
      }}
    />
  );
}
