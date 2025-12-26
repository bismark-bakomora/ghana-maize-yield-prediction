import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  Lightbulb, 
  User,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Predictions',
    path: ROUTES.PREDICTION,
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    name: 'Insights',
    path: ROUTES.INSIGHTS,
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    name: 'Profile',
    path: ROUTES.PROFILE,
    icon: <User className="h-5 w-5" />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="bg-white rounded-2xl shadow-sm border border-stone-100 p-2">
          <ul className="flex items-center justify-around gap-2">
            {navItems.map((item) => (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive(item.path)
                        ? 'bg-emerald-50 text-emerald-600 font-semibold shadow-sm'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }
                  `}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;