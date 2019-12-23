import React, { useEffect } from 'react';
import './modal.scss';

const Modal = ({ show, onClose, children }) => {
  return (
    <div
      className="modal"
      style={
        show ? { pointerEvents: 'all', opacity: '1' } : { pointerEvents: 'none', opacity: '0' }
      }
    >
      <div className="modal-display">{children}</div>
      <button className="modal-close-button" onClick={onClose} type="button">
        Close
      </button>
    </div>
  );
};

export default Modal;
