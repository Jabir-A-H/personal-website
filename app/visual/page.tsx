'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

const images = [
  { id: 1, src: 'https://picsum.photos/800/1200?random=1', alt: 'Urban landscape', caption: 'Concrete and light.' },
  { id: 2, src: 'https://picsum.photos/1200/800?random=2', alt: 'Abstract texture', caption: 'Patterns in the mundane.' },
  { id: 3, src: 'https://picsum.photos/800/800?random=3', alt: 'Portrait silhouette', caption: 'Shadow play.' },
  { id: 4, src: 'https://picsum.photos/1000/1000?random=4', alt: 'Nature detail', caption: 'Organic forms.' },
  { id: 5, src: 'https://picsum.photos/800/1000?random=5', alt: 'Architecture', caption: 'Structural lines.' },
  { id: 6, src: 'https://picsum.photos/1200/600?random=6', alt: 'Street scene', caption: 'Motion blur.' },
];

export default function VisualPage() {
  const [selectedImg, setSelectedImg] = useState<typeof images[0] | null>(null);

  return (
    <div className="col-span-12 w-full text-white py-8">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {images.map((img) => (
          <div 
            key={img.id} 
            className="relative group cursor-pointer overflow-hidden break-inside-avoid"
            onClick={() => setSelectedImg(img)}
          >
            <Image 
              src={img.src} 
              alt={img.alt} 
              width={800} 
              height={1200} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="font-mono text-xs tracking-widest uppercase text-white/80">View</span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedImg(null)}
          >
            <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex flex-col items-center justify-center">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full"
              >
                <Image 
                  src={selectedImg.src} 
                  alt={selectedImg.alt} 
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 font-serif italic text-neutral-400 text-lg text-center"
              >
                {selectedImg.caption}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
