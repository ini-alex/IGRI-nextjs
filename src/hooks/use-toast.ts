"use client";

import { useState, useCallback } from "react";

type ToastType = "success" | "error" | "info";

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
  id: number;
}

interface UseToastReturn {
  toast: ToastState;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

let toastId = 0;

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    isVisible: false,
    id: 0,
  });

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    toastId += 1;
    setToast({
      message,
      type,
      isVisible: true,
      id: toastId,
    });

    // Auto hide after 2.5 seconds
    setTimeout(() => {
      hideToast();
    }, 2500);
  }, [hideToast]);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success");
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, "error");
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, "info");
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showInfo,
  };
}

// Global toast hook for non-component usage (optional)
class ToastManager {
  private static instance: ToastManager;
  private listeners: Array<(toast: ToastState) => void> = [];
  private currentToast: ToastState = {
    message: "",
    type: "success",
    isVisible: false,
    id: 0,
  };

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  subscribe(listener: (toast: ToastState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.currentToast));
  }

  show(message: string, type: ToastType = "success") {
    toastId += 1;
    this.currentToast = {
      message,
      type,
      isVisible: true,
      id: toastId,
    };
    this.notify();

    setTimeout(() => {
      this.hide();
    }, 2500);
  }

  hide() {
    this.currentToast = { ...this.currentToast, isVisible: false };
    this.notify();
  }

  success(message: string) {
    this.show(message, "success");
  }

  error(message: string) {
    this.show(message, "error");
  }

  info(message: string) {
    this.show(message, "info");
  }
}

export const toast = ToastManager.getInstance();
