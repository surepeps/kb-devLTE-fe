// App initialization utility to prevent premature API calls

let isAppInitialized = false;
let initializationPromise: Promise<void> | null = null;

export const initializeApp = async (): Promise<void> => {
  if (isAppInitialized) return;

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = new Promise((resolve) => {
    // Wait for DOM to be ready
    if (typeof window !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          isAppInitialized = true;
          resolve();
        });
      } else {
        isAppInitialized = true;
        resolve();
      }
    } else {
      // Server-side, consider initialized
      isAppInitialized = true;
      resolve();
    }
  });

  return initializationPromise;
};

export const isInitialized = (): boolean => isAppInitialized;

export const waitForInitialization = async (): Promise<void> => {
  if (isAppInitialized) return;
  return initializeApp();
};
