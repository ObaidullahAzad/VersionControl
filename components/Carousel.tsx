// components/Carousel.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaGreaterThan } from "react-icons/fa";
import { FaLessThan } from "react-icons/fa";

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
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize slide refs
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, slides.length);
  }, [slides.length]);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check initially
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Update carousel when active index changes
  useEffect(() => {
    if (!carouselRef.current) return;

    // Clear any existing animations
    gsap.killTweensOf(slideRefs.current.filter(Boolean));

    // Base width of each slide - responsive
    const slideWidth = isMobile ? 120 : 250;
    const slideWithGap = slideWidth + (isMobile ? gap / 2 : gap);

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
      const opacity = position === 0 ? 1 : 1;

      // Scale - active slide is 100%, others slightly smaller
      const scale = position === 0 ? 1 : 0.9;

      // Calculate x position with gap included - responsive
      const x = position * slideWithGap;

      // Calculate y position - responsive
      let y = 0;
      if (position < 0) {
        // Slides before active (left side) move upward
        y = position * (isMobile ? 40 : 80); // Reduced for mobile
      } else if (position > 0) {
        // Slides after active (right side) move downward
        y = position * (isMobile ? 40 : 80); // Reduced for mobile
      }

      // Calculate rotation - responsive
      let rotation = 0;
      if (position < 0) {
        rotation = position * (isMobile ? 5 : 10); // Reduced for mobile
      } else if (position > 0) {
        rotation = position * (isMobile ? 5 : 10); // Reduced for mobile
      }

      // Calculate initial positioning - responsive
      const initialY =
        position *
        (isMobile ? 10 : 20) *
        (position < 0 || position > 0 ? 1 : 0);
      const initialRotation =
        position * (isMobile ? 3 : 5) * (position < 0 || position > 0 ? 1 : 0);

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
  }, [activeIndex, slides, gap, isMobile]);

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
    <div
      className={`w-full py-8 md:py-16 relative ${
        isMobile ? "overflow-hidden" : ""
      }`}
    >
      <div
        ref={carouselRef}
        className={`carousel-container relative h-80 md:h-96 mx-auto w-full max-w-5xl ${
          isMobile ? "overflow-hidden" : ""
        }`}
      >
        {/* Navigation controls - responsive for mobile */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-20 px-2 py-2 md:px-5 md:py-5 bg-orange-100 text-2xl text-black rounded-full hover:bg-orange-200 transition-colors opacity-70 hover:opacity-80 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          aria-label="Previous slide"
        >
          <FaLessThan />
        </button>

        <button
          onClick={goToNextSlide}
          className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-20 px-2 py-2 md:px-5 md:py-5 bg-orange-100 text-2xl text-black rounded-full hover:bg-orange-200 transition-colors opacity-70 hover:opacity-80 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
          aria-label="Next slide"
        >
          <FaGreaterThan />
        </button>

        {/* Calculate responsive dimensions once outside the map function */}
        {(() => {
          const mobileSpacing = isMobile ? 120 : 180;
          const mobileGap = isMobile ? Math.min(gap / 2, 15) : gap / 2;

          return (
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

                // Calculate initial positioning - responsive
                let initialY = 0;
                let initialRotation = 0;

                if (position < 0) {
                  initialY = position * (isMobile ? 10 : 20);
                  initialRotation = position * (isMobile ? 3 : 5);
                } else if (position > 0) {
                  initialY = position * (isMobile ? 10 : 20);
                  initialRotation = position * (isMobile ? 3 : 5);
                }

                return (
                  <div
                    key={slide.id}
                    ref={(el) => {
                      slideRefs.current[index] = el;
                    }}
                    className="slide absolute top-0 left-0 right-0 mx-auto w-40 sm:w-48 md:w-64 h-[250px] sm:h-[280px] md:h-[370px] cursor-pointer transition-shadow duration-300 bg-white rounded-lg shadow-lg overflow-hidden"
                    onClick={() => goToSlide(index)}
                    style={{
                      transform: `translateX(${
                        position *
                        (isMobile ? mobileSpacing + mobileGap : 250 + gap)
                      }px) translateY(${initialY}px) rotate(${initialRotation}deg)`,
                      opacity: index === activeIndex ? 1 : 0.7,
                      zIndex: 10 - Math.abs(position),
                      transformOrigin: "center center",
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-4 pl-5">
                      <h3 className="text-3xl font-italiana-sm md:text-4xl font-medium  text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                        {slide.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Carousel;
