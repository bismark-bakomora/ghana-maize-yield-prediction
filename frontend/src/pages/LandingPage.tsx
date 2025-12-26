import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  BarChart3, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  Globe, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import Footer from '../components/Layout/Footer';
import maize from '../assets/images/maize farm.png'

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="bg-stone-50 overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-emerald-600" />
              <span className="ml-2 text-xl font-bold text-stone-900">Crop Yield Predictor</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">
                Features
              </a>
              <a href="#about" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">
                About
              </a>
              {isAuthenticated ? (
                <Link
                  to={ROUTES.DASHBOARD}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to={ROUTES.AUTH}
                    className="text-stone-600 hover:text-emerald-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.AUTH}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-stone-100">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-stone-600 hover:text-emerald-600 font-medium">
                  Features
                </a>
                <a href="#about" className="text-stone-600 hover:text-emerald-600 font-medium">
                  About
                </a>
                {isAuthenticated ? (
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 text-center"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to={ROUTES.AUTH} className="text-stone-600 hover:text-emerald-600 font-medium">
                      Sign In
                    </Link>
                    <Link
                      to={ROUTES.AUTH}
                      className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-8">
              <Star size={14} />
              Empowering Ghanaian Farmers
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-8 tracking-tight leading-tight">
              The Future of Maize Farming is <span className="text-emerald-600">Data-Driven</span>.
            </h1>
            <p className="text-xl text-stone-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Harness the power of AI to predict yields, manage risks, and optimize your harvest in alignment with Ghana's Planting for Food and Jobs initiative.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to={ROUTES.DASHBOARD}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <Link
                  to={ROUTES.AUTH}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Get Started for Free
                  <ArrowRight size={20} />
                </Link>
              )}
              <a
                href="#features"
                className="w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-900 font-bold py-4 px-10 rounded-2xl border border-stone-200 transition-all flex items-center justify-center"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Cards Section */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Years of Data */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <BarChart3 className="text-emerald-600" size={26} />
              </div>
              <div className="text-4xl font-bold text-stone-900 mb-2">11</div>
              <p className="text-stone-600 font-medium">
                Years of Historical Data
              </p>
              <p className="text-sm text-stone-400 mt-2">
                2011 – 2021 maize production records
              </p>
            </div>

            {/* Model Accuracy */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="text-emerald-600" size={26} />
              </div>
              <div className="text-4xl font-bold text-stone-900 mb-2">95.0%</div>
              <p className="text-stone-600 font-medium">
                Model Prediction Accuracy
              </p>
              <p className="text-sm text-stone-400 mt-2">
                Based on Mean Absolute Percentage Error (MAPE)
              </p>
            </div>

            {/* Regions */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Globe className="text-emerald-600" size={26} />
              </div>
              <div className="text-4xl font-bold text-stone-900 mb-2">16</div>
              <p className="text-stone-600 font-medium">
                Regions Covered
              </p>
              <p className="text-sm text-stone-400 mt-2">
                Nationwide maize production data
              </p>
            </div>

            {/* Variables */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center hover:shadow-xl transition-all">
              <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Sprout className="text-emerald-600" size={26} />
              </div>
              <div className="text-4xl font-bold text-stone-900 mb-2">10+</div>
              <p className="text-stone-600 font-medium">
                Key Yield Drivers
              </p>
              <p className="text-sm text-stone-400 mt-2">
                Climate, soil & input variables
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6">Designed for Modern Agriculture</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Our platform combines local agricultural expertise with world-class artificial intelligence to provide actionable insights for every farm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Smart Yield Prediction",
              desc: "Input environmental and soil data to get hyper-local yield estimates before you even plant.",
              icon: <Sprout className="text-emerald-600" size={24} />,
              color: "bg-emerald-50"
            },
            {
              title: "Market Insights",
              desc: "Stay ahead of price trends and policy changes like PFJ Phase 2 with our curated learning modules.",
              icon: <BookOpen className="text-amber-600" size={24} />,
              color: "bg-amber-50"
            },
            {
              title: "Risk Analysis",
              desc: "Evaluate pest risks and climate stress factors to build a more resilient farming business.",
              icon: <TrendingUp className="text-blue-600" size={24} />,
              color: "bg-blue-50"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">{feature.title}</h3>
              <p className="text-stone-600 leading-relaxed mb-6">{feature.desc}</p>
              <div className="flex items-center text-emerald-600 font-bold text-sm">
                Learn more <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PFJ Initiative Section */}
      <section id="about" className="py-24 bg-stone-900 text-white relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase mb-6">
                <Globe size={14} />
                National Policy Support
              </div>
              <h2 className="text-4xl font-bold mb-8 leading-tight">Supporting Ghana's Planting for Food and Jobs Program</h2>
              <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                Crop Predictor is built to support the Ministry of Agriculture's goals. We help farmers maximize the benefits of subsidized inputs and modernize their data collection practices for the PFJ Phase 2 initiative.
              </p>
              <div className="space-y-4">
                {[
                  "Optimized Fertilizer Application",
                  "Climate-Resilient Seed Selection",
                  "Digital Record Keeping for Subsidies"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={maize} 
                  alt="Ghanaian Maize Farm"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-emerald-600 p-8 rounded-2xl shadow-xl max-w-[240px]">
                <p className="text-2xl font-bold text-white mb-2">2x</p>
                <p className="text-sm text-emerald-100">Average yield increase reported by data-driven farms in 2023.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to transform your harvest?</h2>
              <p className="text-emerald-100 text-lg mb-12 max-w-xl mx-auto">
                Join the digital revolution in Ghanaian agriculture. Accurate predictions are just a few clicks away.
              </p>
              {isAuthenticated ? (
                <Link
                  to={ROUTES.DASHBOARD}
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold py-4 px-12 rounded-2xl shadow-lg hover:bg-stone-50 transition-all hover:-translate-y-1"
                >
                  Return to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <Link
                  to={ROUTES.AUTH}
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold py-4 px-12 rounded-2xl shadow-lg hover:bg-stone-50 transition-all hover:-translate-y-1"
                >
                  Join Now
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sprout size={200} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;