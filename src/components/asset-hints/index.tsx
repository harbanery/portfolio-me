"use client";

import ReactDOM from "react-dom";

/**
 * Resource hints for the external asset host — images and files load
 * from Cloudinary (profile images, covers, CV/certificate assets).
 * Preconnecting shaves the DNS+TLS handshake — roughly 100–300 ms — off
 * the first asset request.
 *
 * Uses the ReactDOM hint methods (the metadata API does not support
 * <link rel="preconnect">), which insert the tags into <head> safely.
 */
export default function AssetHints() {
  ReactDOM.preconnect("https://res.cloudinary.com");

  return null;
}
