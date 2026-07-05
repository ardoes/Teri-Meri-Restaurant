import { HeroChapter } from "@/components/chapters/HeroChapter";
import { Marquee } from "@/components/sections/Marquee";
import { StoryChapter } from "@/components/chapters/StoryChapter";
import { ChefSpecialsScene } from "@/components/sections/ChefSpecialsScene";
import { ReservationScene } from "@/components/sections/ReservationScene";

export default function Home() {
  return (
    <>
      <div className="sticky top-0 z-0 h-screen">
        <HeroChapter />
      </div>

      <div className="relative z-10 bg-cream shadow-[0_-30px_70px_-20px_rgba(38,27,22,0.45)]">
        <Marquee />
        <StoryChapter />

        <ChefSpecialsScene />

        <ReservationScene />
      </div>
    </>
  );
}
