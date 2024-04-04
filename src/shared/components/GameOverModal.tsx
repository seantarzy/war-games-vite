import { useState } from "react";

const GameOverModal = ({
  isOpen,
  winner,
  onRestart,
  onExit,
  onClose,
  winnerScore,
  loserScore,
}: {
  isOpen: boolean;
  winner: string;
  onRestart: () => void;
  onExit: () => void;
  onClose: () => void;
  winnerScore: number;
  loserScore: number;
}) => {
  if (!isOpen) return null;
  const [rematchRequested, setRematchRequested] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-slate-400 p-4 rounded-lg shadow-lg flex flex-col items-center w-4/5 md:w-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {rematchRequested ? (
          <p className="mb-8">Rematch Requested...</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="mb-8">
              {winner === "you"
                ? `
                You won with a score of ${winnerScore} to ${loserScore}! 🎉
              `
                : winner === "tie"
                ? `
                It's a tie! Play again?
              `
                : `
                You lost with a score of ${winnerScore} to ${loserScore}. 😢
              `}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setRematchRequested(true);
                  onRestart();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-150 ease-in-out"
              >
                Rematch
              </button>
              <button
                onClick={onExit}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-150 ease-in-out"
              >
                Exit to Main Menu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameOverModal;
