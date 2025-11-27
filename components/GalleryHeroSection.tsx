"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Item {
  id: string;
  url: string;
  description?: string;
  title?: string;
  likes?: string[];
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string;
  userName?: string;
  userPhotoURL?: string;
}

interface GalleryHeroSectionProps {
  heroItems: Item[];
}

export default function GalleryHeroSection({ heroItems }: GalleryHeroSectionProps) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    if (heroItems.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % Math.min(3, heroItems.length));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const nextHero = useCallback(() => {
    setCurrentHeroIndex((prev) => (prev + 1) % Math.min(3, heroItems.length));
  }, [heroItems.length]);

  const prevHero = useCallback(() => {
    setCurrentHeroIndex((prev) => (prev - 1 + Math.min(3, heroItems.length)) % Math.min(3, heroItems.length));
  }, [heroItems.length]);

  if (heroItems.length === 0) return null;

  return (
    <Link href="/gallery" className="block">
      <section className="relative h-96 w-full overflow-hidden rounded-xl shadow-lg mb-8 cursor-pointer group">
        {heroItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentHeroIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={item.url || "/placeholder.png"}
              alt={item.title || "Hero image"}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40 flex items-end group-hover:bg-black/30 transition-all">
              <div className="p-6 text-white w-full">
                <div className="flex items-center mb-3">
                  <div className="relative w-8 h-8 mr-2">
                    <Image
                      src={item.userPhotoURL || "/default-avatar.png"}
                      alt={item.userName || "Anonymous"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{item.userName || "Anonymous"}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p className="line-clamp-2">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation arrows */}
        {heroItems.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevHero();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20 opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextHero();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all z-20 opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}
        
        {/* Indicators */}
        {heroItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroItems.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentHeroIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentHeroIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Overlay text */}
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          View Gallery →
        </div>
      </section>
    </Link>
  );
}