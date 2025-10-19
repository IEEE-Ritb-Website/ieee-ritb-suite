import type {ReactNode} from 'react';
import './ParallaxLayer.css';

interface ParallaxLayerProps {
  speed?: number;
  children?: ReactNode;
  className?: string;
  zIndex?: number;
}

export default function ParallaxLayer({
  speed = 0.5,
  children,
  className = '',
  zIndex = -1
}: ParallaxLayerProps) {
  return (
    <div
      className={`parallax-layer ${className}`}
      data-parallax={speed}
      style={{ zIndex }}
    >
      {children}
    </div>
  );
}
