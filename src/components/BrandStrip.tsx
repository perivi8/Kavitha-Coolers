import { useEffect, useState } from "react";
import godrejLogo from "../assets/godrej-logo.svg";
import panasonicLogo from "../assets/panasonic-logo.svg";
import boschLogo from "../assets/bosch-logo.svg";
import siemensLogo from "../assets/siemens-logo.svg";
import liebherrLogo from "../assets/liebherr-logo.svg";
import vguardLogo from "../assets/vguard-logo.svg";

const scrollingAnimation = `
  @keyframes scroll-right-to-left {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .scrolling-brands {
    animation: scroll-right-to-left 15s linear infinite;
    display: flex;
    width: 200%;
  }
  
  .scrolling-container {
    overflow: hidden;
    white-space: nowrap;
  }
`;

const BrandStrip = () => {
  const brands = [
    { name: "Godrej", logo: "https://img.favpng.com/15/19/3/godrej-group-logo-godrej-agrovet-godrej-consumer-products-ltd-png-favpng-sN8xgh9beLiKQ2CeAVy79Afae.jpg" },
    { name: "Panasonic", logo: "https://img.favpng.com/11/10/25/logo-brand-panasonic-air-conditioning-product-png-favpng-rDWEC9BGjjBGpsSNKR1g5r7GW.jpg" },
    { name: "Bosch", logo: "https://e7.pngegg.com/pngimages/1006/243/png-clipart-logo-robert-bosch-gmbh-alternator-product-electric-battery-bosch-text-trademark-thumbnail.png" },
    { name: "Siemens", logo: "https://img.favpng.com/8/9/22/siemens-technology-and-services-organization-logo-siemens-plm-software-png-favpng-AES6DxNH3wXCsj79vVmQZALs3.jpg" },
    { name: "Liebherr", logo: "https://img.favpng.com/22/19/1/liebherr-group-caterpillar-inc-heavy-machinery-loader-logo-png-favpng-dudZrat9zJCQLeV7ahcCjisEE.jpg" },
    { name: "V Guard", logo: "https://img.favpng.com/9/0/4/v-guard-corporate-office-v-guard-industries-ltd-company-manufacturing-png-favpng-Xu97EwmRM4ZhH93911uChaZ4q.jpg" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % brands.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [brands.length]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollingAnimation }} />
      <section className="py-12 bg-card">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="heading-3 mb-2">Authorized Dealer For</h2>
            <p className="body-small">Premium brands you trust</p>
          </div>

          {/* Desktop Scrolling Animation */}
          <div className="hidden md:block scrolling-container relative h-32">
            <div className="scrolling-brands items-center space-x-16 absolute whitespace-nowrap">
              {/* First set of brands */}
              {brands.map((brand, index) => (
                <div
                  key={`${brand.name}-1`}
                  className="inline-flex items-center justify-center mx-8"
                >
                  <div className="w-32 h-20 flex items-center justify-center">
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} logo`}
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {brands.map((brand, index) => (
                <div
                  key={`${brand.name}-2`}
                  className="inline-flex items-center justify-center mx-8"
                >
                  <div className="w-32 h-20 flex items-center justify-center">
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} logo`}
                      className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="flex justify-center items-center space-x-8 overflow-hidden">
              {brands.slice(currentIndex, currentIndex + 3).map((brand, index) => (
                <div
                  key={`${brand.name}-${currentIndex}-${index}`}
                  className="brand-card flex-shrink-0 w-28"
                >
                  <div className="w-20 h-12 mx-auto mb-2 flex items-center justify-center overflow-hidden">
                    <img 
                      src={brand.logo} 
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <p className="caption font-medium text-center">{brand.name}</p>
                </div>
              ))}
            </div>
            
            {/* Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {brands.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandStrip;