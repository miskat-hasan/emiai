import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Safety net for any RTK Query mutation/query rejection that wasn't already
// given a specific .catch()/toast in the calling component.
export const rtkQueryErrorLogger = () => next => action => {
  if (isRejectedWithValue(action)) {
    const status = action.payload?.status;
    if (status !== 401) {
      const message =
        action.payload?.data?.message ??
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  }
  return next(action);
};
