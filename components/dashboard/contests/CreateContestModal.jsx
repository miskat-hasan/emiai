// components/dashboard/contests/CreateContestModal.jsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Plus, Calendar } from "lucide-react";
import {
  useCreateContestMutation,
  useUpdateContestMutation,
} from "@/redux/api/services/contestApi";
import MultiSelect from "../../ui/MultiSelect";
import MultiSelectKeyValue from "../../ui/MultiSelectKeyValue";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import { useGetAllUsersQuery } from "@/redux/api/services/userApi";
import UploadBox from "@/components/ui/UploadBox";

export default function CreateContestModal({
  open,
  onClose,
  onSuccess,
  contest,
}) {
  const isEdit = Boolean(contest?.id);

  const [createContest, { isLoading: isCreating }] = useCreateContestMutation();
  const [updateContest, { isLoading: isUpdating }] = useUpdateContestMutation();
  const isSubmitting = isCreating || isUpdating;

  const { data: usersData, isFetching: usersLoading } = useGetAllUsersQuery(
    undefined,
    { skip: !open },
  );
  
  const getArrayData = (queryData) => {
    if (Array.isArray(queryData)) return queryData;
    if (Array.isArray(queryData?.data)) return queryData.data;
    if (Array.isArray(queryData?.data?.data)) return queryData.data.data;
    return [];
  };

  const userOptions = getArrayData(usersData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [rules, setRules] = useState([""]);
  const [prizePhoto, setPrizePhoto] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [collaboratorIds, setCollaboratorIds] = useState([]);
  const [sponsors, setSponsors] = useState([]); // [{ id, value }]

  // Prefill on open (edit) or reset (create)
  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      reset({
        title: contest.title ?? "",
        description: contest.description ?? "",
        prize: contest.prize ?? "",
        end_date: contest.end_date ? contest.end_date.slice(0, 10) : "",
        total_slots: contest.total_slots ?? "",
        entry_fee: contest.entry_fee || "",
        partner_code: contest.partner_code || "",
      });
      setRules(
        Array.isArray(contest.rules) && contest.rules.length
          ? contest.rules
          : [""],
      );
      setIsPublished(Boolean(contest.is_published));
      setCollaboratorIds((contest.collaborators ?? []).map(c => String(c.id)));
      setSponsors(
        (contest.sponsorships ?? []).map(s => ({
          id: String(s.sponsor_id ?? s.sponsor?.id),
          value: String(s.amount ?? ""),
        })),
      );
      setPrizePhoto(null);
      setDocumentFile(null);
    } else {
      reset();
      setRules([""]);
      setPrizePhoto(null);
      setDocumentFile(null);
      setIsPublished(false);
      setCollaboratorIds([]);
      setSponsors([]);
    }
  }, [open, isEdit, contest, reset]);

  const onSubmit = async data => {
    const fd = new FormData();

    fd.append("title", data.title);
    fd.append("description", data.description);
    fd.append("end_date", `${data.end_date} 23:59:59`);
    fd.append("total_slots", data.total_slots);
    fd.append("prize", data.prize);
    fd.append("is_published", isPublished ? "1" : "0");

    if (data.entry_fee) fd.append("entry_fee", data.entry_fee);
    if (data.partner_code) fd.append("partner_code", data.partner_code);

    rules.filter(r => r.trim()).forEach((r, i) => fd.append(`rules[${i}]`, r));

    collaboratorIds.forEach((id, i) => fd.append(`collaborators[${i}]`, id));

    sponsors
      .filter(s => s.id && s.value !== "" && s.value != null)
      .forEach((s, i) => {
        fd.append(`sponsors[${i}][user_id]`, s.id);
        fd.append(`sponsors[${i}][amount]`, s.value);
        fd.append(`sponsors[${i}][payment_status]`, "pending");
      });

    if (prizePhoto) fd.append("prize_photo", prizePhoto);
    if (documentFile) fd.append("document", documentFile);

    try {
      const res = isEdit
        ? await updateContest({ id: contest.id, formData: fd }).unwrap()
        : await createContest(fd).unwrap();

      if (res?.success) {
        toast.success(
          isEdit
            ? "Contest updated successfully!"
            : "Contest created successfully!",
        );
        onClose();
        onSuccess?.();
      }
    } catch (err) {
      toast.error(
        err?.data?.message ??
          `Failed to ${isEdit ? "update" : "create"} contest.`,
      );
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-black">
            {isEdit ? "Edit Contest" : "Create New Contest"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 flex flex-col gap-5"
        >
          <Input
            label="Contest Title"
            placeholder="e.g. Summer Reels Challenge"
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />

          <Textarea
            label="Description"
            placeholder="What is this contest about?"
            error={errors.description?.message}
            {...register("description", {
              required: "Description is required",
            })}
          />

          {/* Rules */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Rules</label>
            {rules.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  wrapperClassName="flex-1"
                  placeholder={`Rule ${i + 1}`}
                  value={r}
                  onChange={e => {
                    const next = [...rules];
                    next[i] = e.target.value;
                    setRules(next);
                  }}
                />
                {rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setRules(rules.filter((_, idx) => idx !== i))
                    }
                    className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
                {i === rules.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setRules([...rules, ""])}
                    className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prize"
              placeholder="1500"
              type="number"
              error={errors.prize?.message}
              {...register("prize", { required: "Prize is required" })}
            />
            <Input
              label="End Date"
              type="date"
              icon={Calendar}
              error={errors.end_date?.message}
              {...register("end_date", { required: "End date is required" })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Entry Fee"
              placeholder="0"
              {...register("entry_fee")}
            />
            <Input
              label="Total Slots"
              type="number"
              placeholder="200"
              error={errors.total_slots?.message}
              {...register("total_slots", {
                required: "Total slots is required",
              })}
            />
          </div>

          <UploadBox
            label="Prize Photo"
            accept="image/png,image/jpeg"
            hint="PNG, JPG"
            file={prizePhoto}
            previewUrl={
              contest?.prize_photo_url
                ? `${process.env.NEXT_PUBLIC_API_URL}/${contest.prize_photo_url}`
                : null
            }
            onChange={setPrizePhoto}
            onRemove={() => setPrizePhoto(null)}
          />

          <UploadBox
            label="Attach Document"
            accept=".doc,.docx,.pdf"
            hint="DOC, PDF"
            file={documentFile}
            previewUrl={contest?.document_url ?? null}
            onChange={setDocumentFile}
            onRemove={() => setDocumentFile(null)}
          />

          <MultiSelectKeyValue
            label="Sponsors (Optional)"
            placeholder="Search and select sponsors..."
            options={userOptions}
            isLoading={usersLoading}
            value={sponsors}
            onChange={setSponsors}
            valueKey="value"
            valuePlaceholder="Amount"
            valueType="number"
          />

          <MultiSelect
            label="Invite Collaborators (Optional)"
            placeholder="Search and select collaborators..."
            options={userOptions}
            isLoading={usersLoading}
            value={collaboratorIds}
            onChange={setCollaboratorIds}
          />

          <Input
            label="Partner Code (Optional)"
            placeholder="e.g. MEM-S4CL6UUO"
            {...register("partner_code")}
          />

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-black">
              Publish Contest
            </span>
            <button
              type="button"
              onClick={() => setIsPublished(v => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                isPublished ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  isPublished ? "translate-x-0.5" : "-translate-x-5.5"
                }`}
              />
            </button>
          </div>

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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
            >
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create Contest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
