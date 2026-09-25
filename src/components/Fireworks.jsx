const FIREWORK_PARTICLES = Array.from({ length: 8 }, (_, index) => ({
  angle: index * 45,
  distance: 20 + (index % 2) * 5,
}));

export default function Fireworks({ burst }) {
  if (!burst) return null;

  return (
    <div className="fireworks" style={{ left: burst.x, top: burst.y }} aria-hidden="true">
      {FIREWORK_PARTICLES.map(({ angle, distance }) => (
        <span
          key={angle}
          className="firework-spark"
          style={{ '--angle': `${angle}deg`, '--distance': `${distance}px` }}
        />
      ))}
    </div>
  );
}
