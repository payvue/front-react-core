interface GridLayoutProps {
  columns?: 1 | 2;
  gap?: number;
  children: React.ReactNode;
}

export const GridLayout = ({ columns = 2, gap = 4, children }: GridLayoutProps) => (
  <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-${gap}`}>
    {children}
  </div>
)
