'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });
const Footer = dynamic(() => import('../components/Footer'), { ssr: false });

const HeroSection = dynamic(() => import('../components/HeroSection'), {
  ssr: false,
  loading: () => <div className="min-h-[80vh]" />
});

const StudyAssistant = dynamic(() => import('../components/StudyAssistant'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh]" />
});

const Stats = dynamic(() => import('../components/Stats'), { ssr: false });
const HowItWorks = dynamic(() => import('../components/HowItWorks'), { ssr: false });
const Categories = dynamic(() => import('../components/Categories'), { ssr: false });
const FeaturedBooks = dynamic(() => import('../components/FeaturedBooks'), { ssr: false });

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Optional loading UI while client-side JS is loading
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="overflow-hidden">
        <HeroSection />
        <Stats />
        <StudyAssistant />
        <HowItWorks />
        <Categories />
        <FeaturedBooks />
      </main>
      <Footer />
    </div>
  );
}
