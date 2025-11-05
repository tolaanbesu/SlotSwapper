import { useState } from "react";

export const useMessage = () => {
  const [message, setMessage] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [resolveConfirm, setResolveConfirm] = useState(() => () => {});

  const showAlert = (text) => setMessage({ type: "alert", text });

  const showConfirm = (text) =>
    new Promise((resolve) => {
      setMessage({ type: "confirm", text });
      setIsConfirming(true);
      setResolveConfirm(() => resolve);
    });

  const handleConfirm = (value) => {
    setIsConfirming(false);
    setMessage(null);
    resolveConfirm(value);
  };

  return { message, isConfirming, showAlert, showConfirm, handleConfirm };
};
