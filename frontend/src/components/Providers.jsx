"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ConfirmProvider } from "@/components/ConfirmProvider";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        {children}
      </ConfirmProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
