import Particles from "../Components/Particles";
import Hero from "../Components/Hero";
import FAQ from "../Components/FAQ";
import EventCarousel from "../Components/EventCarousel";
import events from "../configs/events.json";
// import NewsSection from "../Components/NewsSection";

function App() {
  return (
    <div className="relative">
      <Hero />

      <EventCarousel events={events} />
      {/* <NewsSection /> */}

      <FAQ />

      <Particles
        className="absolute inset-0"
        quantity={400}
        ease={100}
        color="#ffffff"
        size={0}
        refresh
      />
    </div>
  );
}

export default App;
