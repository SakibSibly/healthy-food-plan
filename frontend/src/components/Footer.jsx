import logo from '../assets/HFP-logo-full.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-2 border-primary-200 mt-auto shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Branding */}
          <div className="flex items-center space-x-3">
            <img src={logo} alt="HealthyFood Plan" className="h-16" />
          </div>

          {/* Team Info */}
          <div className="text-center">
            <p className="text-sm text-neutral-700">
              Built with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
              <span className="font-bold text-primary-600">SuspiciousActivitiesDetected</span>
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              INNOVATEX Hackathon {currentYear} | SDG 2 & SDG 12
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm">
            <a
              href="https://github.com/SakibSibly/healthy-food-plan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-primary-600 transition-colors flex items-center space-x-1"
            >
              <span>⭐</span>
              <span>GitHub</span>
            </a>
            <span className="text-neutral-300">|</span>
            <span className="text-neutral-600">© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
