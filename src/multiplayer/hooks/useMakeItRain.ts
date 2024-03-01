import React, { useEffect } from "react";

export const useMakeItRain = (timeToMakeItRain: number) => {
  const [makeItRain, setMakeItRain] = React.useState(false);

  const toggleMakeItRain = () => {
    setMakeItRain(!makeItRain);
  };

  //   upon mount set makeItRain to true

  useEffect(() => {
    setMakeItRain(true);
  }, []);

  //   if makeItRain is true, set a timeout to set makeItRain to false after timeToMakeItRain
  useEffect(() => {
    if (makeItRain) {
      setTimeout(() => {
        setMakeItRain(false);
      }, timeToMakeItRain);
    }
  }, [makeItRain]);

  return { makeItRain, toggleMakeItRain };
};
