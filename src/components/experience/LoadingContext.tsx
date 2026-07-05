"use client";

import { createContext, useContext } from "react";

type LoadingState = {
  /** true until the intro loader has finished revealing the site */
  isLoading: boolean;
};

export const LoadingContext = createContext<LoadingState>({ isLoading: true });

export const useLoading = () => useContext(LoadingContext);
