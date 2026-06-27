"use client";

import React from "react";
import CreateNewAdModal from "./CreateNewAdModal";
import PublishAdOptionsModal from "./PublishAdOptionsModal";
import { toast } from "react-toastify";
import Modal from "@/components/common/Modal";
import { useDispatch, useSelector } from "react-redux";
import { setStep, clearDraft } from "@/redux/slices/adCreationSlice";

export default function CreateAdFlow() {
  const dispatch = useDispatch();
  const step = useSelector((state) => state.adCreation.step);

  const handleClose = () => {
    dispatch(clearDraft());
  };

  return (
    <>
      <CreateNewAdModal
        open={step === "create_ad"}
        onClose={handleClose}
      />
      
      {step === "post_options" && (
        <Modal
          open={true}
          onClose={handleClose}
          className="!rounded-3xl !p-0 max-w-[400px]"
        >
          <PublishAdOptionsModal
            onCancel={handleClose}
          />
        </Modal>
      )}
    </>
  );
}
