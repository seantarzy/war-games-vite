import { BaseballButton } from "../../../multiplayer/components/ui_components/Button";
import { Card } from "../../../multiplayer/types";
import CardDeck from "../CardDeck/CardDeck";
import PlayerCard from "../PlayerCard/PlayerCard";

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
  return (
    <>
      <div className="fixed top-1/3 left-2/4 z-[1000] md:top-2/3 md:left-3/4 ">
        {!gameOver && (
          <BaseballButton
            disabled={!btnEnabled}
            onClick={onDealCard}
            excludeIcon={true}
            className="md:w-40 w-20 md:h-auto h-10 text-sm md:text-inherit "
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
