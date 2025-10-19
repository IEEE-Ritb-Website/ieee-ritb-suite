import './Hero.css';
import StarrySkyBackground from '../effects/StarrySkyBackground';

interface Props {
  onAnimationComplete: () => void;
}

export default function Hero({ onAnimationComplete }: Props) {
  return (
    <section className="hero" id="home" aria-labelledby="hero-heading">
      <StarrySkyBackground onAnimationComplete={onAnimationComplete} />
    </section>
  );
}
