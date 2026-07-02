"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { X, Upload, Sparkles } from "lucide-react";
import { useCreateEventMutation } from "@/redux/api/services/eventApi";
import { useLazySearchUsersQuery } from "@/redux/api/services/commonApi";

// Sub-components

function AsyncUserSearch({ label, selectedUsers, onChange, placeholder, requireAmount }) {
  const [triggerSearch, { data, isFetching }] = useLazySearchUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        triggerSearch(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, triggerSearch]);

  const handleSelectUser = (user) => {
    if (!selectedUsers.find(u => u.id === user.id)) {
      onChange([...selectedUsers, { ...user, amount: "" }]);
    }
    setSearchTerm("");
    setShowDropdown(false);
  };

  const handleRemoveUser = (userId) => {
    onChange(selectedUsers.filter(u => u.id !== userId));
  };

  const handleAmountChange = (userId, amount) => {
    onChange(selectedUsers.map(u => u.id === userId ? { ...u, amount } : u));
  };

  const results = data?.data || data || [];

  return (
    <Field label={label} className="relative">
      <div className="flex flex-col gap-2">
        <Input 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder={placeholder}
        />
        
        {/* Selected Users Chips */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-col gap-2 mt-1">
            {selectedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-gray/10 rounded-xl px-3 py-2 text-sm">
                <span className="font-medium text-black">{user.name || user.email}</span>
                <div className="flex items-center gap-2">
                  {requireAmount && (
                    <input 
                      type="number"
                      placeholder="Amount"
                      value={user.amount}
                      onChange={(e) => handleAmountChange(user.id, e.target.value)}
                      className="w-24 rounded-lg bg-white border border-gray/20 px-2 py-1 text-xs outline-none focus:border-primary/40"
                    />
                  )}
                  <button type="button" onClick={() => handleRemoveUser(user.id)} className="text-gray hover:text-red-500 cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dropdown */}
        {showDropdown && searchTerm && (
          <div className="absolute top-[70px] left-0 right-0 z-10 bg-white rounded-xl shadow-lg border border-gray/10 max-h-48 overflow-y-auto">
            {isFetching ? (
              <div className="p-3 text-sm text-gray text-center">Searching...</div>
            ) : results.length > 0 ? (
              results.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => handleSelectUser(user)}
                  className="px-4 py-2 hover:bg-gray/5 cursor-pointer text-sm text-black border-b border-gray/5 last:border-0"
                >
                  {user.name} <span className="text-gray text-xs ml-1">({user.email})</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray text-center">No users found</div>
            )}
          </div>
        )}
      </div>
    </Field>
  );
}

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

function UploadBox({ label, accept, hint, onChange, fileName }) {
  const ref = useRef(null);
  return (
    <Field label={label}>
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray/20 bg-gray/5 hover:border-primary/40 hover:bg-primary/5 cursor-pointer transition-all"
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
              <span className="text-gray"> or drag &amp; drop</span>
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

//Visibility options

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "only_invited", label: "Only Invited" }
];

// Main modal

export default function CreateEventModal({ open, onClose, onSuccess }) {
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [eventPhoto, setEventPhoto] = useState(null);
  const [legalDoc, setLegalDoc] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [visibility, setVisibility] = useState("public");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [invitationMessage, setInvitationMessage] = useState("");

  const [step, setStep] = useState(1);
  const [eventData, setEventData] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [tickets, setTickets] = useState([
    { type: "VIP", price: "" },
    { type: "Normal", price: "" },
    { type: "free", price: "" },
  ]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      reset();
      setEventPhoto(null);
      setLegalDoc(null);
      setIsPublished(false);
      setVisibility("public");
      setInvitationMessage("");
      setStep(1);
      setEventData(null);
      setCollaborators([]);
      setSponsors([]);
      setTickets([
        { type: "VIP", price: "" },
        { type: "Normal", price: "" },
        { type: "free", price: "" },
      ]);
    }
  }, [open, reset]);

  const handleGenerateAI = () => {
    setGeneratingAI(true);
    setTimeout(() => {
      setInvitationMessage(
        "You're cordially invited to join our exclusive Digital Marketing Forum 2025! This premier event brings together industry leaders to share insights and strategies. Don't miss this opportunity to connect and learn.",
      );
      setGeneratingAI(false);
    }, 1200);
  };

  const handleTicketChange = (index, field, value) => {
    const newTickets = [...tickets];
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  const onSubmit = async data => {
    setEventData(data);
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    const fd = new FormData();
    const data = eventData;

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

    collaborators.forEach((c, i) => fd.append(`collaborators[${i}]`, c.id));
    sponsors.forEach((s, i) => {
      fd.append(`sponsors[${i}][user_id]`, s.id);
      fd.append(`sponsors[${i}][amount]`, s.amount || "0");
    });
    tickets.forEach((t, i) => {
      fd.append(`tickets[${i}][type]`, t.type);
      fd.append(`tickets[${i}][price]`, t.price);
    });


    if (eventPhoto) fd.append("photo", eventPhoto);

    try {
      const res = await createEvent(fd).unwrap();
      // Assuming res?.success is present, otherwise adapt to API format
      toast.success("Event created successfully!");
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to create event.");
    }
  };

  if (!open) return null;

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Modal panel */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/*Gradient Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(var(--color-primary-rgb), 0.15) 100%)" }}
        />
        <div className="relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent flex flex-col w-full h-full">
          {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray/10">
          <h2 className="text-base font-bold text-black">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray/10 text-gray transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={step === 1 ? "px-6 py-5 flex flex-col gap-5" : "hidden"}
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
                  {...register("event_type", { required: "Event type is required" })}
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

            <Field label="Event Entry Fee">
              <Input
                placeholder="1212"
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
                placeholder="Here."
                {...register("location", { required: "Location is required" })}
              />
            </Field>

            <Field label="Event Full Location">
              <Input
                placeholder="Event Full location here..."
                {...register("full_location")}
              />
            </Field>
          </div>

          {/* Event Photo */}
          <UploadBox
            label="Event Photo"
            accept="image/png,image/jpeg,image/jpg"
            hint="PNG, JPG"
            onChange={setEventPhoto}
            fileName={eventPhoto?.name}
          />

          {/* Event Description */}
          <Field label="Event Description" error={errors.description?.message}>
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
            onChange={setLegalDoc}
            fileName={legalDoc?.name}
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
          <div className="flex flex-col gap-5">
            <AsyncUserSearch 
              label="Sponsored"
              placeholder="Search for sponsors..."
              selectedUsers={sponsors}
              onChange={setSponsors}
              requireAmount={true}
            />

            <AsyncUserSearch 
              label="Invite Collaborator (Optional)"
              placeholder="Search for an influencer..."
              selectedUsers={collaborators}
              onChange={setCollaborators}
              requireAmount={false}
            />
          </div>

          {/* Who can see your event */}
          <Field label="Who can see your event">
            <div className="relative">
              <select
                value={visibility}
                onChange={e => setVisibility(e.target.value)}
                className="w-full rounded-xl bg-gray/10 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                {VISIBILITY_OPTIONS.map(opt => (
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
              onClick={() => setIsPublished(v => !v)}
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
              onChange={e => setInvitationMessage(e.target.value)}
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

          {/* Footer: Cancel | Send Invitations | Create Event */}
          <div className="flex items-center justify-between pt-2 border-t border-gray/10">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-gray hover:text-black transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
              >
                Send Invitations
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </form>

        <div className={step === 2 ? "px-6 py-5 flex flex-col gap-6" : "hidden"}>
            <div className="text-center pt-2">
              <h2 className="text-xl font-bold text-black">{eventData?.title}</h2>
              <div className="text-sm text-gray mt-2 space-y-0.5">
                <p>Date: {eventData?.event_date && new Date(eventData.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p>Location: {eventData?.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {tickets.map((ticket, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <Field label="Classify Ticket">
                    <div className="relative">
                      <select
                        value={ticket.type}
                        onChange={e => handleTicketChange(index, "type", e.target.value)}
                        className="w-full rounded-xl bg-gray/10 border border-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-primary/40 focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option value="VIP">VIP</option>
                        <option value="Normal">Normal</option>
                        <option value="free">Free</option>
                      </select>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray text-xs">
                        ▾
                      </span>
                    </div>
                  </Field>

                  <Field label="Price">
                    <Input
                      placeholder="$05"
                      value={ticket.price}
                      onChange={e => handleTicketChange(index, "price", e.target.value)}
                    />
                  </Field>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-8 pt-4 pb-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-[#115F59] hover:opacity-80 transition-opacity cursor-pointer"
              >
                No
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity shadow-sm shadow-primary/20 cursor-pointer"
              >
                {isLoading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
