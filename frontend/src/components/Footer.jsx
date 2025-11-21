import logo from '../assets/HFP-logo-full.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div className="flex flex-col items-start">
            <img src={logo} alt="HealthyFood Plan" className="h-14 mb-3" />
            <p className="text-sm text-neutral-600 leading-relaxed">
              AI-powered food management platform promoting sustainable consumption and reducing food waste.
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              INNOVATEX Hackathon {currentYear}
            </p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-neutral-800 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p className="flex items-start">
                <span className="font-medium mr-2">Team:</span>
                <span>SuspiciousActivitiesDetected</span>
              </p>
              <p className="flex items-start">
                <span className="font-medium mr-2">Email:</span>
                <a href="mailto:contact@healthyfoodplan.com" className="hover:text-primary-600 transition-colors">
                  contact@healthyfoodplan.com
                </a>
              </p>
              <p className="flex items-start">
                <span className="font-medium mr-2">GitHub:</span>
                <a 
                  href="https://github.com/SakibSibly/healthy-food-plan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  SakibSibly/healthy-food-plan
                </a>
              </p>
            </div>
          </div>

          {/* SDG & Legal */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-neutral-800 mb-3">Sustainability Goals</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>SDG 2: Zero Hunger</p>
              <p>SDG 12: Responsible Consumption</p>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                © {currentYear} HealthyFood Plan. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
