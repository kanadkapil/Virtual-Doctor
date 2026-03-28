export default function Badge({ children, color = "primary", className = "" }) {
  const colors = {
    primary: "badge-primary",
    secondary: "badge-secondary",
    accent: "badge-accent",
    ghost: "badge-ghost",
    info: "badge-info",
    success: "badge-success",
    warning: "badge-warning",
    error: "badge-error",
  };

  return (
    <div className={`badge ${colors[color]} ${className}`}>
      {children}
    </div>
  );
}
