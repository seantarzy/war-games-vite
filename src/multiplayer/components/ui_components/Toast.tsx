import React, { useState, useEffect } from "react";

const TOAST_TIMEOUT = 10000000;

interface ToastProps {
  rematchRequestReceived: boolean;
  onAccept: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  rematchRequestReceived,
  onAccept,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (rematchRequestReceived) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, TOAST_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [rematchRequestReceived]);

  const acceptRematch = () => {
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-slate-600 border border-gray-300 rounded-lg shadow-lg p-4 z-50 text-white">
      <div className="font-bold text-lg">Rematch Request</div>
      <div className="text-md mt-2">
        You've received a rematch request!
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={acceptRematch}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
