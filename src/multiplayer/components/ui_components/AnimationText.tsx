import { useSpring, animated } from "@react-spring/web";

export function AnimatedText({ text }: { text: string }) {
  const spring = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
  });

  return (
    <animated.div
      style={spring}
      className="text-4xl text-blue-800 font-bold text-center mt-4 mb-4"
    >
      {text}
    </animated.div>
  );
}
