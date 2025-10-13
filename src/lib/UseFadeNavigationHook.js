"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function useFadeNavigation() {
  const router = useRouter();
  const sectionRef = useRef(null);

  const handleNavigation = (href) => {
    const section = sectionRef.current;
    if (section) {
      section.classList.add("fade-out");
      setTimeout(() => router.push(href), 400);
    } else {
      router.push(href);
    }
  };

  return { sectionRef, handleNavigation };
}
