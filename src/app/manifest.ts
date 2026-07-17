import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DevOS — Darshan Kumar K R",
    short_name: "DevOS",
    description: "Engineering portfolio by Darshan Kumar K R",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#0a0a0a",
  };
}
