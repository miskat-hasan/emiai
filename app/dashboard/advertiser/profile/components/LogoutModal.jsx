"use client";


export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div 
        className="bg-[#FAF6F0] w-full max-w-sm rounded-3xl p-8 shadow-xl text-center relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Heading */}
        <h3 className="text-2xl font-bold text-[#202626] mb-3">Logout</h3>
        
        {/* Description Body Text */}
        <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[240px] mx-auto mb-8">
          Are you sure you want to logout your account?
        </p>

        {/* Action Decision Buttons */}
        <div className="flex items-center justify-center gap-12">
          <button
            type="button"
            onClick={onClose}
            className="text-base font-bold text-[#1C4E3F] hover:opacity-80 transition-opacity cursor-pointer px-4 py-2"
          >
            No
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="bg-gradient-to-r from-[#FF5C26] to-[#FF7A45] text-white text-sm font-bold px-8 py-3 rounded-2xl hover:opacity-95 shadow-sm transition-all cursor-pointer min-w-[90px]"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}