import { useEffect, useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { answers } from "./data/answers";
import { validWords } from "./data/validWords";
import bevelUrl from "./assets/Bevel.svg";

enum GuessStatus {
  Correct = "CORRECT",
  Present = "PRESENT",
  Absent = "ABSENT",
}

// The game can be won and lost
// The game can be in progress and finished

type GameState = "running" | "finished";

function App() {
  const [answer, setAnswer] = useState(() => getAnswer());
  const [gameState, setGameState] = useState<GameState>("running");
  const [currentAttempt, setCurrentAttempt] = useState<number>(1);
  const [guess, setGuess] = useState<string>("");
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [previousGuessStatuses, setPreviousGuessStatuses] = useState<
    GuessStatus[][]
  >([]);

  function getAnswer() {
    const answer = answers[Math.floor(Math.random() * answers.length)];
    console.log(answer);
    return answer;
  }

  function handleRestart() {
    setCurrentAttempt(1);
    setPreviousGuesses([]);
    setPreviousGuessStatuses([]);
    setAnswer(getAnswer());
    setGameState("running");
  }

  useEffect(() => {
    if (currentAttempt > 6) {
      setGameState("finished");
    }

    function checkWord(guess: string) {
      const result: GuessStatus[] = new Array(5).fill(null);
      const answerArray = [...answer];

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

      setPreviousGuessStatuses((prevStatuses) => [...prevStatuses, result]);

      if (
        !result.includes(GuessStatus.Present) &&
        !result.includes(GuessStatus.Absent)
      ) {
        setGameState("finished");
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;

      if (gameState === "running") {
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
          setCurrentAttempt((prev) => prev + 1);
          setGuess("");
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess, currentAttempt, answer, gameState]);

  return (
    <>
      {gameState === "finished" && (
        <div className="fixed z-50 flex h-full w-full flex-col items-center justify-center gap-8 bg-black/70">
          <h1 className="text-3xl font-bold tracking-tight dark:text-white">
            Game finished
          </h1>
          <button
            onClick={handleRestart}
            className="max-w-fit select-none rounded-xl px-4 py-2 font-bold text-white shadow-[0px_6px_black] shadow-green-800 transition-all active:translate-y-1 active:shadow-[0px_4px_black] active:shadow-green-800 dark:bg-green-600"
          >
            Restart?
          </button>
        </div>
      )}
      <div className="relative mx-auto flex w-fit flex-col gap-5 pt-40">
        {Array(6)
          .fill(null)
          .map((_, row) => (
            // Row
            <div
              className={twMerge(
                clsx("flex gap-1", {
                  "opacity-50": previousGuesses.length < row,
                }),
              )}
            >
              {Array(5)
                .fill(null)
                .map((_, letter) => (
                  // Tile
                  <div
                    className={twMerge(
                      clsx(
                        `relative box-content flex aspect-square h-16 w-16 items-center justify-center bg-white text-4xl font-extrabold uppercase shadow-[0px_8px_0px_white] ring-2 ring-inset ring-neutral-400 transition-all first:rounded-l-xl last:rounded-r-xl dark:bg-neutral-800 dark:text-neutral-200 dark:shadow-neutral-800 dark:ring-2 dark:ring-inset dark:ring-white/[0.075]`,
                        {
                          "bg-green-600 text-white dark:bg-green-700 dark:shadow-green-900":
                            previousGuessStatuses?.[row]?.[letter] ===
                            GuessStatus.Correct,
                        },
                        {
                          "bg-yellow-500 dark:bg-yellow-600 dark:shadow-yellow-800":
                            previousGuessStatuses?.[row]?.[letter] ===
                            GuessStatus.Present,
                        },
                        {
                          "bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-600 dark:shadow-neutral-800":
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

/*
<img
  src={bevelUrl}
  className={twMerge(
    clsx(
      "absolute -left-[7px] -top-[3px] -z-10 min-h-fit min-w-fit touch-none select-none",
      {
        "-top-[5px]":
          previousGuessStatuses?.[row]?.[letter] !==
          GuessStatus.Correct,
      },
    ),
  )}
/>
*/
