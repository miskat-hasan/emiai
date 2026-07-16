// redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import { apiSlice } from "@/redux/api/apiSlice";
import registrationReducer from "@/redux/slices/registrationSlice";
import adCreationReducer from "@/redux/slices/adCreationSlice";
import { rtkQueryErrorLogger } from "@/redux/rtkQueryErrorLogger";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registration: registrationReducer,
    adCreation: adCreationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  // To avoid Redux warnings
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "adCreation/setDraftData",
        ],
        ignoredPaths: ["adCreation.draft.mediaFile"],
      },
  }).concat(apiSlice.middleware, rtkQueryErrorLogger),
});

export const persister = persistStore(store);
