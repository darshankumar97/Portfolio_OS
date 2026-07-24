import { ImageResponse } from "next/og";
import { getSiteConfig, getProfile } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DevOS — Darshan Kumar K R";

export default async function OpengraphImage() {
  const [site, profile] = await Promise.all([getSiteConfig(), getProfile()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            fontWeight: 600,
            color: "#a3a3a3",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "#fafafa",
              color: "#0a0a0a",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            D
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 56, fontWeight: 600, letterSpacing: -1.5, maxWidth: 900 }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 32, color: "#a3a3a3", maxWidth: 900 }}>
          {profile.title} — {site.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
