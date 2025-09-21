import Particles from "../Components/Particles";
import Hero from "../Components/Hero";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FAQ from "../Components/FAQ";
import EventCarousel from "../Components/EventCarousel";
import events from "../configs/events.json";
// import NewsSection from "../Components/NewsSection";

function App() {
  return (
    <section className="relative min-h-screen bg-[#05060f] text-white overflow-hidden">
      <Navbar />

      <Hero />

      <EventCarousel events={events} />
      {/* <NewsSection /> */} 

      <FAQ />
      
      <Footer />

      <Particles
        className="absolute inset-0"
        quantity={400}
        ease={100}
        color="#ffffff"
        size={0.05}
        refresh
      />
    </section>
  );
}

export default App;
