import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goal - Axis",
};

export default function GoalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}