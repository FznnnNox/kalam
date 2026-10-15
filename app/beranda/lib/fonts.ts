import { Amiri, Outfit } from "next/font/google";

export const arabic = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
export const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});