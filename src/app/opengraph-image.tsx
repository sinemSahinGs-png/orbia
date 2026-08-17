import { ImageResponse } from "next/og";

export const alt = "ORBIA — Gökyüzünü yanında taşı.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(165deg, #1A1028 0%, #0A0712 48%, #12081C 100%)",
          color: "#F3EEF8",
        }}
      >
        <div
          style={{
            width: 148,
            height: 148,
            borderRadius: 74,
            border: "3px solid #E8D5A8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              background: "#F3E6C4",
              marginLeft: 16,
            }}
          />
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              background: "#12081C",
              position: "absolute",
              left: 32,
              top: 40,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 72,
            letterSpacing: 18,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          ORBIA
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            letterSpacing: 2,
            color: "#C9B6E8",
          }}
        >
          12 burç · NFC anahtarlık · gökyüzü mührü
        </div>
      </div>
    ),
    size,
  );
}
