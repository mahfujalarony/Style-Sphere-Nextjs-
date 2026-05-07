import Image from "next/image";
import Navbar from "@/components/Navbar";
import CollectionShowcase from "@/components/CollectionShowcase";
import HomeSliderProducts from "@/components/HomeSliderProducts";
import Reels from "@/components/Reels";
import ExploreMore from "@/components/ExploreMore";


export default function Home() {
  return (
    <main className="min-h-screen">


      <div className="relative w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/desktop_t.png"
          className="hidden md:block absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/desktop.mp4" type="video/mp4" />
        </video>

        {/* Mobile Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/mobile_t.png"
          className="block md:hidden absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/mobile.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 w-full h-full flex flex-col">
          <Navbar />

          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center flex-grow font-bold text-center text-white pb-20">
            <h1 className="text-5xl">Welcome to My App</h1>
            <p className="mt-4 text-xl">Hero section with a video background</p>
          </div>
        </div>
      </div>



      <CollectionShowcase />


      <HomeSliderProducts />

      
      <Reels />



      <ExploreMore />

    </main>
  );
}
