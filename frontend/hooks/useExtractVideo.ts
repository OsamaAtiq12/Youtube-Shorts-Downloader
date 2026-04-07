"use client";

import { useMutation } from "@tanstack/react-query";

import { extractVideo } from "@/lib/api";

export function useExtractVideo() {
  return useMutation({
    mutationFn: extractVideo,
  });
}
