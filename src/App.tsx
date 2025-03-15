import { useEffect, useState } from "react";
import lock from "./assets/lock.png";
import unlock from "./assets/unlock.png";

const MAFIA_COUNT = 2;
const SHERIFF_COUNT = 1;
const INITIAL_LENGTH = 7;

export default function App() {
  const [mafia, setMafia] = useState(MAFIA_COUNT);
  const [locked, setLocked] = useState(false);
  const [likar, setLikar] = useState(true);

  const [players, setPlayers] = useState(
    Array.from({ length: INITIAL_LENGTH }, (_, i) => ({
      id: i + 1,
      name: `Гравець ${i + 1}`,
      role: "",
    }))
  );

  useEffect(() => {
    resetRoles();
  }, [players.length, mafia, likar]);

  const addPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: `Гравець ${prev.length + 1}`,
        role: "",
      },
    ]);
  };

  const removePlayer = () => {
    setPlayers((prev) => prev.slice(0, -1));
  };

  const resetRoles = () => {
    const resetedPlayers = players.map((player) => ({ ...player, role: "" }));
    setPlayers(resetedPlayers);
  };

  const assignRoles = () => {
    const shuffledPlayers = [...players];
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [
        shuffledPlayers[j],
        shuffledPlayers[i],
      ];
    }

    const updatedPlayers = shuffledPlayers.map((player, index) => {
      if (index < 1) return { ...player, role: "Дон" };
      if (index < mafia) return { ...player, role: "Мафія" };
      if (index < mafia + SHERIFF_COUNT) return { ...player, role: "Шериф" };
      if (likar && index < mafia + SHERIFF_COUNT + 1)
        return { ...player, role: "Лікар" };

      return { ...player, role: "Мирний" };
    });

    setPlayers(updatedPlayers.sort((a, b) => a.id - b.id));
  };
  return (
    <div className="select-none px-8 flex flex-col items-center ">
      <div className="sm:relative w-full flex justify-center items-start gap-4">
        <img
          src={locked ? lock : unlock}
          className="sm:absolute top-0 left-0 z-10 w-8 h-8 cursor-pointer"
          onClick={() => setLocked((prev) => !prev)}
        />
        <div
          className={`flex text-lg sm:text-2xl justify-center items-start gap-8 w-full ${
            locked && "pointer-events-none"
          } ${locked && "opacity-20"}`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              Лікар:
              <div className="flex gap-4">
                <div className="flex gap-1">
                  <input
                    type="radio"
                    checked={likar}
                    onChange={() => setLikar((prev) => !prev)}
                    id="eLikar"
                  />
                  <label htmlFor="eLikar">Є</label>
                </div>
                <div className="flex gap-1">
                  <input
                    type="radio"
                    checked={!likar}
                    onChange={() => setLikar((prev) => !prev)}
                    id="nemaLikar"
                  />
                  <label htmlFor="nemaLikar">Нема</label>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <span>Гравців:</span>
              <div className="flex gap-1">
                <button
                  className="cursor-pointer"
                  onClick={removePlayer}
                  disabled={players.length == 1}
                >
                  -
                </button>
                <span>{players.length}</span>
                <button className="cursor-pointer" onClick={addPlayer}>
                  +
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <span>К-сть мафії: </span>
              <div className="flex gap-1">
                <button
                  className="cursor-pointer"
                  onClick={() => setMafia((prev) => prev - 1)}
                  disabled={mafia == 1}
                >
                  -
                </button>
                <span>{mafia}</span>
                <button
                  className="cursor-pointer"
                  onClick={() => setMafia((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={assignRoles} className="cursor-pointer">
              Роздати ролі
            </button>
            <button onClick={resetRoles} className="cursor-pointer">
              Скинути ролі
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 mt-12">
        {players.map((player) => (
          <div
            key={player.id}
            className="border-b-2 border-cyan-600 flex gap-2"
          >
            <span className="w-36">{player.name}</span>
            <span>{player.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
