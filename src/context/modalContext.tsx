"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl" | "fullscreen";

interface ModalOptions {
  title?: string;
  content: React.ReactNode;
  size?: ModalSize;
  showCloseBtn?: boolean;
  disableOutsideClick?: boolean;
  onClose?: () => void;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const showModal = useCallback((options: ModalOptions) => {
    setModalOptions(options);
  }, []);

  const closeModal = useCallback(() => {
    if (modalOptions?.onClose) modalOptions.onClose();
    setModalOptions(null);
  }, [modalOptions]);

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modalOptions && (
        <ModalRenderer {...modalOptions} onRequestClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};
