"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: "Are you sure?",
    description: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    destructive: false,
  });
  const resolveRef = useRef(null);

  const close = useCallback((result) => {
    setState((prev) => ({ ...prev, open: false }));
    resolveRef.current?.(result);
    resolveRef.current = null;
  }, []);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        title: options.title || "Are you sure?",
        description: options.description || "",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        destructive: options.destructive ?? false,
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open) close(false);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden p-0 sm:max-w-[420px]"
        >
          <DialogHeader className="space-y-2 px-6 pt-6 pb-4 text-left">
            <DialogTitle className="text-lg font-semibold">{state.title}</DialogTitle>
            {state.description ? (
              <DialogDescription className="text-sm leading-relaxed">
                {state.description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/30 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="min-w-[96px] sm:w-auto"
              onClick={() => close(false)}
            >
              {state.cancelLabel}
            </Button>
            <Button
              type="button"
              variant={state.destructive ? "destructive" : "default"}
              className="min-w-[96px] sm:w-auto"
              onClick={() => close(true)}
            >
              {state.confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context.confirm;
}
