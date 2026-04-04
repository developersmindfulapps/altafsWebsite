import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-sm transition-all duration-200 uppercase tracking-wider text-xs px-6 py-4 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-light focus:ring-primary shadow-sm",
    secondary:
      "bg-secondary text-white hover:bg-secondary-light focus:ring-secondary shadow-sm",
    outline:
      "bg-transparent border border-primary text-primary hover:bg-slate-50 focus:ring-primary",
    ghost: "bg-transparent text-primary hover:bg-slate-50 focus:ring-primary",
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  const combinedStyles = `${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
