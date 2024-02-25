import { useSprings, animated, to as interpolate } from "@react-spring/web";

import "./RainingDeck.css";
import CardBackImage from "../../../assets/war-games-back.jpeg";
import { BaseCardLayout } from "./BaseLayout";

export const TIME_TO_MAKE_IT_RAIN: number = 2000;
const RAIN_BUFFER: number = 1000;
const DECK_SIZE = 20;
const cards = Array.from({ length: DECK_SIZE }, (_, i) => CardBackImage);

// These two are just helpers, they curate spring data, values that are later being interpolated into css

function RainingDeck({ raining }: { raining: boolean }) {
  const from = (_i: number) => ({
    x: 0,
    rot: 0,
    scale: raining ? 1.5 : 0.5,
    y: -1000,
  });
  // This is being used down there in the view, it interpolates rotation and scale into a css transform
  const trans = (r: number, s: number) =>
    `perspective(1500px) rotateX(30deg) rotateY(${
      r / 10
    }deg) rotateZ(${r}deg) scale(${s})`;
  const to = (i: number) => ({
    x: 0,
    y: i * -4,
    scale: 1,
    rot: -10 + Math.random() * 20,
    delay: raining ? i * ((TIME_TO_MAKE_IT_RAIN - RAIN_BUFFER) / DECK_SIZE) : 0,
  });
  const [props, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity

  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <BaseCardLayout>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div
          className={"deck"}
          key={i}
          style={raining ? { x, y } : { x: 0, y: 0 }}
        >
          <animated.div
            style={{
              transform: raining ? interpolate([rot, scale], trans) : "none",
              backgroundImage: `url(${cards[i]})`,
              backgroundSize: "cover",
            }}
          />
        </animated.div>
      ))}
    </BaseCardLayout>
  );
}

export default RainingDeck;
