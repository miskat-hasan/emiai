"use client";

import { useEffect, useRef, useState } from "react";
import { getImageUrl } from "@/helper/getImageUrl";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import AddAgencyModal from "./AddAgencyModal";
import {
  useGetMyAgenciesQuery,
  useDeleteAgencyMutation,
} from "@/redux/api/services/managerApi";
import { getActivePermissionLabels } from "./permissionDefs";

function AgencyAvatar({ name, logo }) {
  const initials = name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2);

  if (!logo) {
    return (
      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs shrink-0">
        {initials || "A"}
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black shrink-0">
      <Image src={getImageUrl(logo)} alt={name} fill className="object-cover" />
    </div>
  );
}

function AgencyMenu({ onDelete, deleting }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <MoreHorizontal size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            disabled={deleting}
            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={14} />
            {deleting ? "Removing..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AgencyView() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading, isFetching } = useGetMyAgenciesQuery();
  const [deleteAgency] = useDeleteAgencyMutation();
  const [deletingId, setDeletingId] = useState(null);

  const agencies = data?.data ?? [];

  const handleDelete = async (agencyId, name) => {
    setDeletingId(agencyId);
    try {
      await deleteAgency(agencyId).unwrap();
      toast.success(`${name} removed.`);
    } catch {
      // Fake endpoint for now — the row is already removed optimistically
      // by managerApi's onQueryStarted, so stay quiet here.
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#202626]">Agency</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF5C26] to-[#FF5C26] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Agency</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-2xs">
        {isLoading ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Loading agencies...
          </p>
        ) : agencies.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No agencies added yet. Click Add New &quot;Agency&quot; to get
            started.
          </p>
        ) : (
          agencies.map(agency => {
            const activePermissions = getActivePermissionLabels(
              agency.permissions,
            );

            return (
              <div
                key={agency.id}
                className="space-y-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-center bg-[#F9F9F9] rounded-2xl p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <AgencyAvatar name={agency.name} logo={agency.avatar} />
                    <div className="min-w-0">
                      <h5 className="text-sm font-bold text-[#202626] truncate">
                        {agency.name}
                      </h5>
                      <p className="text-xs text-gray-400 font-medium">
                        Agency{agency.is_exclusive ? " · Exclusive" : ""}
                      </p>
                    </div>
                  </div>
                  <AgencyMenu
                    onDelete={() => handleDelete(agency.id, agency.name)}
                    deleting={deletingId === agency.id}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pt-1">
                  <div>
                    <span className="block text-xs font-bold text-[#202626] mb-1">
                      Mail
                    </span>
                    <span className="text-xs font-medium text-gray-400 break-all">
                      {agency.email}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#202626] mb-1.5">
                      Permissions
                    </span>
                    {activePermissions.length === 0 ? (
                      <span className="text-xs font-medium text-gray-400">
                        None granted
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {activePermissions.map(label => (
                          <span
                            key={label}
                            className="text-[10px] font-semibold text-[#1C4E3F] bg-[#1C4E3F]/8 px-2 py-1 rounded-md"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isFetching && !isLoading && (
          <p className="text-[11px] text-gray-300 text-center">Refreshing...</p>
        )}
      </div>

      <AddAgencyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
