"use client";

import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";

export default function CustomAnalytics() {
  return (
    <Suspense fallback={null}>
      <Analytics
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
