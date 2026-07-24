import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Projects } from "@/components/sections/Projects";
import { Research } from "@/components/sections/Research";
import { Skills } from "@/components/sections/Skills";
import { Achievements } from "@/components/sections/Achievements";
import { Certifications } from "@/components/sections/Certifications";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { getProfile, getSiteConfig } from "@/lib/content";

export default async function HomePage() {
  const [profile, site] = await Promise.all([getProfile(), getSiteConfig()]);

  return (
    <>
      <Hero profile={profile} site={site} />
      <About />
      <Experience />
      <Education />
      <Projects />
      <Research />
      <Skills />
      <Achievements />
      <Certifications />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
