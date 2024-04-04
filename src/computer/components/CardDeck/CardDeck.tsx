import "bootstrap/dist/css/bootstrap.min.css";

function CardDeck({ userDeck }: { userDeck: boolean }) {
  return <div className={userDeck ? "user-deck" : "opponent-deck"}></div>;
}

export default CardDeck;
