import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm leading-relaxed text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
