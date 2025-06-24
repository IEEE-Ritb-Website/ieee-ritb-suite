import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

export type EventType = {
  id: number;
  title: string;
  url: string;
};

type EventCarouselProps = {
  events: EventType[];
};

const EventCarousel: React.FC<EventCarouselProps> = ({ events }) => {
  const targetRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(events.length - 1) * 100}%`]);

  return (
    <section
      ref={targetRef}
      className={`relative bg-transparent h-[200vh] mx-4 md:mx-20 lg:mx-36 xl:mx-50`} 
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden px-6">
        <motion.div style={{ x }} className="flex gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

type EventCardProps = {
  event: EventType;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="group relative h-[400px] w-[350px] flex-shrink-0 overflow-hidden rounded-xl bg-transparent shadow-lg">
      <div
        style={{
          backgroundImage: `url(${event.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/20 to-white/0 p-6 text-4xl font-bold uppercase text-white backdrop-blur-lg">
          {event.title}
        </p>
      </div>
    </div>
  );
};

export default EventCarousel;
