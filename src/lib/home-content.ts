import { DEMO_TAGS, DEFAULT_DEMO_CODE } from "@/lib/nfc/demo-tags";

export type HomeDemoCouple = { slug: string; names: string };

export function getDemoHref() {
  return `/${DEMO_TAGS[DEFAULT_DEMO_CODE]}`;
}
