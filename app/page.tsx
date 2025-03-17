// pages/index.tsx
import type { NextPage } from "next";
import Head from "next/head";
import Carousel from "../components/Carousel";

const Home: NextPage = () => {
  // Sample carousel data
  const carouselSlides = [
    {
      id: 1,
      image:
        "https://e1.pxfuel.com/desktop-wallpaper/394/913/desktop-wallpaper-4-anime-landscape-for-iphone-and-android-by-matthew-gonzales-phone-anime-scenery.jpg",
      title: "Slide 1",
    },
    {
      id: 2,
      image:
        "https://e1.pxfuel.com/desktop-wallpaper/394/913/desktop-wallpaper-4-anime-landscape-for-iphone-and-android-by-matthew-gonzales-phone-anime-scenery.jpg",
      title: "Slide 2",
    },
    {
      id: 3,
      image:
        "https://e1.pxfuel.com/desktop-wallpaper/394/913/desktop-wallpaper-4-anime-landscape-for-iphone-and-android-by-matthew-gonzales-phone-anime-scenery.jpg",
      title: "Slide 3",
    },
    {
      id: 4,
      image:
        "https://e1.pxfuel.com/desktop-wallpaper/394/913/desktop-wallpaper-4-anime-landscape-for-iphone-and-android-by-matthew-gonzales-phone-anime-scenery.jpg",
      title: "Slide 4",
    },
    {
      id: 5,
      image:
        "https://e1.pxfuel.com/desktop-wallpaper/394/913/desktop-wallpaper-4-anime-landscape-for-iphone-and-android-by-matthew-gonzales-phone-anime-scenery.jpg",
      title: "Slide 5",
    },
  ];

  return (
    <div className="min-h-screen bg-pink-900">
      <Head>
        <title>Staggered Rotating Carousel</title>
        <meta
          name="description"
          content="Staggered Rotating Carousel built with Next.js, TypeScript, Tailwind CSS and GSAP"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold text-center mb-8">
          Staggered Rotating Carousel
        </h1> */}
        <Carousel
          slides={carouselSlides}
          gap={20}
          initialActiveIndex={2} // Set slide 3 (index 2) as the initial active slide
        />
      </main>
    </div>
  );
};

export default Home;
