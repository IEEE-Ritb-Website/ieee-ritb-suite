const AnimatedLogo: React.FC = () => {
  return (
    <div className="mt-50 mb-50">
      <div className="text-wrapper relative min-h-40 inset-x-0   flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 1000 300"
          preserveAspectRatio="xMidYMid meet"
          className="responsive-svg "
        >
          <text x="50%" y="50%" dy=".35em" textAnchor="middle">
            <tspan className="inline-block   ">IEEE </tspan>
            <tspan className="inline-block  ">RIT-B</tspan>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default AnimatedLogo;
