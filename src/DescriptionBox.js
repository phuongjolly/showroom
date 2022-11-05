export default function DescriptionBox({ data, handleShowDialog }) {
  return (
    <div className="description-box">
      <p>{data.id}</p>
      <p>{data.name}</p>
      <button onClick={() => handleShowDialog()}>Close</button>
    </div>
  );
}
