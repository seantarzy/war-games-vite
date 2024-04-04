import CardDeck from "../CardDeck/CardDeck";
import PlayerCard from "../PlayerCard/PlayerCard";
function OpponentArea({
  compPlayer,
  battleInSession,
  flip,
}: {
  compPlayer: any;
  battleInSession: boolean;
  flip: boolean;
}) {
  return (
    <div>
      <CardDeck userDeck={false} />
      {battleInSession ? (
        <PlayerCard player={compPlayer} userPlayer={false} flip={flip} />
      ) : null}
    </div>
  );
}

export default OpponentArea;
