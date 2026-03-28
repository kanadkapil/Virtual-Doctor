export default function Button({ children, variant = "primary", className = "", ...props }) {
  const baseStyle = "btn";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    accent: "btn-accent",
    ghost: "btn-ghost",
    outline: "btn-outline",
    error: "btn-error",
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
