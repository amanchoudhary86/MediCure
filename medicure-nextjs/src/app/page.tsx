import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import Features from "@/components/Features";
import FunFacts from "@/components/FunFacts";
import WhyChoose from "@/components/WhyChoose";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";

import Appointment from "@/components/Appointment";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Schedule />
      <Features />
      <FunFacts />
      <WhyChoose />

      <Portfolio />
      <Services />

      <Appointment />
      <Newsletter />
      <Footer />
    </main>
  );
}
