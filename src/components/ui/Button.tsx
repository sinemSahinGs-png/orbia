import Link from "next/link";

type Props = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  pulse?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled,
}: Props) {
  const cls = `cine-btn ${variant === "ghost" ? "cine-btn--ghost" : ""} ${className}`.trim();
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
