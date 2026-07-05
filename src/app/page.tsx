import { Hero } from "@/sections/Hero";
import { FeaturedGame } from "@/sections/FeaturedGame";
import { About } from "@/sections/About";
import { OurGames } from "@/sections/OurGames";
import { Journey } from "@/sections/Journey";
import { Process } from "@/sections/Process";
import { BehindScenes } from "@/sections/BehindScenes";
import { Stats } from "@/sections/Stats";
import { Devlogs } from "@/sections/Devlogs";
import { Contact } from "@/sections/Contact";
import { SectionDivider } from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedGame />
      <SectionDivider variant="diamond" />
      <About />
      <OurGames />
      <SectionDivider />
      <Journey />
      <SectionDivider variant="diamond" />
      <Process />
      <BehindScenes />
      <SectionDivider />
      <Stats />
      <Devlogs />
      <SectionDivider variant="diamond" />
      <Contact />
    </>
  );
}
