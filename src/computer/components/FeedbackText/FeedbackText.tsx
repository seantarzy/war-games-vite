import "../../../App.css";
function FeedbackText({ ...props }) {
  return (
    <div>
      {props.userWinsBattle ? (
        <h1 className="bg-white p-2 rounded-lg feedback-text-win text-lg md:text-4xl">
          Nice!
        </h1>
      ) : (
        <h1 className="bg-white p-2 rounded-lg feedback-text-loss text-lg md:text-4xl">
          Ouch!
        </h1>
      )}
    </div>
  );
}

export default FeedbackText;
