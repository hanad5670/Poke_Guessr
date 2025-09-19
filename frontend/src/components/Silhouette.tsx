interface Props {
  pokemonSil: string;
  showSilhouette: boolean;
  changeShowStatus: (show: boolean) => void;
  isGameOver: boolean;
}

const Silhouette: React.FC<Props> = ({
  pokemonSil,
  showSilhouette,
  changeShowStatus,
  isGameOver,
}) => {
  const handleShow = () => {
    changeShowStatus(!showSilhouette);
  };

  return (
    <div className="text-center py-8">
      {/* Show Img Button */}
      <button
        onClick={handleShow}
        className="bg-pokemon-yellow text-pokemon-black font-bold py-4 px-8 rounded-lg border-4 border-gray-900 hover:bg-pokemon-red hover:text-pokemon-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <img
            src="/pikachu-silhouette.svg"
            alt="Pikachu-Silhouette"
            className="w-10 h-10"
          />
          <span className="font-extrabold">
            {showSilhouette ? "Hide Silhouette" : "Show Silhouette"}
          </span>
        </div>
      </button>

      <div className="w-64 h-64 mx-auto bg-pokemon-gray border-4 border-gray-900 rounded-lg flex items-center justify-center shadow-lg mt-8">
        {showSilhouette || isGameOver ? (
          <div>
            <img
              id="pokemon-silhouette"
              className="w-50 h-50"
              src={pokemonSil}
            />
          </div>
        ) : (
          <span className="text-pokemon-yellow text-8xl">?</span>
        )}
      </div>
    </div>
  );
};

export default Silhouette;
