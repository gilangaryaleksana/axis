import { DM_Sans, Crimson_Text } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700", "800", "900"],
});

export const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
});
