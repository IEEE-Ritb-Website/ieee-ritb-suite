import { cn } from "@/utils/cn";

const AnimatedLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className, "flex items-center justify-center")}>
      <svg
        viewBox="0 0 1000 300"
        preserveAspectRatio="xMidYMid meet"
        className="responsive-svg pointer-events-none"
      >
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          fill="#1d4ed8"
          fontSize="80"
        >
          <tspan>IEEE </tspan>
          <tspan>RITB</tspan>
        </text>
      </svg>
    </div>
  );
};

export default AnimatedLogo;
