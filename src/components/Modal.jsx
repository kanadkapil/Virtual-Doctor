export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button 
          onClick={onClose} 
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >✕</button>
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  );
}
