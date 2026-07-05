/** Menu route template — pass-through so fixed cart UI is never trapped in a fade wrapper. */
export default function MenuTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
