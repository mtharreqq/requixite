"use client";

import dynamic from "next/dynamic";

// Server-rendered as usual, but its code (the whole scroll story) is its own
// chunk, so the first paint doesn't wait on it.
export const ReviewStory = dynamic(() =>
  import("@/components/home/review-story").then((m) => m.ReviewStory),
);
