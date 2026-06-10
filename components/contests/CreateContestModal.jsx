"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Plus, Upload, Calendar } from "lucide-react";
import { useCreateContestMutation } from "@/redux/api/services/contestApi";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all ${className}`}
    />
  );
}

function UploadBox({ label, accept, hint, onChange, fileName }) {
  const ref = useRef(null);
  return (
    <Field label={label}>
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all"
      >
        <Upload size={18} className="text-primary shrink-0" />
        <div className="text-sm">
          {fileName ? (
            <span className="font-medium text-black">{fileName}</span>
          ) : (
            <>
              <span className="font-semibold text-primary underline underline-offset-2">
                Click to Upload
              </span>
              <span className="text-gray"> or drag & drop</span>
            </>
          )}
          {!fileName && <p className="text-xs text-gray mt-0.5">{hint}</p>}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
    </Field>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function CreateContestModal({ open, onClose, onSuccess }) {
  const [createContest, { isLoading }] = useCreateContestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Dynamic rules rows
  const [rules, setRules] = useState([""]);
  // Dynamic prize rows
  const [prizes, setPrizes] = useState([""]);

  const [prizePhoto, setPrizePhoto] = useState(null);
  const [document, setDocument] = useState(null);
  const [isPublished, setIsPublished] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!open) {
      reset();
      setRules([""]);
      setPrizes([""]);
      setPrizePhoto(null);
      setDocument(null);
      setIsPublished(false);
    }
  }, [open, reset]);

  const onSubmit = async data => {
    const fd = new FormData();

    fd.append("title", data.title);
    fd.append("description", data.description);
    fd.append("end_date", data.end_date + " 23:59:59");
    fd.append("total_slots", data.total_slots);
    fd.append("is_published", isPublished ? "1" : "0");

    // Rules joined
    const rulesStr = rules.filter(Boolean).join(", ");
    fd.append("rules", rulesStr);

    // First prize value
    const prizeVal = prizes.filter(Boolean)[0] ?? "";
    fd.append("prize", prizeVal);

    if (prizePhoto) fd.append("prize_photo", prizePhoto);
    if (document) fd.append("document", document);

    // Optional fields
    if (data.entry_fee) fd.append("entry_fee", data.entry_fee);
    if (data.sponsored) fd.append("sponsors[0][user_id]", data.sponsored);
    if (data.payment_request)
      fd.append("sponsors[0][amount]", data.payment_request);
    if (data.partner_code) fd.append("partner_code", data.partner_code);
    if (data.collaborator) fd.append("collaborators[0]", data.collaborator);

    try {
      const res = await createContest(fd).unwrap();
      if (res?.success) {
        toast.success("Contest created successfully!");
        onClose();
        onSuccess?.();
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to create contest.");
    }
  };

  if (!open) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-black">Create New Contest</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 flex flex-col gap-5"
        >
          {/* Contest Title */}
          <Field label="Contest Title" error={errors.title?.message}>
            <Input
              placeholder="gfvbslkhgshgis"
              {...register("title", { required: "Title is required" })}
            />
          </Field>

          {/* Description */}
          <Field label="Description" error={errors.description?.message}>
            <textarea
              placeholder="What is this contest about?"
              {...register("description", {
                required: "Description is required",
              })}
              rows={3}
              className="w-full rounded-xl bg-gray-100 border border-transparent px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none"
            />
          </Field>

          {/* Rules + Prize + End Date */}
          <div className="flex items-start gap-3">
            {/* Rules rows */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-black">Rules</label>
              {rules.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder={`Rule ${i + 1}`}
                    value={r}
                    onChange={e => {
                      const next = [...rules];
                      next[i] = e.target.value;
                      setRules(next);
                    }}
                  />
                  {i === rules.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setRules([...rules, ""])}
                      className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Prize rows */}
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-black">Prize</label>
              {prizes.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder="Prize"
                    value={p}
                    onChange={e => {
                      const next = [...prizes];
                      next[i] = e.target.value;
                      setPrizes(next);
                    }}
                  />
                  {i === prizes.length - 1 && (
                    <button
                      type="button"
                      onClick={() => setPrizes([...prizes, ""])}
                      className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* End Date */}
            <div className="flex flex-col gap-2 shrink-0">
              <label className="text-sm font-medium text-black">End Date</label>
              <div className="relative">
                <Input
                  type="date"
                  className="pr-9"
                  {...register("end_date", {
                    required: "End date is required",
                  })}
                />
                <Calendar
                  size={15}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Entry Fee + Total Slots */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Entry Fee">
              <Input placeholder="here." {...register("entry_fee")} />
            </Field>
            <Field label="Total Slots" error={errors.total_slots?.message}>
              <Input
                type="number"
                placeholder="200"
                {...register("total_slots", {
                  required: "Total slots is required",
                })}
              />
            </Field>
          </div>

          {/* Prize Photo */}
          <UploadBox
            label="Prize Photo"
            accept="image/png,image/jpeg"
            hint="PNG, JPG"
            onChange={setPrizePhoto}
            fileName={prizePhoto?.name}
          />

          {/* Attach Document */}
          <UploadBox
            label="Attach Document"
            accept=".doc,.docx,.pdf"
            hint="DOC, PDF"
            onChange={setDocument}
            fileName={document?.name}
          />

          {/* Sponsored + Payment Request */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sponsored">
              <Input placeholder="here." {...register("sponsored")} />
            </Field>
            <Field label="Payment Request">
              <Input placeholder="here." {...register("payment_request")} />
            </Field>
          </div>

          {/* Invite Collaborator */}
          <Field label="Invite Collaborator (Optional)">
            <Input
              placeholder="Search for an influencer..."
              {...register("collaborator")}
            />
          </Field>

          {/* Publish toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-black">
              Publish Contest
            </span>
            <button
              type="button"
              onClick={() => setIsPublished(v => !v)}
              className={`
                relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer
                ${isPublished ? "bg-primary" : "bg-gray-200"}
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
                  ${isPublished ? "translate-x-0.5" : "-translate-x-5.5"}
                `}
              />
            </button>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray hover:text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              {isLoading ? "Creating..." : "Create Contest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
