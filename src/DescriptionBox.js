export default function DescriptionBox({
  data,
  handleShowDialog,
  setRotate,
  reset,
}) {
  const nameMapping = {
    Sun_SUN_0: "Sun",
    Jupiter1_JUPITER_0: "Jupiter",
    Mars1_MARS_0: "Mars",
    Uranus1_URANUS_0: "Uranus",
    Saturn1_SATURN_0: "Saturn",
    Earth1_EARTH_0: "Earth",
    Neptune1_NEPTUNE_0: "Neptune",
    Venus1_VENUS_0: "Venus",
  };
  return (
    <div className="description-box">
      <p>{nameMapping[data.name]}</p>
      <button onClick={() => setRotate()}>Rotate</button>
      <button onClick={() => reset()}>View System</button>
      <button onClick={() => handleShowDialog()}>Close</button>
    </div>
  );
}
