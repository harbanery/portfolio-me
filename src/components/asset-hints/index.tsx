"use client";

import ReactDOM from "react-dom";

/**
 * Resource hints for the external asset hosts — images and files load
 * from Cloudinary (covers, CV/certificate assets) and Supabase (profile
 * images). Preconnecting (Cloudinary, fetched early on most pages) and
 * prefetching DNS (Supabase) shaves the DNS+TLS handshake — roughly
 * 100–300 ms per host — off the first asset request.
 *
 * Uses the ReactDOM hint methods (the metadata API does not support
 * <link rel="preconnect">), which insert the tags into <head> safely.
 */
export default function AssetHints() {
  ReactDOM.preconnect("https://res.cloudinary.com");
  ReactDOM.prefetchDNS("https://jfbwaakuillpudswyfkg.supabase.co");

  return null;
}
