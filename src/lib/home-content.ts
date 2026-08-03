import { DEFAULT_DEMO_CODE } from "@/lib/nfc/demo-tags";

export type HomeDemoCouple = { slug: string; names: string };

export function getDemoHref() {
  return `/k/${DEFAULT_DEMO_CODE}`;
}
