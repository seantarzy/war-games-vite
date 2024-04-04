import { useEffect, useState } from "react";
import { Card, Image } from "react-bootstrap";
import { Card as CardType } from "../../../multiplayer/types";
import baseballCardBack from "../../../assets/war-games-baseball-card-back.png";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";
function PlayerCard({
  userPlayer,
  flip,
  player,
}: {
  userPlayer: boolean;
  flip: boolean;
  player: CardType;
}) {
  const isMobile = useIsMobile();

  const [viewStats, setViewStats] = useState(false);

  const flipToStats = () => {
    setViewStats(true);
  };
  const flipBackToFront = () => {
    setViewStats(false);
  };

  useEffect(() => {
    setViewStats(false);
  }, []);

  return (
    <div
      className={userPlayer ? "user-player-card" : "computer-player-card"}
      style={
        isMobile
          ? { width: "8rem", height: "6rem" }
          : { width: "10rem", height: "11rem" }
      }
    >
      {flip && !viewStats ? (
        <Card className="baseball-card-front p-2 md:p-6" onClick={flipToStats}>
          <div className="text-flip">
            <div className="text-md">
              {player.name.length > 12
                ? player.name.slice(0, 12) + "..."
                : player.name}
            </div>
          </div>
          <Image
            className="card-image md:w-full md:h-4/5 h-3/4"
            src={player.image}
          />
          <div className="text-flip">
            <div>War: {player.war}</div>
          </div>
        </Card>
      ) : flip && viewStats ? (
        <Card className="baseball-card-full-stats" onClick={flipBackToFront}>
          <Card.Header className="card-Header">{player.name}</Card.Header>
          <Card.Subtitle>Career Stats</Card.Subtitle>
          {player.role === "hitter" ? (
            <div className="stats">
              <div>Runs: {player.runs}</div>
              <div>Hits: {player.hits}</div>
              <div>Hrs: {player.hr}</div>
              <div>RBI: {player.rbi}</div>
              <div>Avg: {player.avg}</div>
            </div>
          ) : (
            <div className="stats">
              <div>W: {player.wins}</div>
              <div>L: {player.losses}</div>
              <div>ERA: {player.era}</div>
              <div>SO: {player.strikeouts}</div>
              <div>Sv: {player.saves}</div>
            </div>
          )}
        </Card>
      ) : !flip ? (
        <Card className="baseball-card-back p-0">
          <Image className="w-full h-full" src={baseballCardBack} />
        </Card>
      ) : null}
    </div>
  );
}

export default PlayerCard;
