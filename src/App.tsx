import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [guess, setGuess] = useState<string>("");
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;

      if (key >= "a" && key <= "z" && key.length === 1 && guess.length < 5) {
        setGuess((prevGuess) => prevGuess + key);
      } else if (key === "Backspace") {
        setGuess(guess.slice(0, -1));
      } else if (key === "Enter" && guess.length === 5) {
        setPreviousGuesses((prevGuesses) => [...prevGuesses, guess]);
        setGuess("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess]);

  useEffect(() => {
    console.log(previousGuesses);
  }, [previousGuesses]);

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
                  <div className="flex aspect-square w-16 items-center justify-center border-2 bg-white text-3xl font-bold uppercase">
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
