import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Text } from "@/component/luxe/ui/text";

export type EventType = {
  id: number;
  title: string;
  url: string;
  description?: string;
};

type EventCarouselProps = {
  events: EventType[];
};

const EventCarousel: React.FC<EventCarouselProps> = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const extendedEvents =
    events.length < 3 ? [...events, ...events, ...events] : events;

  useEffect(() => {
    const startAutoPlay = () => {
      intervalRef.current = setInterval(() => {
        if (!isHovered) {
          setCurrentIndex(
            (prevIndex) => (prevIndex + 1) % extendedEvents.length,
          );
        }
      }, 3000);
    };

    const stopAutoPlay = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    startAutoPlay();

    return () => stopAutoPlay();
  }, [isHovered, extendedEvents.length]);

  const getVisibleEvents = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % extendedEvents.length;
      visible.push(extendedEvents[index]);
    }
    return visible;
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <Text variant="shine" className="text-4xl font-bold">
          Events
        </Text>
      </div>

      <div
        className="flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex gap-6"
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {getVisibleEvents().map((event, index) => (
              <motion.div
                key={`${event.id}-${currentIndex}-${index}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {extendedEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

type EventCardProps = {
  event: EventType;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="group relative h-[400px] w-[350px] flex-shrink-0 overflow-hidden rounded-xl bg-gray-900 shadow-lg border border-gray-800">
      <div
        style={{
          backgroundImage: `url(${event.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
        <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
              {event.description}
            </p>
          )}
        </div>
      </div>
      <div className="absolute inset-0 z-20 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300" />
    </div>
  );
};

export default EventCarousel;