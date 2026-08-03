"use client";

import { useState } from "react";

export function OptionalWebNfcScan() {
  const [message, setMessage] = useState("");

  const scan = async () => {
    if (!("NDEFReader" in window)) {
      setMessage("Bu tarayıcı Web NFC desteklemiyor. Anahtarın bağlantısını doğrudan açabilirsiniz.");
      return;
    }

    try {
      const reader = new (
        window as unknown as {
          NDEFReader: new () => {
            scan: () => Promise<void>;
            onreading: (event: { serialNumber?: string }) => void;
          };
        }
      ).NDEFReader();
      await reader.scan();
      reader.onreading = (event) =>
        setMessage(`Anahtar algılandı: ${event.serialNumber ?? "hazır"}`);
    } catch {
      setMessage("NFC taraması başlatılamadı.");
    }
  };

  return (
    <div>
      <button type="button" className="astra-button" onClick={scan}>
        NFC ile tara
      </button>
      {message && <p className="astra-muted">{message}</p>}
    </div>
  );
}
