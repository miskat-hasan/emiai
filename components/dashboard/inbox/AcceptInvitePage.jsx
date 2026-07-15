"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Users } from "lucide-react";
import { getStoredToken, getStoredUser } from "@/lib/auth-storage";
import { getRoleHomeRoute } from "@/lib/roleRoutes";
import { useAcceptGroupInviteMutation } from "@/redux/api/services/chatApi";
import AuthButton from "@/components/ui/AuthButton";
import { useSelector } from "react-redux";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const authUser = useSelector(state => state.auth.user);
  const router = useRouter();
  const [status, setStatus] = useState("checking"); // checking | accepting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [groupName, setGroupName] = useState("");

  const [acceptInvite] = useAcceptGroupInviteMutation();

  useEffect(() => {
    if (!token) return;

    // Not logged in — bounce to login and bring them straight back here
    // once they authenticate, so the invite isn't lost.
    if (!getStoredToken()) {
      router.replace(`/login?redirect=/chat/${token}`);
      return;
    }

    let cancelled = false;
    setStatus("accepting");

    acceptInvite(token)
      .unwrap()
      .then(res => {
        if (cancelled) return;
        setGroupName(res?.data?.conversation_id ? "the group" : "the group");
        setStatus("success");
      })
      .catch(err => {
        if (cancelled) return;
        setErrorMessage(
          err?.data?.message ?? "This invite link is invalid or has expired.",
        );
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const goToInbox = () => {
    const role = authUser?.role;
    router.push(`${getRoleHomeRoute(role)}/inbox`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          {status === "success" ? (
            <CheckCircle2 size={26} className="text-primary" />
          ) : status === "error" ? (
            <XCircle size={26} className="text-red-500" />
          ) : (
            <Users size={26} className="text-primary" />
          )}
        </div>

        {(status === "checking" || status === "accepting") && (
          <>
            <h1 className="text-lg font-bold text-black mb-2">
              Joining group...
            </h1>
            <p className="text-sm text-gray mb-6">
              Please wait while we verify your invite.
            </p>
            <Loader2 size={20} className="animate-spin text-primary mx-auto" />
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-lg font-bold text-black mb-2">You're in!</h1>
            <p className="text-sm text-gray mb-6">
              You've successfully joined {groupName}.
            </p>
            <AuthButton type="button" onClick={goToInbox}>
              Go to Inbox
            </AuthButton>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-lg font-bold text-black mb-2">
              Couldn't join group
            </h1>
            <p className="text-sm text-gray mb-6">{errorMessage}</p>
            <button
              onClick={goToInbox}
              className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer"
            >
              Back to Inbox
            </button>
          </>
        )}
      </div>
    </div>
  );
}
