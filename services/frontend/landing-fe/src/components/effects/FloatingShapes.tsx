import './FloatingShapes.css';

interface FloatingShapesProps {
  count?: number;
  className?: string;
}

export default function FloatingShapes({ count = 6, className = '' }: FloatingShapesProps) {
  const shapes = [
    { type: 'circle', size: 120, color: 'rgba(77, 127, 255, 0.1)', speed: 0.3, top: '10%', left: '5%' },
    { type: 'square', size: 80, color: 'rgba(0, 180, 255, 0.08)', speed: 0.5, top: '25%', right: '10%' },
    { type: 'circle', size: 150, color: 'rgba(139, 92, 246, 0.06)', speed: 0.4, top: '60%', left: '15%' },
    { type: 'triangle', size: 100, color: 'rgba(77, 127, 255, 0.1)', speed: 0.6, top: '40%', right: '20%' },
    { type: 'square', size: 60, color: 'rgba(0, 180, 255, 0.12)', speed: 0.35, top: '75%', right: '5%' },
    { type: 'circle', size: 90, color: 'rgba(107, 140, 255, 0.09)', speed: 0.45, top: '85%', left: '40%' },
  ].slice(0, count);

  return (
    <div className={`floating-shapes ${className}`} aria-hidden="true">
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`floating-shape floating-shape-${shape.type}`}
          data-parallax={shape.speed}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            background: shape.color,
            top: shape.top,
            left: shape.left,
            right: shape.right,
          }}
        />
      ))}
    </div>
  );
}
