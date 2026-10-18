import DriverSpotlight from "@/components/conducteurs/DriverSpotlight";
import MobileNav from "@/components/layout/MobileNav";
import SearchTrip from "@/components/recherche/SearchTrip";
import CTASection from "@/components/sections/CTASection";
import HowItWorks from "@/components/sections/HowItWorks";
import StatsSection from "@/components/sections/StatsSection";
import PopularTrips from "@/components/trajets/PopularTrips";


export default function Welcome() {
  return (
    <div className="min-h-screen bg-[#EEF2F8] pb-16 sm:pb-0">
      <SearchTrip />
      <StatsSection />
      <HowItWorks />
      <PopularTrips />
      <DriverSpotlight />
      <CTASection />
      <MobileNav />
    </div>
  );
}
