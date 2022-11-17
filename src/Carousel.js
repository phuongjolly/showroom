import "./Carousel.css";
export default function Carousel({ data, color }) {
  return (
    <div className={`carousel-item ${color}`}>
      <div className="title">{data.title}</div>
      <div className="description">{data.description}</div>
      <a>Next</a>
    </div>
  );
}
