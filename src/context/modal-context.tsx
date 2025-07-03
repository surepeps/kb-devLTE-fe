"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

export interface ModalConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
  overlayClose?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
}

interface ModalContextType {
  modals: ModalConfig[];
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModalProps: (id: string, props: any) => void;
  isModalOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: ModalConfig) => {
    setModals((prev) => {
      // Remove existing modal with same id
      const filtered = prev.filter((modal) => modal.id !== config.id);
      return [...filtered, config];
    });
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const updateModalProps = useCallback((id: string, props: any) => {
    setModals((prev) =>
      prev.map((modal) =>
        modal.id === id
          ? { ...modal, props: { ...modal.props, ...props } }
          : modal,
      ),
    );
  }, []);

  const isModalOpen = useCallback(
    (id: string) => {
      return modals.some((modal) => modal.id === id);
    },
    [modals],
  );

  const value: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModalProps,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ModalRenderer modals={modals} onClose={closeModal} />
    </ModalContext.Provider>
  );
};

// Modal Renderer Component
const ModalRenderer: React.FC<{
  modals: ModalConfig[];
  onClose: (id: string) => void;
}> = ({ modals, onClose }) => {
  const getSizeClasses = (size: ModalConfig["size"] = "md") => {
    switch (size) {
      case "sm":
        return "max-w-md";
      case "md":
        return "max-w-lg";
      case "lg":
        return "max-w-2xl";
      case "xl":
        return "max-w-4xl";
      case "full":
        return "max-w-full mx-4";
      default:
        return "max-w-lg";
    }
  };

  const getPositionClasses = (position: ModalConfig["position"] = "center") => {
    switch (position) {
      case "top":
        return "items-start pt-16";
      case "bottom":
        return "items-end pb-16";
      case "center":
      default:
        return "items-center";
    }
  };

  return (
    <AnimatePresence>
      {modals.map((modal, index) => {
        const Component = modal.component;
        const zIndex = 50 + index;

        return (
          <div
            key={modal.id}
            className={`fixed inset-0 flex justify-center p-4 bg-black/50 transition-opacity duration-300`}
            style={{ zIndex }}
            onClick={
              modal.overlayClose !== false ? () => onClose(modal.id) : undefined
            }
          >
            <div
              className={`relative flex ${getPositionClasses(modal.position)} w-full`}
            >
              <div
                className={`bg-white rounded-xl shadow-2xl ${getSizeClasses(modal.size)} w-full max-h-[90vh] overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
              >
                <Component
                  {...modal.props}
                  onClose={() => onClose(modal.id)}
                  modalId={modal.id}
                />
              </div>
            </div>
          </div>
        );
      })}
    </AnimatePresence>
  );
};

// Convenience hook for common modal actions
export const useModalActions = () => {
  const { openModal, closeModal, closeAllModals } = useModal();

  const openNegotiationModal = useCallback(
    (property: any, onSubmit?: (data: any) => void) => {
      const NegotiationModal = React.lazy(
        () => import("@/components/modals/negotiation-modal"),
      );

      openModal({
        id: "negotiation-modal",
        component: NegotiationModal,
        props: {
          property,
          onSubmit,
        },
        size: "lg",
      });
    },
    [openModal],
  );

  const openPriceModal = useCallback(
    (filters: any, onApply?: (filters: any) => void) => {
      const PriceModal = React.lazy(
        () => import("@/components/modals/price-modal"),
      );

      openModal({
        id: "price-modal",
        component: PriceModal,
        props: {
          currentFilters: filters,
          onApply,
        },
        size: "md",
      });
    },
    [openModal],
  );

  const openConfirmationModal = useCallback(
    (
      title: string,
      message: string,
      onConfirm?: () => void,
      onCancel?: () => void,
    ) => {
      const ConfirmationModal = React.lazy(
        () => import("@/components/modals/confirmation-modal"),
      );

      openModal({
        id: "confirmation-modal",
        component: ConfirmationModal,
        props: {
          title,
          message,
          onConfirm,
          onCancel,
        },
        size: "sm",
      });
    },
    [openModal],
  );

  return {
    openNegotiationModal,
    openPriceModal,
    openConfirmationModal,
    closeModal,
    closeAllModals,
  };
};
