import WarGamesLogo from "../assets/wargames-logo.webp";
import SeanTarzyLogo from "../assets/sean-tarzy-logo.webp";
import "../App.css";
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 background-image h-[100%] w-[100%]">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="hidden md:flex fixed bottom-0 left-0 h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 md:p-8 lg:pointer-events-auto lg:p-0"
            href="https://seantarzy.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={SeanTarzyLogo}
              alt="Sean Tarzy Logo"
              className="dark:invert rounded-md"
              width={75}
              height={50}
            />
          </a>
        </div>
      </div>

      <div className="hidden md: blockrelative md:flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <img
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert rounded-full hidden md:block"
          src={WarGamesLogo}
          alt="War Games Logo"
          width={180}
          height={37}
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-16 text-white p-4 text-md">
        <a
          href="/singleplayer"
          className="group rounded-lg border border-transparent px-2 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30  bg-slate-600"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 md:text-2xl font-semibold`}>
            Play Computer{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Play against the computer in a game of War.
          </p>
        </a>

        <a
          href="/multiplayer"
          className="group rounded-lg border border-transparent px-5 py-2 md:py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30  bg-slate-600"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 md:text-2xl font-semibold`}>
            Play Multiplayer
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Play a friend in a game of War.
          </p>
        </a>
      </div>
    </main>
  );
}
