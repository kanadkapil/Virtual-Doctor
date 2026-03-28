export default function Card({ children, className = "", noPadding = false }) {
  return (
    <div className={`glass-card ${className}`}>
      <div className={noPadding ? "" : "p-6 sm:p-8"}>
        {children}
      </div>
    </div>
  );
}
