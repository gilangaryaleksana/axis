import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Background - Axis",
};

export default function BackgroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}