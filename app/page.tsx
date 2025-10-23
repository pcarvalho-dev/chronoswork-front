import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import InteractiveBackground from './components/InteractiveBackground';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <InteractiveBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Features />
        </main>
        <Footer />
      </div>
    </div>
  );
}
