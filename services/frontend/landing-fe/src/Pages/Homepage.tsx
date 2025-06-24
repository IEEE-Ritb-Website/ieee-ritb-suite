import Particles from "../Components/Particles";
import Hero from "../Components/Hero";
import Navbar from "../Components/Navbar";
import SlidingHr from "../Components/SlindingHr";
import Footer from "../Components/Footer";
import FAQ from "../Components/FAQ";
import NewsSection from "../Components/NewsSection";
import EventCarousel from "../Components/EventCarousel";


const events = [
  { id: 1, title: "CodePoly", url: "/img1.png" },
  { id: 2, title: "404: Murder not found", url: "/img2.png" },
  { id: 3, title: "demo", url: "/img3.png" },
  { id: 4, title: "demo", url: "/img4.png" },
  { id: 5, title: "demo", url: "/img5.png" },
  { id: 6, title: "demo", url: "/img6.png" },
  { id: 7, title: "CodePoly", url: "/img1.png" },
  { id: 8, title: "404: Murder not found", url: "/img2.png" },
  { id: 9, title: "demo", url: "/img3.png" },
  { id: 10, title: "demo", url: "/img4.png" },
  { id: 11, title: "demo", url: "/img5.png" },
  { id: 12, title: "demo", url: "/img6.png" },
];

function App() {
  return (
    <section className="relative min-h-screen bg-[#05060f] text-white overflow-hidden">
      <Navbar />
      <Hero />
      <SlidingHr />
      {/* Improvise event carousel (Extra space after this section ) */}
      <EventCarousel events={events} />
      <SlidingHr />
      {/* News Section*/}
      <NewsSection />
      <SlidingHr />
      {/* FAQS component*/}
      <FAQ />
      <SlidingHr />
      {/* Footer*/ }
      {/* Not responsive */}
      <Footer />

      {/* Don't alter the below tags*/}
      {/*<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)] pointer-events-none" /> */}
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={100}
        color="#ffffff"
        size={0.05}
        refresh
      />
    </section>
  );
}

export default App;
