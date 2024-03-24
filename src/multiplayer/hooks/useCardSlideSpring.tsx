import { useSpring } from "@react-spring/web";

export const useCardSlideSpring = ({
  currentReady,
  opponentReady,
  timeToSlide,
}: {
  currentReady: boolean;
  opponentReady: boolean;
  timeToSlide: number;
}) => {
  const currentWindowWidthSlideTravel =
    window.innerWidth > 768 ? "-30vw" : "-6vw";
  const currentWindowHeightSlideTravel =
    window.innerWidth > 768 ? "-21vh" : "-8vh";
  const currentSlideIn = useSpring({
    to: {
      transform: currentReady
        ? `translate(${currentWindowWidthSlideTravel}, ${currentWindowHeightSlideTravel})`
        : "translate(0vw, 0vh)", // Returns the card to its original position
    },
    from: { transform: "translate(0vw, 0vh)" },
    config: { duration: timeToSlide },
    onResolve(result, _ctrl, _item) {
      if (result && result.finished) {
      }
    },
  });

  const oppWindowWidthSlideTravel = window.innerWidth > 768 ? "30vw" : "21vw";
  const oppWindowHeightSlideTravel = window.innerWidth > 768 ? "12vh" : "8vh";

  const opponentSlideIn = useSpring({
    to: {
      transform: opponentReady
        ? `translate(${oppWindowWidthSlideTravel}, ${oppWindowHeightSlideTravel})`
        : "translate(0vw, 0vh)", // Returns the card to its original position once the animation is done
    },
    from: { transform: "translate(0vw, 0vh)" },
    config: { duration: timeToSlide },
    // Only start the animation if the opponent's card is being sent (oppCardInMiddle is true) and the battle isn't ready
  });
  return { currentSlideIn, opponentSlideIn };
};
