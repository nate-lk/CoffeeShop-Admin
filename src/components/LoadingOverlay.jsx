import { createPortal } from "react-dom";
import { ClipLoader } from "react-spinners";

export default function LoadingOverlay() {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      data-admin-loading
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.3)",
        pointerEvents: "auto",
      }}
    >
      <div style={{
        background: "white",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <ClipLoader color="#3e2723" size={60} />
        <p style={{ color: "#374151", fontWeight: 500, marginTop: 8 }}>Loading...</p>
      </div>
    </div>,
    document.body
  );
}
