"use client";

import Modal from "@/components/common/Modal";

export default function LogoutModal({ open, onClose, onConfirm, loading }) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      hideClose
      panelClassName="max-w-sm rounded-3xl p-8 bg-[#FAF6F0] text-center"
    >
      <h3 className="text-2xl font-bold text-[#202626] mb-3">Logout</h3>

      <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[240px] mx-auto mb-8">
        Are you sure you want to logout your account?
      </p>

      <div className="flex items-center justify-center gap-12">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="text-base font-bold text-[#1C4E3F] hover:opacity-80 transition-opacity cursor-pointer px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          No
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="bg-gradient-to-r from-[#FF5C26] to-[#FF7A45] text-white text-sm font-bold px-8 py-3 rounded-2xl hover:opacity-95 shadow-sm transition-all cursor-pointer min-w-[90px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging out..." : "Yes"}
        </button>
      </div>
    </Modal>
  );
}
