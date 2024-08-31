import { useEffect, useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { answers } from "./data/answers";
import { validWords } from "./data/validWords";

enum GuessStatus {
  Correct = "CORRECT",
  Present = "PRESENT",
  Absent = "ABSENT",
}

const answer = answers[Math.floor(Math.random() * answers.length)];

console.log(answer);

function App() {
  const [guess, setGuess] = useState<string>("");
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [previousGuessStatuses, setPreviousGuessStatuses] = useState<
    GuessStatus[][]
  >([]);

  useEffect(() => {
    function checkWord(guess: string) {
      const result: GuessStatus[] = new Array(5).fill(null);
      const answerArray = [...answer];
      console.log(answerArray);

      // FIRST, check for letters that are in word AND in correct position
      for (let i = 0; i < 5; i++) {
        if (guess[i] === answerArray[i]) {
          answerArray[i] = "x";
          result[i] = GuessStatus.Correct;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (result[i] !== GuessStatus.Correct) {
          // THEN, check for letters that are in word but in wrong position
          if (answerArray.includes(guess[i])) {
            // Create a new variable to find position of the same letter in the answer word
            const j = answerArray.indexOf(guess[i]);
            // Update position [j] in the answer word to avoid duplicates when comparing
            answerArray[j] = "*";
            result[i] = GuessStatus.Present;
          }
        }
      }

      console.log(answerArray);

      for (let i = 0; i < 5; i++) {
        if (
          result[i] !== GuessStatus.Correct &&
          result[i] !== GuessStatus.Present
        ) {
          // LAST, check for letters that are not in word
          answerArray[i] = "_";
          result[i] = GuessStatus.Absent;
        }
      }

      console.log(answerArray);

      setPreviousGuessStatuses((prevStatuses) => [...prevStatuses, result]);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;

      if (key >= "a" && key <= "z" && key.length === 1 && guess.length < 5) {
        setGuess((prevGuess) => prevGuess + key);
      } else if (key === "Backspace") {
        setGuess(guess.slice(0, -1));
      } else if (
        key === "Enter" &&
        guess.length === 5 &&
        (validWords.includes(guess) || answers.includes(guess))
      ) {
        setPreviousGuesses((prevGuesses) => [...prevGuesses, guess]);
        checkWord(guess);
        setGuess("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess]);

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
                    className={twMerge(
                      clsx(
                        `flex aspect-square w-16 items-center justify-center border-2 border-neutral-200 bg-white text-4xl font-bold uppercase dark:border-neutral-800 dark:bg-neutral-900 dark:text-white`,
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
                      ),
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
