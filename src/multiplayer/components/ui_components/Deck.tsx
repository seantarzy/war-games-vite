import React, { memo, useMemo } from "react";
import {
  useSpring,
  animated,
  SpringValues,
  to as interpolateTo,
} from "@react-spring/web";
import CardBackImage from "../../../assets/war-games-back.jpeg";

import { Card } from "../../types";
import "./Deck.css";
import { BaseCardLayout } from "./BaseLayout";
export function CardBack() {
  return (
    <BaseCardLayout>
      <img
        src={CardBackImage}
        alt="card back"
        className="h-full w-full rounded-2xl"
      />
    </BaseCardLayout>
  );
}

export function CardInDeck({
  style,
  imgSrc,
}: {
  style?: React.CSSProperties;
  imgSrc?: string;
}) {
  return (
    <BaseCardLayout>
      <div
        style={{
          ...style,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
        }}
        className="rounded-lg h-full w-full overflow-hidden relative"
      ></div>
    </BaseCardLayout>
  );
}

export function CardStack({
  fromDirection,
  shuffleTrigger,
}: {
  fromDirection?: "left" | "right";
  shuffleTrigger?: boolean;
}) {
  const cardStyles = useMemo(() => {
    return new Array(10).fill(0).map((_, index) => ({
      zIndex: index,
      transform: `translate(${Math.random() * 10 - 5}px, ${
        index * -4
      }px) rotate(${Math.random() * 20 - 10}deg)`,
      left: `${index * -1}px`,
      animation: `slide-in-from-${fromDirection} ${
        0.5 + index * 0.1
      }s ease-out`,
      key: `${fromDirection}--${index}`,
    }));
  }, [fromDirection, shuffleTrigger]);

  return (
    <div className="relative flex flex-col h-full justify-center items-center">
      <div className="card-stack-container">
        {cardStyles.map((style, index) => (
          <CardInDeck key={style.key} style={style} imgSrc={CardBackImage} />
        ))}
      </div>
    </div>
  );
}
