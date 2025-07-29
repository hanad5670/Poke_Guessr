interface Props {
  pokemonSil: string;
  showSilhouette: boolean;
  changeShowStatus: (show: boolean) => void;
}

const Silhouette: React.FC<Props> = ({
  pokemonSil,
  showSilhouette,
  changeShowStatus,
}) => {
  const handleShow = () => {
    changeShowStatus(!showSilhouette);
  };

  return (
    <div>
      <button onClick={handleShow}>Show Pokemon Silhoutte</button>
      {showSilhouette && (
        <div>
          <img id="pokemon-silhouette" src={pokemonSil} />
        </div>
      )}
    </div>
  );
};

export default Silhouette;
