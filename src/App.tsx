import { useState } from "react";
import { useEffect } from "react";
import clsx from "clsx";

function App() {
  const answer = "jelly";
  const [guess, setGuess] = useState<string>("");
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [guessState, setGuessState] = useState<string[]>([]);

  function checkWord(guess: string) {
    const updatedGuess = [...guess];
    const updatedAnswer = [...answer];

    console.log(`Answer: \n${[...answer]}`);
    console.log(`Guess: \n${[...guess]}`);

    // Check for perfect matches
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        updatedAnswer[i] = "X";
        updatedGuess[i] = "X";
      }
    }

    console.log(`UPDATED GUESS | Checked Xs: \n${updatedGuess}`);
    console.log(`UPDATED ANSWER | Checked Xs: \n${updatedAnswer}`);

    // Check for wrong positions
    for (let i = 0; i < 5; i++) {
      console.log(updatedAnswer);
      if (
        updatedGuess[i] !== "_" &&
        updatedGuess[i] !== "X" &&
        updatedGuess[i] !== "*"
      ) {
        if (updatedAnswer.includes(updatedGuess[i])) {
          // this changes any letter in answer
          // should change letter that is the same as letter in answer
          // change value OF {string} AT [index] IN updatedANswer
          const j = updatedAnswer.indexOf(updatedGuess[i]);
          updatedAnswer[j] = "*";
          updatedGuess[i] = "*";
        }
      }
      console.log(updatedAnswer);
    }

    console.log(`UPDATED GUESS | Checked *s: \n${updatedGuess}`);
    console.log(`UPDATED ANSWER | Checked *s: \n${updatedAnswer}`);

    // Check for non-existent letters
    for (let i = 0; i < 5; i++) {
      const answerLetterCount = updatedAnswer.filter(
        (l) => l === updatedAnswer[i],
      ).length;
      const guessLetterCount = updatedGuess.filter(
        (l) => l === updatedGuess[i],
      ).length;

      if (
        updatedGuess[i] !== "_" &&
        updatedGuess[i] !== "X" &&
        updatedGuess[i] !== "*"
      ) {
        if (
          answerLetterCount < guessLetterCount ||
          !updatedAnswer.includes(updatedGuess[i])
        ) {
          updatedGuess[i] = "_";
        }
      }
    }

    console.log(`UPDATED GUESS | Checked _s: \n${updatedGuess}`);
    console.log(`UPDATED ANSWER | Checked _s: \n${updatedAnswer}`);

    return updatedGuess.join("");
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;

      if (key >= "a" && key <= "z" && key.length === 1 && guess.length < 5) {
        setGuess((prevGuess) => prevGuess + key);
      } else if (key === "Backspace") {
        setGuess(guess.slice(0, -1));
      } else if (key === "Enter" && guess.length === 5) {
        setGuessState((prevStates) => [...prevStates, checkWord(guess)]);
        setPreviousGuesses((prevGuesses) => [...prevGuesses, guess]);
        setGuess("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess]);

  // useEffect(() => {
  //   console.log(previousGuesses);
  // }, [previousGuesses]);

  return (
    <>
      <div className="mx-auto mt-12 flex max-w-md flex-col gap-2">
        {Array(6)
          .fill(null)
          .map((_, row) => (
            // Row
            <div className="flex gap-2">
              {Array(5)
                .fill(null)
                .map((_, letter) => (
                  // Tile
                  <div
                    className={clsx(
                      `flex aspect-square w-16 items-center justify-center border-2 bg-white text-4xl font-bold uppercase dark:border-neutral-800 dark:bg-neutral-900 dark:text-white`,
                      {
                        "border-green-700 bg-green-600 text-white dark:border-green-600 dark:bg-green-700":
                          guessState?.[row]?.[letter] === "X",
                      },
                      {
                        "border-yellow-700 bg-yellow-500":
                          guessState?.[row]?.[letter] === "*",
                      },
                      {
                        "border-neutral-400 bg-neutral-300":
                          guessState?.[row]?.[letter] === "_",
                      },
                    )}
                  >
                    {previousGuesses.length === row
                      ? guess[letter]
                      : previousGuesses?.[row]?.[letter]}
                  </div>
                ))}
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
