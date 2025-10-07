import React, { useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import { X } from 'lucide-react';

const Modal: React.FC = () => {
  const { isOpen, content, closeModal } = useModal();

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with premium blur effect */}
      <div 
        className="fixed inset-0 backdrop-blur-xl bg-black/40"
        onClick={closeModal}
      >
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
      </div>

      {/* Modal Content */}
      <div className="relative max-w-7xl w-full max-h-[90vh] mx-4 overflow-auto">
        <div className="relative bg-gradient-to-b from-slate-900/95 to-black/95 rounded-2xl shadow-[0_0_100px_rgba(59,130,246,0.2)] border border-blue-500/20 backdrop-blur-xl transition-all duration-300">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 rounded-lg transition-all duration-300 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content area with premium scrollbar */}
          <div className="p-6 overflow-auto scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/30">
            {content}
          </div>

          {/* Premium bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export { Modal };