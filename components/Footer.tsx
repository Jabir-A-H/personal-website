'use client';

export default function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 text-xs font-mono flex justify-between items-center z-50 relative mix-blend-difference text-white opacity-60">
      <span>&copy; {new Date().getFullYear()} Jabir Abdullah Haian</span>
      <span className="hidden sm:inline-block italic font-serif">One structure. Multiple ways of thinking.</span>
      <span>v1.0.0</span>
    </footer>
  );
}
