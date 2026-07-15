// redux/api/rtkQueryErrorLogger.js
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Catches any RTK Query mutation/query rejection that wasn't already handled
// with a specific .catch()/toast in the calling component — a safety net,
// not a replacement for specific error messages where you have them.
export const rtkQueryErrorLogger = () => next => action => {
  if (isRejectedWithValue(action)) {
    const status = action.payload?.status;
    // 401s are handled by your existing auth-redirect logic elsewhere —
    // don't double-toast those.
    if (status !== 401) {
      const message =
        action.payload?.data?.message ??
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  }
  return next(action);
};
