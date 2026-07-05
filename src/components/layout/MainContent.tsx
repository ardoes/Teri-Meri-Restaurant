import {
  PageTransition,
  PageTransitionView,
} from "@/components/providers/PageTransition";

export function MainContent({ children }: { children: React.ReactNode }) {
  return <PageTransitionView>{children}</PageTransitionView>;
}

export { PageTransition };
