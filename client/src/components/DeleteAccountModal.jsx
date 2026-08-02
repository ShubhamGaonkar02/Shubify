import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { deleteAccount, user } = useAuthStore();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteAccount();
    setIsDeleting(false);
    onClose();
    if (res.success) {
      navigate('/login');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#18181b] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-white">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Delete Account</h3>
            <p className="text-xs text-gray-400">Permanently remove your Shubify account</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-xs text-red-200 leading-relaxed font-medium">
          <p className="font-bold text-red-400 mb-1">⚠️ Warning: This action cannot be undone.</p>
          <p>
            Deleting your account (<strong className="text-white">{user.email}</strong>) will permanently erase all your saved playlists, liked songs, and profile data.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-full text-xs font-extrabold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
          >
            {isDeleting ? (
              <span>Deleting...</span>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete My Account</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
