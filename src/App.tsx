import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";

function App() {
  const answer = "jelly";

  enum GuessStatus {
    Correct = "CORRECT",
    Present = "PRESENT",
    Absent = "ABSENT",
  }

  const [guess, setGuess] = useState<string>("");
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [previousGuessStatuses, setPreviousGuessStatuses] = useState<
    GuessStatus[][]
  >([]);

  const checkWord = useCallback(
    (guess: string): GuessStatus[] => {
      const result: GuessStatus[] = new Array(5).fill(null);
      const guessArray = [...guess];
      const answerArray = [...answer];

      // FIRST, check for letters that are in word AND in correct position
      for (let i = 0; i < 5; i++) {
        if (guessArray[i] === answerArray[i]) {
          answerArray[i] = "";
          guessArray[i] = "";
          result[i] = GuessStatus.Correct;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (guessArray[i] !== "") {
          // THEN, check for letters that are in word but in wrong position
          if (answerArray.includes(guessArray[i])) {
            // updatedAnswer[i] could return a different letter than updatedGuess[i]
            // Therefore, create a new variable to find position of the same letter in the answer word
            const j = answerArray.indexOf(guessArray[i]);

            // Update position [j] in the answer word to avoid duplicates when comparing
            answerArray[j] = "";

            guessArray[i] = "";

            result[i] = GuessStatus.Present;
          } else {
            // LAST, check for letters that are not in word
            guessArray[i] = "";
            result[i] = GuessStatus.Absent;
          }
        }
      }

      return result;
    },
    [GuessStatus],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;

      if (key >= "a" && key <= "z" && key.length === 1 && guess.length < 5) {
        setGuess((prevGuess) => prevGuess + key);
      } else if (key === "Backspace") {
        setGuess(guess.slice(0, -1));
      } else if (key === "Enter" && guess.length === 5) {
        setPreviousGuesses((prevGuesses) => [...prevGuesses, guess]);
        setPreviousGuessStatuses((prevStates) => [
          ...prevStates,
          checkWord(guess),
        ]);
        setGuess("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess, checkWord]);

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
                          previousGuessStatuses?.[row]?.[letter] ===
                          GuessStatus.Correct,
                      },
                      {
                        "border-yellow-700 bg-yellow-500 dark:border-yellow-500 dark:bg-yellow-600":
                          previousGuessStatuses?.[row]?.[letter] ===
                          GuessStatus.Present,
                      },
                      {
                        "border-neutral-400 bg-neutral-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-500":
                          previousGuessStatuses?.[row]?.[letter] ===
                          GuessStatus.Absent,
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
