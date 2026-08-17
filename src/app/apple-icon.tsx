import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0712",
          borderRadius: 42,
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            border: "6px solid #E8D5A8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: "#F3E6C4",
              marginLeft: 14,
            }}
          />
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              background: "#0A0712",
              position: "absolute",
              left: 28,
              top: 34,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
