import './CircuitBoard.css';

interface CircuitBoardProps {
  className?: string;
}

export default function CircuitBoard({ className = '' }: CircuitBoardProps) {
  return (
    <div
      className={`circuit-bg ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
}
