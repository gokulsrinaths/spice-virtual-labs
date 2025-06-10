import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Award,
  GraduationCap,
  BookOpen,
  Beaker,
  Star,
  ChevronRight,
  Users,
  Clock,
  Star as StarIcon,
  Filter,
  ArrowRight,
  BarChart,
  Droplets,
  Wind,
  Gauge,
  Scale,
  TestTubes,
  ThermometerSnowflake,
  X,
  ChevronDown,
  Check as CheckIcon,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Sparkles,
  Brain,
  FileText,
  Video,
  MessageSquare,
  Zap,
  Sun,
  Moon,
  PlayCircle
} from 'lucide-react';
import CountUp from 'react-countup';
import { Course } from '../types/course';

// Mock data for featured courses
const featuredCourses = [
  {
    id: 'mass-density',
    title: 'Mass Density Experiment',
    description: 'Learn about mass density through interactive experiments',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    level: 'Beginner',
    hours: 3,
    students: '3.2k',
    topics: ['Density', 'Mass', 'Volume'],
    progress: 45,
    isProFeature: false,
    aiFeatures: [
      { name: 'Real-time AI Guidance', icon: Brain },
      { name: 'Interactive Explanations', icon: MessageSquare }
    ]
  },
  {
    id: 'fluid-viscosity',
    title: 'Fluid Viscosity Analysis',
    description: 'Understand fluid viscosity through practical experiments',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557',
    level: 'Intermediate',
    hours: 4,
    students: '2.8k',
    topics: ['Viscosity', 'Flow', 'Temperature'],
    progress: null,
    isProFeature: true,
    aiFeatures: [
      { name: 'AI Video Narration', icon: Video },
      { name: 'Smart Report Generation', icon: FileText },
      { name: 'Advanced Analytics', icon: BarChart }
    ]
  },
  {
    id: 'pressure-systems',
    title: 'Pressure in Fluid Systems',
    description: 'Explore pressure relationships in fluid systems',
    image: 'https://images.unsplash.com/photo-1581093458791-4b432292a9fb',
    level: 'Advanced',
    hours: 5,
    students: '1.9k',
    topics: ['Pressure', 'Flow Rate', 'Systems'],
    progress: 15,
    isProFeature: true,
    aiFeatures: [
      { name: 'AI Simulation Analysis', icon: Brain },
      { name: 'Video Explanations', icon: Video },
      { name: 'Custom Report Export', icon: FileText }
    ]
  }
];

interface SocialLink {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  url: string;
}

// Social media links
const socialLinks: SocialLink[] = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'LinkedIn', icon: Linkedin, url: '#' },
  { name: 'YouTube', icon: Youtube, url: '#' }
];

export function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme as 'light' | 'dark';
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Update theme in localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    level: 'All Levels',
    duration: 'Any Duration'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Effect to handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = featuredCourses.filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.description.toLowerCase().includes(query) ||
      course.topics.some(topic => topic.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
  }, [searchQuery]);

  // Toggle search results visibility
  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '') {
      setShowSearchResults(true);
    }
  };

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim() !== '');
  };

  // Handle closing search results
  const handleCloseSearch = () => {
    setShowSearchResults(false);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: 'level' | 'duration', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur border border-white/20 shadow-lg"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-gray-600" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-400" />
        )}
      </button>

      {/* Hero Section */}
      <section className={`pt-24 pb-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/10 text-blue-600 rounded-full text-sm font-medium border border-blue-100">
                <Sparkles className="h-4 w-4" />
                <span>AI-Powered Learning Experience</span>
              </div>

              <h1 className={`text-4xl md:text-5xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Master Fluid Mechanics with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  AI-Guided Experiments
                </span>
              </h1>
              
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Experience interactive experiments with real-time AI assistance. Get personalized guidance, instant feedback, and detailed explanations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/experiments/featured" 
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Start Free Lab
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>

                <Link 
                  to="/pricing" 
                  className="inline-flex items-center px-8 py-4 border-2 border-purple-200 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all"
                >
                  View Pro Features
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur rounded-2xl p-8 border border-white/10 shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="AI-assisted fluid mechanics experiment" 
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg mb-6"
                />
                
                <div className="absolute -right-4 -bottom-4 bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <Brain className="h-6 w-6 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-white">AI Assistant Active</div>
                      <div className="text-xs text-gray-500">Real-time guidance enabled</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search experiments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                    : 'bg-white text-gray-900 placeholder-gray-500 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>

            {/* Combined Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                } border border-gray-200 transition-colors`}
              >
                <Filter className="h-5 w-5" />
                <span>All Levels | Any Duration</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* AI-Enhanced Filter Badge */}
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
              }`}>
                <Sparkles className="h-3 w-3" />
                <span>AI-Enhanced Results</span>
              </div>
            </div>
          </div>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                } border border-gray-200 shadow-lg`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Level Filter */}
                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Level
                    </h4>
                    <div className="space-y-2">
                      {['All Levels', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <label
                          key={level}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="level"
                            value={level}
                            checked={activeFilters.level === level}
                            onChange={() => setActiveFilters({ ...activeFilters, level })}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {level}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Duration
                    </h4>
                    <div className="space-y-2">
                      {['Any Duration', '< 2 hours', '2-4 hours', '4+ hours'].map((duration) => (
                        <label
                          key={duration}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="duration"
                            value={duration}
                            checked={activeFilters.duration === duration}
                            onChange={() => setActiveFilters({ ...activeFilters, duration })}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                            {duration}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Experiments Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI-Enhanced Experiments
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Learn faster with personalized AI guidance and real-time feedback
              </p>
            </div>
            <Link 
              to="/experiments" 
              className={`mt-4 md:mt-0 text-blue-600 font-medium hover:text-blue-700 flex items-center ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : ''}`}
            >
              View all experiments
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 3).map((course) => (
              <Link 
                to={`/experiments/${course.id}`}
                key={course.id}
                className={`group relative overflow-hidden rounded-xl transition-all ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                } border border-purple-100/20 shadow-lg hover:shadow-xl`}
              >
                {/* Experiment Image */}
                <div className="relative h-48">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* AI Features Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      course.isProFeature 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      <Sparkles className="h-3 w-3" />
                      {course.isProFeature ? 'Pro' : 'Free'}
                    </div>
                  </div>

                  {/* Tags - Only visible on hover */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {course.topics.map((topic) => (
                      <span 
                        key={topic} 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          theme === 'dark' 
                            ? 'bg-gray-700 text-gray-200' 
                            : 'bg-white/90 text-gray-800'
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {course.title}
                  </h3>
                  
                  {/* AI Features */}
                  <div className="mb-4 space-y-2">
                    {course.aiFeatures?.map((feature, index) => (
                      <div 
                        key={index}
                        className={`flex items-center text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        <feature.icon className="h-4 w-4 mr-2 text-blue-500" />
                        {feature.name}
                      </div>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className={`flex items-center text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span>{course.level}</span>
                    <span className="mx-2">·</span>
                    <span>~{course.hours}h</span>
                    <span className="mx-2">·</span>
                    <span>{course.students} students</span>
                  </div>
                </div>

                {/* Progress Indicator (if started) */}
                {course.progress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
          <Link 
            to="/experiments?sort=newest" 
            className="text-blue-600 font-medium hover:text-blue-700 flex items-center"
          >
            View all
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.slice(3, 6).map((course) => (
            <Link 
              to={`/experiments/${course.id}`}
              key={course.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
            >
              <div className="relative h-48">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Tags - Only visible on hover */}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {course.topics.map((topic) => (
                    <span key={topic} className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-800">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <span>{course.level}</span>
                  <span className="mx-2">·</span>
                  <span>~{course.hours}h</span>
                  <span className="mx-2">·</span>
                  <span>{course.students} students</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Why Choose Our Virtual Lab */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Learn Fluid Mechanics Through Practice</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Interactive Learning</h3>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                <BarChart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Data Visualization</h3>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Expert-Designed Labs</h3>
            </div>
          </div>
          
          {/* Fluid Properties Series */}
          <div className="mt-16">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Fluid Properties Exploration Series
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Covers Mass Density, Viscosity & Data Analysis
                  </p>
                  
                  <Link 
                    to="/experiments/fluid-properties" 
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start the Series
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
                
                <div className="hidden lg:block">
                  <img 
                    src="https://images.unsplash.com/photo-1614935151651-0bea6508db6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Fluid properties experiments" 
                    className="w-full h-[400px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dynamic Stats */}
            <div className={`lg:col-span-1 rounded-xl p-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Real-time Impact
              </h3>
              
              <div className="space-y-6">
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="text-3xl font-bold text-blue-600">
                    <CountUp end={15482} duration={2} separator="," />+
                  </div>
                  <p>Active Students</p>
                </div>
                
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="text-3xl font-bold text-green-600">
                    <CountUp end={127893} duration={2} separator="," />
                  </div>
                  <p>Experiments Completed</p>
                </div>
                
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="text-3xl font-bold text-purple-600">
                    <CountUp end={98} duration={2} decimals={1} suffix="%" />
                  </div>
                  <p>Success Rate</p>
                </div>
              </div>
            </div>

            {/* Audio Reviews */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Student Reviews
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Review 1 */}
                <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/32.jpg"
                      alt="Student"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Emily Johnson
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Mechanical Engineering Student
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="line-clamp-2">
                      "The AI assistant helped me understand complex fluid dynamics concepts that I struggled with in traditional classes."
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <button 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <PlayCircle className="h-4 w-4" />
                      Play Audio
                    </button>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-start gap-4">
                    <img 
                      src="https://randomuser.me/api/portraits/men/67.jpg"
                      alt="Student"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Michael Chen
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Chemical Engineering Graduate
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p className="line-clamp-2">
                      "The AI-generated reports saved me hours of lab work documentation while providing deeper insights."
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <button 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        theme === 'dark' 
                          ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <PlayCircle className="h-4 w-4" />
                      Play Audio
                    </button>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating AI Chat Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          aria-label="Open AI Chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>

      {/* AI Chat Modal (Mobile) */}
      <AnimatePresence>
        {showAIChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setShowAIChat(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed bottom-0 left-0 right-0 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-t-2xl shadow-xl z-[61] p-4 pb-8 max-h-[80vh] overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    AI Assistant
                  </h3>
                </div>
                <button
                  onClick={() => setShowAIChat(false)}
                  className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-3 rounded-lg text-sm font-medium text-left ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <FileText className="h-4 w-4 mb-1" />
                    Generate Report
                  </button>
                  <button
                    className={`p-3 rounded-lg text-sm font-medium text-left ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <Video className="h-4 w-4 mb-1" />
                    Explain Concept
                  </button>
                </div>

                {/* Chat Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask anything about the experiment..."
                    className={`w-full p-4 pr-12 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Pro Features Prompt */}
                <div className={`p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <Zap className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Unlock Pro Features
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Get AI-powered video explanations and export detailed reports
                      </p>
                      <Link
                        to="/pricing"
                        className="inline-flex items-center text-sm font-medium text-blue-600 mt-2"
                      >
                        View Plans
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} border-t border-gray-200/10`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Main Links */}
            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Explore
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/experiments" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    All Experiments
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/resources" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Learning Resources
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/guides" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Lab Guides
                  </Link>
                </li>
              </ul>
            </div>

            {/* AI Features */}
            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI Features
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/ai-tutor" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    AI Tutor
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/smart-reports" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Smart Reports
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/video-insights" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Video Insights
                  </Link>
                </li>
              </ul>
            </div>

            {/* Plans */}
            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Plans
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/pricing" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Free Labs
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing/pro" 
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Pro Access
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing/team" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Team Plans
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:support@virtuallab.com" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Support
                  </a>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Links */}
          <div className={`mt-12 pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2024 Virtual Lab. All rights reserved.
              </div>
              
              <div className="flex items-center gap-6">
                <Link 
                  to="/privacy" 
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Privacy
                </Link>
                <Link 
                  to="/terms" 
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Terms
                </Link>
                <Link 
                  to="/cookies" 
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Premium AI Features Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Enhanced Learning with AI
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Experience the future of education with our AI-powered features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Tutor Card */}
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg border border-purple-100/20`}>
              <div className="bg-purple-100 rounded-lg p-3 inline-block mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI Tutor
              </h3>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Get personalized guidance and instant answers to your questions during experiments.
              </p>
              <div className="flex items-center text-sm text-purple-600">
                <span className="font-medium">Try with free lab</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            {/* Smart Reports Card */}
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg border border-blue-100/20`}>
              <div className="bg-blue-100 rounded-lg p-3 inline-block mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Smart Reports
              </h3>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                AI-generated lab reports with detailed analysis and insights from your experiments.
              </p>
              <div className="flex items-center text-sm text-blue-600">
                <span className="font-medium">Pro feature</span>
                <Zap className="h-4 w-4 ml-1" />
              </div>
            </div>

            {/* Video Explanations Card */}
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg border border-green-100/20`}>
              <div className="bg-green-100 rounded-lg p-3 inline-block mb-4">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                AI Video Insights
              </h3>
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Watch AI-narrated explanations of complex concepts and experiment procedures.
              </p>
              <div className="flex items-center text-sm text-green-600">
                <span className="font-medium">Pro feature</span>
                <Zap className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper Components
function CheckItem(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  image: string;
  text: string;
}

function TestimonialCard({ name, role, image, text }: TestimonialCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon 
            key={i} 
            className="h-4 w-4 text-yellow-400" 
            fill="currentColor" 
          />
        ))}
      </div>
      
      <p className="text-gray-600 italic">"{text}"</p>
    </div>
  );
}