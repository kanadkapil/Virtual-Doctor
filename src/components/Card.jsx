export default function Card({ children, className = "", noPadding = false }) {
  return (
    <div className={`clinical-card ${className}`}>
      {noPadding ? children : children}
    </div>
  );
}
