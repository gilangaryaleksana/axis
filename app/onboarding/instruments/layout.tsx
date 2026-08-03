import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instruments - Axis",
};

export default function InstrumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}