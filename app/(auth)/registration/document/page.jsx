"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthButton from "@/components/ui/AuthButton";
import AuthBackButton from "@/components/ui/AuthBackButton";
import UploadBox from "@/components/ui/UploadBox";
import {
  getRegistrationFile,
  setRegistrationFile,
} from "@/lib/registrationFileStore";

export default function RegistrationDocumentPage() {
  const router = useRouter();
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("reg_role");
    const hasInfo = sessionStorage.getItem("reg_info");
    // Guard: only advertiser/agency reach this step, and only after info is filled.
    if (!role || !hasInfo) {
      router.replace("/registration");
      return;
    }
    if (role !== "advertiser" && role !== "agency") {
      router.replace("/registration/password");
      return;
    }
    // Restore the previously-uploaded file if the user navigated back to
    // this step — the file itself already survives in the module-level
    // store, only the local UI state (which drives UploadBox's preview)
    // needs to be re-synced with it.
    const existing = getRegistrationFile("document");
    if (existing) setDocumentFile(existing);
  }, [router]);

  const handleNext = () => {
    if (!documentFile) {
      setError(true);
      return;
    }
    setIsSubmitting(true);
    setRegistrationFile("document", documentFile);
    router.push("/registration/password");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Verify Your Business</h1>
        <p className="text-sm text-gray mt-1">
          Upload your registration certificate to continue.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <UploadBox
            label="Registration Certificate"
            accept=".doc,.docx,.pdf"
            hint="DOC, PDF"
            file={documentFile}
            onChange={file => {
              setDocumentFile(file);
              setError(false);
            }}
            onRemove={() => setDocumentFile(null)}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1">
              Registration certificate is required.
            </p>
          )}
        </div>

        <div className="mt-2 flex gap-2">
          <AuthBackButton />
          <AuthButton type="button" onClick={handleNext} loading={isSubmitting}>
            Next
          </AuthButton>
        </div>
      </div>
    </div>
  );
}
