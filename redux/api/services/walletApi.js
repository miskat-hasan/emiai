// redux/api/services/walletApi.js
import { apiSlice } from "../apiSlice";

const WalletApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getWalletSummary: builder.query({
      query: () => ({ url: "/api/wallet/summary", method: "GET" }),
      providesTags: ["Wallet"],
    }),
    getConnectStatus: builder.query({
      query: () => ({ url: "/api/wallet/connect/status", method: "GET" }),
      providesTags: ["WalletConnect"],
    }),
    connectBankAccount: builder.mutation({
      query: () => ({ url: "/api/wallet/connect", method: "GET" }),
      invalidatesTags: ["WalletConnect"],
    }),
    topUpWallet: builder.mutation({
      query: data => ({ url: "/api/wallet/topup", method: "POST", body: data }),
      invalidatesTags: ["Wallet"],
    }),
    withdrawFromWallet: builder.mutation({
      query: data => ({
        url: "/api/wallet/withdraw",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletSummaryQuery,
  useGetConnectStatusQuery,
  useConnectBankAccountMutation,
  useTopUpWalletMutation,
  useWithdrawFromWalletMutation,
} = WalletApi;
