import { useSpring, animated } from "@react-spring/web";

export function AnimatedText({
  text,
  roundWinner,
}: {
  text: string;
  roundWinner: "tie" | boolean | null;
}) {
  const spring = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
  });

  return (
    <animated.div
      style={spring}
      className={`${!!roundWinner ? " text-blue-400 " : " text-red-400 "}
      } text-4xl font-bold text-center mt-4 mb-4 bg-black rounded-lg p-2`}
    >
      {text}
    </animated.div>
  );
}
