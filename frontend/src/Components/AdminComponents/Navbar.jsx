import React, { useState, useRef, useEffect } from 'react';
import { FileText, History, Car, Users } from 'lucide-react';

// The Navbar component receives the active tab and a function to set it.
const Navbar = ({ activeTab, setActiveTab }) => {
  // Refs for each button to measure their position and size
  const navRef = useRef(null);
  const itemRefs = useRef([]);

  // State to hold the style for the sliding active indicator
  const [sliderStyle, setSliderStyle] = useState({});

  const navItems = [
    { id: 'active-requests', label: 'Active Requests', icon: FileText },
    { id: 'past-requests', label: 'Past Requests', icon: History },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'drivers', label: 'Drivers', icon: Users },
  ];

  // This effect runs whenever the activeTab changes or the component resizes.
  // It calculates the position of the active tab and updates the slider's style.
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    // Function to calculate and set the slider's position and width
    const updateSlider = () => {
      const activeIndex = navItems.findIndex(item => item.id === activeTab);
      const activeItemEl = itemRefs.current[activeIndex];
      
      if (activeItemEl) {
        const { offsetLeft, offsetWidth } = activeItemEl;
        setSliderStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    };

    updateSlider(); // Run on initial render and when activeTab changes

    // Use a ResizeObserver to update the slider when the navbar's size changes.
    // This keeps the slider perfectly aligned even if the window is resized.
    const resizeObserver = new ResizeObserver(updateSlider);
    resizeObserver.observe(navEl);

    // Cleanup: disconnect the observer when the component unmounts.
    return () => resizeObserver.disconnect();
  }, [activeTab]); // Rerun effect only when activeTab changes

  return (
    <div className="relative bg-white/70 backdrop-blur-sm p-2 rounded-xl shadow-md border border-gray-200">
      <nav ref={navRef} className="flex flex-col sm:flex-row justify-center items-center gap-2">
        {/* Map through the navigation items to create buttons */}
        {navItems.map((item, index) => (
          <button
            key={item.id}
            ref={el => itemRefs.current[index] = el} // Store ref for each button
            onClick={() => setActiveTab(item.id)}
            className={`relative z-10 flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 ease-out
              ${activeTab === item.id 
                ? 'text-white' // Active text is white
                : 'text-gray-600 hover:bg-gray-200/50' // Inactive text and hover effect
              }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {/* The sliding indicator element with faster, smoother transition */}
      <div
        className="absolute top-2 bottom-2 z-0 rounded-lg bg-gradient-to-r from-red-600 via-orange-500 to-red-500 shadow-lg transition-all duration-200 ease-out"
        style={sliderStyle}
      />
    </div>
  );
};

export default Navbar;
