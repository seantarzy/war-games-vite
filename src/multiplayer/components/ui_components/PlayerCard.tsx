import { useSpring, a } from "@react-spring/web";
import { Card } from "../../types";
import { BaseCardLayout } from "./BaseLayout";
import { CardBack } from "./Deck";

export function PlayerCard({
  player,
  side,
  flipped,
}: {
  player: Card;
  side: "current" | "opponent";
  flipped: boolean; // This prop determines if the card is flipped to show the back
}) {
  // Spring animation for flipping
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: flipped ? `perspective(600px) rotateY180deg)` : "none",
    config: { mass: 5, tension: 500, friction: 80 },
    delay: 100,
  });

  return (
    <BaseCardLayout>
      <div className="relative w-full h-full">
        {/* Front side of the card */}
        <a.div
          className="will-change-transform absolute w-full h-full bg-blue-600 border-gray-100 border-2 flex flex-col justify-center items-center rounded-lg"
          style={{
            opacity: opacity.to((o: any) => 1 - o),
            transform,
          }}
        >
          <h2>{player.name}</h2>
          <img
            src={player.image}
            alt={player.name}
            className="w-[90%] h-[80%]"
          />
          <div>WAR: {player.war}</div>
        </a.div>
        <a.div
          className="will-change-transform absolute w-full h-full rounded-lg"
          style={{
            opacity,
            transform: transform.to((t: any) => `${t} rotateY(180deg)`),
          }}
        >
          <CardBack />
        </a.div>
      </div>
    </BaseCardLayout>
  );
}
