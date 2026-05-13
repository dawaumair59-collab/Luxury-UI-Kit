import { useEffect } from "react";

interface SeoMetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SeoMeta({
  title = "MenuLux — Luxury Digital Menus for Restaurants",
  description = "Create stunning digital menus with QR codes, video reels, and real-time analytics. The premium platform for modern restaurants.",
  image = "/og-image.png",
  url,
}: SeoMetaProps) {
  useEffect(() => {
    document.title = title;

    function setMeta(name: string, content: string, attr = "name") {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    if (image) setMeta("og:image", image, "property");
    if (url) setMeta("og:url", url, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);
    setMeta("theme-color", "#d4af37");
  }, [title, description, image, url]);

  return null;
}
