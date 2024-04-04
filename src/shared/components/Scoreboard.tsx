import ScoreIcon from "../../assets/war-games-score-icon.png";

export function ScoreBoard({
  myScore,
  oppScore,
}: {
  myScore: number;
  oppScore: number;
}) {
  return (
    <div className="bg-slate-950 md:text-lg justify-center w-2/3 md:w-2/5 m-2 rounded-lg text-white">
      <div className="flex justify-between border-b-2 p-2 md:p-4 h-16 md:h-20 w-full items-center">
        <div className="flex h-full w-full items-center gap-2">
          <img src={ScoreIcon} alt="score icon" className="h-4/5" />
          <div className="text-sm md:text-xl">Your Score</div>
        </div>
        <div className="mr-4 md:text-xl text-sm">{myScore}</div>
      </div>
      <div className="flex justify-between p-2 md:p-4 h-16 md:h-20 w-full items-center">
        <div className="flex h-full w-full items-center gap-2">
          <img src={ScoreIcon} alt="score icon" className="h-4/5" />
          <div className="text-sm md:text-xl">Opponent Score</div>
        </div>
        <div className="mr-4 md:text-xl text-sm">{oppScore}</div>
      </div>
    </div>
  );
}
