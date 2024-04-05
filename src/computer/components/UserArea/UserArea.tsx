import { BaseballButton } from "../../../multiplayer/components/ui_components/Button";
import { Card } from "../../../multiplayer/types";
import CardDeck from "../CardDeck/CardDeck";
import PlayerCard from "../PlayerCard/PlayerCard";
import { useIsMobile } from "../../../shared/hooks/useIsMobile";
function UserArea({
  onDealCard,
  userPlayer,
  flip,
  cardsRevealed,
  gameStart,
  battleInSession,
  gameOver,
}: {
  onDealCard: () => void;
  userPlayer: Card;
  flip: boolean;
  cardsRevealed: boolean;
  gameStart: boolean;
  score: number;
  battleInSession: boolean;
  gameOver: boolean;
}) {
  const btnEnabled = cardsRevealed || !gameStart;
  const isMobile = useIsMobile();
  return (
    <>
      <div className="absolute top-[80%] left-1/4 z-[1000] md:top-2/3  md:left-3/4 mt-4 md:translate-x-0 translate-x-[-1/2]">
        {!gameOver && (
          <BaseballButton
            disabled={!btnEnabled}
            onClick={onDealCard}
            excludeIcon={isMobile}
            className="w-40 md:h-auto h-12 text-sm md:text-inherit "
          >
            <div className="">Deal Card</div>
          </BaseballButton>
        )}
      </div>
      <div className="absolute md:top-2/3 left-3/4">
        <div className=" md:mr-4 mr-16">
          <div className="md:mr-auto md:left-auto left-96"></div>
        </div>
        <section className="user-area">
          {battleInSession ? (
            <PlayerCard player={userPlayer} userPlayer={true} flip={flip} />
          ) : null}
          <CardDeck userDeck={true} />
        </section>
      </div>
    </>
  );
}

export default UserArea;
