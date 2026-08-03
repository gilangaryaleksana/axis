import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communication - Axis",
};

export default function CommunicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}