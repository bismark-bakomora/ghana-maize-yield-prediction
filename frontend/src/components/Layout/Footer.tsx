import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <Link to={ROUTES.HOME} className="text-stone-400 hover:text-emerald-400 transition-colors">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-emerald-500" />
              <span className="ml-2 text-xl font-bold text-white">
                Crop Yield Predictor
              </span>
            </div>
            </Link>
            <p className="text-sm text-stone-400">
              AI-powered agricultural insights to help farmers make better decisions
              and maximize crop yields.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.DASHBOARD} className="text-stone-400 hover:text-emerald-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PREDICTION} className="text-stone-400 hover:text-emerald-400 transition-colors">
                  Make Prediction
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INSIGHTS} className="text-stone-400 hover:text-emerald-400 transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PROFILE} className="text-stone-400 hover:text-emerald-400 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-stone-400 hover:text-emerald-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-stone-400 hover:text-emerald-400 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <Link to={ROUTES.INSIGHTS} className="text-stone-400 hover:text-emerald-400 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to={ROUTES.INSIGHTS} className="text-stone-400 hover:text-emerald-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-emerald-500" />
                <a href="mailto:info@cropyieldpredictor.com" className="text-stone-400 hover:text-emerald-400 transition-colors text-sm">
                  info@cropyieldpredictor.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-emerald-500" />
                <a href="tel:+233123456789" className="text-stone-400 hover:text-emerald-400 transition-colors text-sm">
                  +233 123 456 789
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-emerald-500 mt-1" />
                <span className="text-sm text-stone-400">
                  Accra, Greater Accra Region<br />
                  Ghana
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-stone-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-stone-500">
              © {currentYear} Crop Yield Predictor. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-stone-500 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-stone-500 hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-stone-500 hover:text-emerald-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;