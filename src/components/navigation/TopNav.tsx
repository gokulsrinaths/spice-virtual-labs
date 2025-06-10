import { Link, useLocation } from 'react-router-dom';

export function TopNav() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100 h-16">
      <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
        {!isHomePage && (
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 flex items-center group"
          >
            <svg 
              className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5m7 7l-7-7 7-7" />
            </svg>
            Home
          </Link>
        )}
        {isHomePage ? (
          <div className="text-sm text-gray-900">Fluid Mechanics Lab</div>
        ) : (
          <div className="text-sm text-gray-500">Fluid Mechanics Lab</div>
        )}
      </div>
    </nav>
  );
} 