"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useGetCategoriesQuery,
} from "@/redux/api/services/commonApi";
import { getStoredUser, getStoredToken } from "@/lib/auth-storage";
import AuthButton from "@/components/ui/AuthButton";
import { useUpdateUserMutation } from "@/redux/api/services/userApi";

export default function OnboardingCategoryPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useGetCategoriesQuery();
  const [updateCategory, { isLoading: isSaving }] =
    useUpdateUserMutation();

  const [selectedId, setSelectedId] = useState([]);

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/login");
      return;
    }
    const user = getStoredUser();
    if (user?.category_id) setSelectedId([user.category_id]);
  }, [router]);

  const categories = data?.data ?? [];

  const goNext = () => router.push("/onboarding/social");

  const handleNext = async () => {
    if (!selectedId || selectedId.length === 0) {
      toast.error("Please choose a category to continue");
      return;
    }

    try {
      // TODO: this endpoint doesn't exist yet — safe to call once it's live
      await updateCategory({ category_id: selectedId }).unwrap();
    } catch {
      // Not live yet — don't block onboarding on it
    }

    goNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Category</h1>
        <p className="text-sm text-gray mt-1">
          Choose your interest category to help brands find you.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-sm text-gray">
          Couldn&apos;t load categories right now — you can skip and pick this
          later.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-2.5">
          {categories.map(cat => {
            const active = selectedId.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (selectedId.includes(cat.id)) {
                    setSelectedId(selectedId.filter(id => id !== cat.id));
                  } else {
                    setSelectedId([...selectedId, cat.id]);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer
                  ${
                    active
                      ? "bg-[#f57802] text-white border-transparent shadow-sm shadow-primary/30"
                      : "bg-gray-100 text-black border-transparent hover:bg-gray-200"
                  }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-3 mt-2">
        <div className="w-full">
          <AuthButton type="button" loading={isSaving} onClick={handleNext}>
            Next
          </AuthButton>
        </div>
        <button
          type="button"
          onClick={goNext}
          className="text-sm font-medium text-gray hover:text-black transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
