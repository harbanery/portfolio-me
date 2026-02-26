export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('http')) {
    return src;
  }
  
  // For local images in public folder
  return `/${src}`;
}
