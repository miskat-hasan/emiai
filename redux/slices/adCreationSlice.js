import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: "grid", // "grid", "create_ad", "post_options", "preview"
  draft: {
    adsDescription: "",
    adsCategory: "",
    countries: [],
    prizeType: "",
    prizes: [{ rank: 1, value: "" }],
    promoCode: "",
    promoCodeDiscount: "",
    promoCodeExpiry: "",
    mediaFile: null,
    previewUrl: null,
  },
  options: {
    selectedOption: "promo_code",
    code: "",
  },
};

const adCreationSlice = createSlice({
  name: "adCreation",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setDraftData: (state, action) => {
      state.draft = { ...state.draft, ...action.payload };
    },
    setOptionsData: (state, action) => {
      state.options = { ...state.options, ...action.payload };
    },
    clearDraft: (state) => {
      state.step = "grid";
      state.draft = initialState.draft;
      state.options = initialState.options;
    },
  },
});

export const { setStep, setDraftData, setOptionsData, clearDraft } =
  adCreationSlice.actions;

export default adCreationSlice.reducer;
