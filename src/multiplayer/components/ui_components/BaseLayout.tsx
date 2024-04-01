export function BaseCardLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-48 w-32 md:h-56 md:w-40 rounded-xl">{children}</div>;
}
