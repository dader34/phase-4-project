import React from 'react';
import '../STYLING/Modal.css';

const Modal = ({ children, onClose }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button onClick={onClose} className="closeButton">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
