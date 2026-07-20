"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Upload, Sparkles } from "lucide-react";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from "@/redux/api/services/eventApi";
import { useGetAllUsersQuery } from "@/redux/api/services/userApi";
import MultiSelect from "@/components/ui/MultiSelect";
import MultiSelectKeyValue from "@/components/ui/MultiSelectKeyValue";

// Sub-components

function Field({ label, error, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
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
      className={`w-full rounded-xl bg-gray/10 border border-transparent px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all ${className}`}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl bg-gray/10 border border-transparent px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none ${className}`}
    />
  );
}

import UploadBox from "@/components/ui/UploadBox";

//Visibility options

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "only_invited", label: "Only Invited" },
];

const TICKET_OPTIONS = [
  { id: "VIP", name: "VIP" },
  { id: "Normal", name: "Normal" },
  { id: "free", name: "Free" },
];

// Main modal

export default function CreateEventModal({
  open,
  onClose,
  onSuccess,
  editingEvent,
}) {
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const isLoading = isCreating || isUpdating;

  const { data: usersResponse, isLoading: isUsersLoading } =
    useGetAllUsersQuery(undefined, { skip: !open });
  const getArrayData = (queryData) => {
    if (Array.isArray(queryData)) return queryData;
    if (Array.isArray(queryData?.data)) return queryData.data;
    if (Array.isArray(queryData?.data?.data)) return queryData.data.data;
    return [];
  };

  const allUsers = getArrayData(usersResponse);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [eventPhoto, setEventPhoto] = useState(null);
  const [eventPhotoPreview, setEventPhotoPreview] = useState(null);
  const [legalDoc, setLegalDoc] = useState(null);
  const [legalDocPreview, setLegalDocPreview] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState("");

  const [collaborators, setCollaborators] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Reset on close or when editingEvent changes
  useEffect(() => {
    if (!open) {
      reset();
      setEventPhoto(null);
      setEventPhotoPreview(null);
      setLegalDoc(null);
      setLegalDocPreview(null);
      setIsPublished(false);
      setVisibility("public");
      setInvitationMessage("");
      setCollaborators([]);
      setSponsors([]);
      setTickets([]);
    } else if (editingEvent) {
      reset({
        title: editingEvent.name || editingEvent.title || "",
        event_type: editingEvent.event_type || editingEvent.type || "offline",
        entry_fee: editingEvent.entry_fee || "",
        event_date: (() => {
          if (!editingEvent.start_date && !editingEvent.date) return "";
          const dateStr = editingEvent.start_date || editingEvent.date;
          if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
            return dateStr.substring(0, 10);
          }
          try {
            return new Date(dateStr).toISOString().split("T")[0];
          } catch (e) {
            return "";
          }
        })(),
        location: editingEvent.location || "",
        full_location: editingEvent.full_location || "",
        description: editingEvent.description || "",
        legal_approvals_description:
          editingEvent.legal_approvals_description || "",
      });
      setEventPhotoPreview(editingEvent.photo || null);
      setLegalDocPreview(editingEvent.legal_doc || null);
      setIsPublished(
        editingEvent.is_published === 1 || editingEvent.is_published === true,
      );
      setVisibility(editingEvent.event_restriction || "public");
      setInvitationMessage(editingEvent.message || "");

      setTickets(
        editingEvent.tickets?.length > 0
          ? editingEvent.tickets.map((t) => ({
              id: t.ticket_type || t.type || t.id,
              price: t.price || "",
            }))
          : [],
      );
      setCollaborators(
        editingEvent.collaborators?.map((c) => String(c.id)) || [],
      );
      setSponsors(
        editingEvent.sponsors?.map((s) => ({
          id: s.sponsor_id || s.user_id || s.id,
          amount: s.amount,
        })) || [],
      );
    } else {
      reset();
    }
  }, [open, editingEvent, reset]);

  const handleGenerateAI = () => {
    setGeneratingAI(true);
    setTimeout(() => {
      setInvitationMessage(
        "You're cordially invited to join our exclusive Digital Marketing Forum 2025! This premier event brings together industry leaders to share insights and strategies. Don't miss this opportunity to connect and learn.",
      );
      setGeneratingAI(false);
    }, 1200);
  };

  const onSubmit = async (data) => {
    const fd = new FormData();

    fd.append("title", data.title);
    fd.append("type", data.event_type);
    fd.append("entry_fee", data.entry_fee ?? "");
    fd.append("date", data.event_date);
    fd.append("location", data.location);
    fd.append("full_location", data.full_location);
    fd.append("description", data.description);

    fd.append("event_restriction", visibility);
    fd.append("is_published", isPublished ? "1" : "0");
    fd.append("message", invitationMessage);

    collaborators.forEach((cId, i) => fd.append(`collaborators[${i}]`, cId));

    sponsors.forEach((s, i) => {
      fd.append(`sponsors[${i}][user_id]`, s.id);
      fd.append(`sponsors[${i}][amount]`, s.amount || "0");
    });

    tickets.forEach((t, i) => {
      fd.append(`tickets[${i}][type]`, t.id);
      fd.append(`tickets[${i}][price]`, t.price || "0");
    });

    const eventId = editingEvent?.id || editingEvent?.event_id;

    if (eventId) {
      fd.append("id", eventId);
    }

    if (eventPhoto) fd.append("photo", eventPhoto);

    try {
      if (eventId) {
        await updateEvent(fd).unwrap();
        toast.success("Event updated successfully!");
      } else {
        await createEvent(fd).unwrap();
        toast.success("Event created successfully!");
      }
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(
        err?.data?.message ??
          `Failed to ${eventId ? "update" : "create"} event.`,
      );
    }
  };

  if (!open) return null;

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal panel */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/*Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, rgba(var(--color-primary-rgb), 0.15) 100%)",
          }}
        />
        <div className="relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray/10">
            <h2 className="text-base font-bold text-black">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray/10 text-gray transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-5 flex flex-col gap-5"
          >
            {/* Event Title */}
            <Field label="Event Title" error={errors.title?.message}>
              <Input
                placeholder="Your Event Title Here..."
                {...register("title", { required: "Title is required" })}
              />
            </Field>

            {/* Event Type | Entry Fee | Event Date */}
            <div className="grid grid-cols-3 gap-3">
              <Field label="Event Type" error={errors.event_type?.message}>
                <div className="relative">
                  <select
                    {...register("event_type", {
                      required: "Event type is required",
                    })}
                    className="w-full rounded-xl bg-gray/10 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray text-xs">
                    ▾
                  </span>
                </div>
              </Field>

              <Field label="Entry Fee">
                <Input
                  placeholder="15"
                  type="number"
                  {...register("entry_fee")}
                />
              </Field>

              {/* Date*/}
              <Field label="Event Date" error={errors.event_date?.message}>
                <Input
                  type="date"
                  {...register("event_date", {
                    required: "Event date is required",
                  })}
                />
              </Field>
            </div>

            {/* Event Location | Event Full Location */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Event Location" error={errors.location?.message}>
                <Input
                  placeholder="Enter event location.."
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
              </Field>

              <Field label="Event Full Location" error={errors.full_location?.message}>
                <Input
                  placeholder="Event Full location here..."
                  {...register("full_location", {
                    validate: (value) => {
                      if (!value) return true;
                      const isGoogleMaps = value.includes("goo.gl") || value.includes("google.com/maps") || value.includes("maps.app.goo.gl") || value.includes("maps.google.com");
                      return isGoogleMaps || "Must be a valid Google Maps URL";
                    }
                  })}
                />
              </Field>
            </div>

            {/* Event Photo */}
            <UploadBox
              label="Event Photo"
              accept="image/png,image/jpeg,image/jpg"
              hint="PNG, JPG"
              file={eventPhoto}
              previewUrl={eventPhotoPreview}
              onChange={(file) => {
                setEventPhoto(file);
                if (file) setEventPhotoPreview(URL.createObjectURL(file));
              }}
              onRemove={() => {
                setEventPhoto(null);
                setEventPhotoPreview(null);
              }}
            />

            {/* Event Description */}
            <Field
              label="Event Description"
              error={errors.description?.message}
            >
              <Textarea
                placeholder="What is this event about?"
                rows={3}
                {...register("description", {
                  required: "Description is required",
                })}
              />
            </Field>

            {/* Legal Approvals Document */}
            <UploadBox
              label="Legal Approvals"
              accept=".doc,.docx,.pdf"
              hint="DOC, PDF"
              file={legalDoc}
              previewUrl={legalDocPreview}
              onChange={(file) => {
                setLegalDoc(file);
                if (file) setLegalDocPreview(URL.createObjectURL(file));
              }}
              onRemove={() => {
                setLegalDoc(null);
                setLegalDocPreview(null);
              }}
            />

            {/* Legal Approvals Description */}
            <Field label="Legal Approvals Description">
              <Textarea
                placeholder="What is this event about?"
                rows={3}
                {...register("legal_approvals_description")}
              />
            </Field>

            {/* Sponsored & Collaborators */}
            <div className="flex flex-col gap-5 z-[60]">
              <MultiSelectKeyValue
                id="sponsors"
                label="Sponsored"
                placeholder="Search for sponsors..."
                options={allUsers}
                value={sponsors}
                onChange={setSponsors}
                valueKey="amount"
                valuePlaceholder="Amount"
                valueType="number"
                isLoading={isUsersLoading}
              />

              <MultiSelect
                id="collaborators"
                label="Invite Collaborator (Optional)"
                placeholder="Search for an influencer..."
                options={allUsers}
                value={collaborators}
                onChange={setCollaborators}
                isLoading={isUsersLoading}
              />
            </div>

            {/* Tickets Section using MultiSelectKeyValue */}
            <div className="z-[50]">
              <MultiSelectKeyValue
                id="tickets"
                label="Tickets"
                placeholder="Select ticket types..."
                options={TICKET_OPTIONS}
                value={tickets}
                onChange={setTickets}
                valueKey="price"
                valuePlaceholder="Price ($)"
                valueType="number"
                hideValueForIds={["free"]}
              />
            </div>

            {/* Who can see your event */}
            <Field label="Who can see your event">
              <div className="relative">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full rounded-xl bg-gray/10 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray text-xs">
                  ▾
                </span>
              </div>
            </Field>

            {/* Publish Event */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black">
                Publish Event
              </span>
              <button
                type="button"
                onClick={() => setIsPublished((v) => !v)}
                className={`
                relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer
                ${isPublished ? "bg-primary" : "bg-gray/20"}
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

            {/* Invitation Message */}
            <Field label="Invitation Message">
              <Textarea
                placeholder="What is this event about?"
                rows={3}
                value={invitationMessage}
                onChange={(e) => setInvitationMessage(e.target.value)}
              />
            </Field>

            {/* Generate with AI */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={generatingAI}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-primary to-secondary text-white text-xs font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
              >
                <Sparkles size={13} />
                {generatingAI ? "Generating..." : "Generate message with AI"}
              </button>
            </div>

            {/* Footer: Cancel | Create Event */}
            <div className="flex items-center justify-between pt-2 border-t border-gray/10">
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
              >
                {isLoading
                  ? editingEvent
                    ? "Saving..."
                    : "Creating..."
                  : editingEvent
                    ? "Save Changes"
                    : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
