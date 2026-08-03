interface NDEFMessageInit {
  records: NDEFRecordInit[];
}

interface NDEFRecordInit {
  recordType: string;
  mediaType?: string;
  data?: string | BufferSource;
}

interface NDEFReadingEvent extends Event {
  message: { records: Array<{ recordType: string }> };
}

declare class NDEFReader {
  constructor();
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  write(
    message: NDEFMessageInit | string,
    options?: { overwrite?: boolean; signal?: AbortSignal },
  ): Promise<void>;
  addEventListener(
    type: "reading" | "readingerror",
    listener: (ev: NDEFReadingEvent | Event) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
}

interface Window {
  NDEFReader?: typeof NDEFReader;
}
