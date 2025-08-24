import { useEffect, useState } from 'react';
import { getVenueImages } from '@/lib/venueImages';

export default function TestImages() {
  const [testVenue] = useState("Al noor banquet");
  const [images, setImages] = useState<Array<{ src: string; alt: string }>>([]);
  const [loadErrors, setLoadErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const venueImages = getVenueImages(testVenue);
    setImages(venueImages);
    setLoadErrors(new Set());
    console.log('Venue images:', venueImages);
    
    // Test image loading
    venueImages.forEach(image => {
      const img = new Image();
      img.onload = () => console.log('✅ Image loaded:', image.src);
      img.onerror = () => {
        console.error('❌ Image failed to load:', image.src);
        setLoadErrors(prev => new Set([...prev, image.src]));
      };
      img.src = image.src;
    });
  }, [testVenue]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Testing images for: {testVenue}</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p className="font-semibold mb-2">Found {images.length} images:</p>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(images, null, 2)}
            </pre>
          </div>
          {loadErrors.size > 0 && (
            <div className="bg-red-100 border border-red-300 p-4 rounded mb-4">
              <p className="font-semibold text-red-700 mb-2">Failed to load {loadErrors.size} images:</p>
              <ul className="list-disc list-inside text-sm text-red-600">
                {Array.from(loadErrors).map(src => (
                  <li key={src}>{src}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full h-48 object-cover rounded ${
                    loadErrors.has(image.src) ? 'border-2 border-red-300' : ''
                  }`}
                  onError={(e) => {
                    console.error(`❌ Failed to load image: ${image.src}`);
                    setLoadErrors(prev => new Set([...prev, image.src]));
                    e.currentTarget.src = '/default-venue.jpg';
                  }}
                  onLoad={() => {
                    console.log(`✅ Successfully loaded: ${image.src}`);
                  }}
                />
                {loadErrors.has(image.src) && (
                  <div className="absolute inset-0 bg-red-100 bg-opacity-75 flex items-center justify-center">
                    <span className="text-red-600 text-sm font-semibold">Failed to load</span>
                  </div>
                )}
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium">Path: {image.src}</p>
                <p className="text-gray-600">Status: {loadErrors.has(image.src) ? '❌ Failed' : '✅ Loaded'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
