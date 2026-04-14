import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get("title") || SITE_CONFIG.fullName;
  const description = searchParams.get("description") || SITE_CONFIG.description;
  const magnitude = searchParams.get("magnitude");
  const wilayah = searchParams.get("wilayah");
  const tanggal = searchParams.get("tanggal");

  const isDetail = magnitude && wilayah;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDetail ? "#000000" : "#F2F2F7",
          backgroundImage: isDetail 
            ? "linear-gradient(135deg, #1C1C1E 0%, #000000 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #F2F2F7 100%)",
          padding: 60,
        }}
      >
        {isDetail ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontSize: 120,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: 20,
              }}
            >
              {magnitude} M
            </div>
            <div
              style={{
                fontSize: 40,
                color: "#FFFFFF",
                textAlign: "center",
                marginBottom: 20,
                maxWidth: 900,
              }}
            >
              {wilayah}
            </div>
            {tanggal && (
              <div style={{ fontSize: 28, color: "#8E8E93" }}>
                {tanggal}
              </div>
            )}
            <div
              style={{
                marginTop: 40,
                padding: "12px 32px",
                background: "#007AFF",
                borderRadius: 999,
                color: "white",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              IGRI - Info Gempa Republik Indonesia
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: 24,
              }}
            >
              IGRI
            </div>
            <div
              style={{
                fontSize: 48,
                color: "#000000",
                textAlign: "center",
                marginBottom: 16,
                maxWidth: 900,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#8E8E93",
                textAlign: "center",
                maxWidth: 800,
              }}
            >
              {description}
            </div>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
