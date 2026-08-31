import { ImageResponse } from "next/og";
import { IconArt } from "@/lib/icon-art";

/** iOS home screen tile. 180 is the size current iPhones ask for. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<IconArt px={size.width} />, size);
}
