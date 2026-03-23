import React from 'react';
import DomeGallery from '../../components/DomeGallery';

// Import all images from assets directory
const imagesFromAssets = import.meta.glob('../../assets/*.{png,jpg,jpeg,webp,svg}', { eager: true });

// Convert imported files to array of image objects
const galleryImages = Object.values(imagesFromAssets).map((module) => ({
    src: module.default || module, // Vite usually puts the URL in default
    alt: 'Flood Rescue Tracker Image'
}));

export default function About() {
    return (
        <div className="w-full h-screen bg-[#060010] overflow-hidden m-0 p-0 relative">
            <div className="absolute top-4 left-4 z-50">
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all border border-white/20 font-semibold shadow-lg"
                >
                    ← Quay lại
                </button>
            </div>
            <DomeGallery
                images={galleryImages.length > 0 ? galleryImages : undefined}
                fit={0.8}
                minRadius={600}
                maxVerticalRotationDeg={0}
                segments={34}
                dragDampening={2}
                grayscale={false}
            />
        </div>
    );
}
