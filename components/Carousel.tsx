// components/Carousel.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface CarouselProps {
  slides: {
    id: number;
    image: string;
    title: string;
  }[];
  gap?: number;
  initialActiveIndex?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  gap = 40,
  initialActiveIndex = 2,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize slide refs
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, slides.length);
  }, [slides.length]);

  // Update carousel when active index changes
  useEffect(() => {
    if (!carouselRef.current) return;

    // Clear any existing animations
    gsap.killTweensOf(slideRefs.current.filter(Boolean));

    // Base width of each slide
    const slideWidth = 250;
    const slideWithGap = slideWidth + gap;

    slides.forEach((_, index) => {
      const slide = slideRefs.current[index];
      if (!slide) return;

      // Calculate the shortest path to the active index considering wrap-around
      let position = index - activeIndex;
      const slideCount = slides.length;

      // Adjust position for better wrapping
      // If moving from last slide to first, make it appear from the left instead of traveling all the way around
      if (position > slideCount / 2) {
        position -= slideCount;
      } else if (position < -slideCount / 2) {
        position += slideCount;
      }

      // Calculate z-index to handle proper layering
      const zIndex = 10 - Math.abs(position);

      // Calculate opacity - active slide is fully opaque, others slightly transparent
      const opacity = position === 0 ? 1 : 0.7;

      // Scale - active slide is 100%, others slightly smaller
      const scale = position === 0 ? 1 : 0.9;

      // Calculate x position with gap included
      const x = position * slideWithGap;

      // Calculate y position - first slides go up, last slides go down
      // Active slide stays centered (y=0)
      let y = 0;
      if (position < 0) {
        // Slides before active (left side) move upward
        y = position * 80; // Negative position gives negative y (upward)
      } else if (position > 0) {
        // Slides after active (right side) move downward
        y = position * 80; // Positive y is downward
      }

      // Calculate rotation - first slides rotate counterclockwise, last slides rotate clockwise
      // Active slide has no rotation (0 degrees)
      let rotation = 0;
      if (position < 0) {
        // Slides before active (left side) rotate counterclockwise (negative angle)
        rotation = position * 10; // negative position gives negative rotation (counterclockwise)
      } else if (position > 0) {
        // Slides after active (right side) rotate clockwise (positive angle)
        rotation = position * 10; // positive rotation is clockwise
      }

      // Animate the slide to its new position
      gsap.to(slide, {
        x,
        y,
        rotation,
        scale,
        opacity,
        zIndex,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  }, [activeIndex, slides, gap]);

  const goToSlide = (index: number) => {
    let targetIndex = index;

    // Handle wrapping at the end
    if (targetIndex >= slides.length) {
      targetIndex = 0;
    }

    // Handle wrapping at the beginning
    if (targetIndex < 0) {
      targetIndex = slides.length - 1;
    }

    setActiveIndex(targetIndex);
  };

  const goToPrevSlide = () => {
    goToSlide(activeIndex - 1);
  };

  const goToNextSlide = () => {
    goToSlide(activeIndex + 1);
  };

  return (
    <div className="w-full py-16 relative">
      <div
        ref={carouselRef}
        className="carousel-container relative h-96 mx-auto w-full max-w-5xl overflow-visible"
      >
        <div className="slides-container h-full relative">
          {slides.map((slide, index) => {
            // Calculate the shortest path position considering wrap-around
            let position = index - activeIndex;
            const slideCount = slides.length;

            // Adjust position for better initial rendering
            if (position > slideCount / 2) {
              position -= slideCount;
            } else if (position < -slideCount / 2) {
              position += slideCount;
            }

            // Calculate initial positioning
            let initialY = 0;
            let initialRotation = 0;

            if (position < 0) {
              initialY = position * 20;
              initialRotation = position * 5;
            } else if (position > 0) {
              initialY = position * 20;
              initialRotation = position * 5;
            }

            return (
              <div
                key={slide.id}
                ref={(el) => (slideRefs.current[index] = el)}
                className="slide absolute top-0 left-0 right-0 mx-auto w-64 h-[350px] cursor-pointer transition-shadow duration-300 bg-white rounded-lg shadow-lg overflow-hidden"
                onClick={() => goToSlide(index)}
                style={{
                  transform: `translateX(${
                    position * (250 + gap)
                  }px) translateY(${initialY}px) rotate(${initialRotation}deg)`,
                  opacity: index === activeIndex ? 1 : 0.7,
                  zIndex: 10 - Math.abs(position),
                  transformOrigin: "center center",
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-800">{slide.title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={goToPrevSlide}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={goToNextSlide}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
