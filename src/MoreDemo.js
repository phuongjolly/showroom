import "./Kitchen/Kitchen.css";
import Carousel from "./Carousel";
import "./Carousel.css";

export default function MoreDemo() {
  const data = [
    {
      id: 0,
      title: "Solar system demo",
      description:
        "It's about a a solar system. That allows you can travel around the galaxy",
    },
    {
      id: 1,
      title: "Solar system demo",
      description:
        "It's about a a solar system. That allows you can travel around the galaxy",
    },
    {
      id: 2,
      title: "Solar system demo",
      description:
        "It's about a a solar system. That allows you can travel around the galaxy",
    },
    {
      id: 3,
      title: "Solar system demo",
      description:
        "It's about a a solar system. That allows you can travel around the galaxy",
    },
  ];

  const colors = ["red", "dark-green", "yellow", "green"];
  return (
    <div className={"carousel"}>
      {data.length > 0 &&
        data.map((item) => (
          <Carousel key={`ca-${item.id}`} color={colors[item.id]} data={item} />
        ))}
    </div>
  );
}
