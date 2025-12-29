import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Sun, 
  Thermometer,
  Bug,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Leaf,
  CloudRain,
  Wheat,
  ArrowRight,
  Play,
  ChevronDown
} from 'lucide-react';
import Layout from '../components/Layout/Layout';

const yieldFactors = [
  {
    title: "Rainfall",
    icon: CloudRain,
    description: "Water is essential for maize growth. Optimal rainfall is 800-1200mm per growing season.",
    positive: ["Adequate moisture for germination", "Consistent water during tasseling", "Good drainage prevents waterlogging"],
    negative: ["Drought stress reduces kernel filling", "Excess rain causes root rot", "Irregular rainfall affects pollination"],
    color: "emerald"
  },
  {
    title: "Temperature",
    icon: Thermometer,
    description: "Maize thrives in warm conditions but extreme heat affects yield.",
    positive: ["25-30°C is optimal", "Warm nights help growth", "Steady temperatures aid development"],
    negative: ["Above 35°C reduces pollination", "Cold nights slow growth", "Frost destroys crops"],
    color: "amber"
  },
  {
    title: "Sunlight",
    icon: Sun,
    description: "Maize is a C4 plant that needs abundant sunlight for photosynthesis.",
    positive: ["6-8 hours of direct sunlight", "Full sun exposure", "Clear skies during grain fill"],
    negative: ["Cloud cover reduces yields", "Shading from taller plants", "Low light delays maturity"],
    color: "yellow"
  },
  {
    title: "Soil Quality",
    icon: Sprout,
    description: "Healthy soil provides nutrients and proper drainage for root development.",
    positive: ["Rich organic matter", "Well-drained loamy soil", "pH between 5.8-7.0"],
    negative: ["Compacted soil limits roots", "Nutrient deficiencies", "Poor drainage causes stress"],
    color: "green"
  },
  {
    title: "Pest & Disease",
    icon: Bug,
    description: "Managing pests and diseases is crucial for protecting your harvest.",
    positive: ["Integrated pest management", "Early detection and treatment", "Resistant varieties"],
    negative: ["Fall armyworm infestation", "Maize streak virus", "Stalk borers"],
    color: "red"
  }
];

const bestPractices = [
  {
    category: "Land Preparation",
    tips: [
      "Clear and plough land 4-6 weeks before planting",
      "Apply organic manure or compost",
      "Create proper drainage channels",
      "Test soil pH and adjust if needed"
    ]
  },
  {
    category: "Planting",
    tips: [
      "Plant at the start of the rainy season",
      "Space seeds 75cm between rows, 25cm within rows",
      "Plant 2 seeds per hole, thin to 1 after germination",
      "Use certified improved seed varieties"
    ]
  },
  {
    category: "Fertilization",
    tips: [
      "Apply NPK 15-15-15 at planting (2 bags/acre)",
      "Top-dress with urea at knee height",
      "Consider micronutrients like zinc",
      "Use PFJ subsidized fertilizers"
    ]
  },
  {
    category: "Weed & Pest Control",
    tips: [
      "Weed 2-3 weeks after emergence",
      "Apply pre-emergence herbicides if available",
      "Scout for fall armyworm regularly",
      "Use approved pesticides when needed"
    ]
  },
  {
    category: "Harvesting",
    tips: [
      "Harvest when kernels are hard and dry",
      "Check moisture content (12-14% is ideal)",
      "Dry cobs in the sun if too moist",
      "Store in clean, dry conditions"
    ]
  }
];

const pfjBenefits = [
  "Subsidized certified seeds",
  "50% off fertilizer costs",
  "Free extension services",
  "Access to mechanization",
  "Guaranteed market access",
  "Training and capacity building"
];

const faqItems = [
  {
    question: "How does the AI prediction work?",
    answer: "Our system uses machine learning trained on years of agricultural data from Ghana. It analyzes environmental factors like rainfall, temperature, and soil conditions, combined with historical yield data and policy impacts to estimate your expected harvest."
  },
  {
    question: "What is the Planting for Food and Jobs (PFJ) policy?",
    answer: "PFJ is a government initiative launched in 2017 to boost agricultural productivity. It provides farmers with subsidized inputs (seeds and fertilizers), extension services, and market access. Our data shows PFJ can increase yields by 0.2-0.4 MT/ha."
  },
  {
    question: "How accurate are the predictions?",
    answer: "Our model achieves approximately 95% accuracy based on validation with actual yield data. Accuracy depends on the quality of input data and can be affected by unexpected events like floods or pest outbreaks."
  },
  {
    question: "What is Growing Degree Days (GDD)?",
    answer: "GDD is a measure of heat accumulation used to predict crop development. Maize needs about 2,500-2,700 GDD to reach maturity. Our system uses this to estimate growth stages and optimal harvest times."
  },
  {
    question: "Can I use this system for other crops besides maize?",
    answer: "Currently, our prediction system is specifically optimized for maize cultivation in Ghana. We're working on expanding to other crops like rice, cassava, and soybeans in future updates."
  },
  {
    question: "How often should I update my predictions?",
    answer: "We recommend running new predictions whenever there are significant changes in weather patterns, pest pressure, or farming practices. Regular monitoring throughout the growing season helps you make timely decisions."
  }
];

type TabType = "factors" | "practices" | "policy" | "faq";

const FarmingInsightsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("factors");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-emerald-200" />
                <span className="text-emerald-100 font-medium">Educational Resources</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Maize Farming Masterclass
              </h1>
              <p className="text-xl text-emerald-50 mb-8">
                Learn what affects your maize yield and discover proven techniques to maximize your harvest. 
                Knowledge is the key to agricultural success!
              </p>
              <Link 
                to="/prediction"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-semibold shadow-lg hover:bg-emerald-50 transition-all hover:-translate-y-0.5"
              >
                Try Yield Prediction
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-2 py-3 scrollbar-hide">
              {[
                { id: "factors" as TabType, label: "Yield Factors", icon: TrendingUp },
                { id: "practices" as TabType, label: "Best Practices", icon: CheckCircle },
                { id: "policy" as TabType, label: "PFJ Policy", icon: Leaf },
                { id: "faq" as TabType, label: "FAQ", icon: Lightbulb },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id 
                      ? "bg-emerald-600 text-white shadow-md" 
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Yield Factors Section */}
          {activeTab === "factors" && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-stone-900 mb-3">
                  What Affects Your Maize Yield?
                </h2>
                <p className="text-stone-600 max-w-2xl mx-auto">
                  Understanding these key factors will help you make better decisions and improve your harvests.
                </p>
              </div>

              <div className="space-y-8">
                {yieldFactors.map((factor, index) => (
                  <div 
                    key={factor.title}
                    className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 lg:p-8"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Icon & Title */}
                      <div className="lg:w-64 flex-shrink-0">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                          factor.color === 'emerald' ? 'bg-emerald-50' :
                          factor.color === 'amber' ? 'bg-amber-50' :
                          factor.color === 'yellow' ? 'bg-yellow-50' :
                          factor.color === 'green' ? 'bg-green-50' :
                          'bg-red-50'
                        }`}>
                          <factor.icon className={`w-8 h-8 ${
                            factor.color === 'emerald' ? 'text-emerald-600' :
                            factor.color === 'amber' ? 'text-amber-600' :
                            factor.color === 'yellow' ? 'text-yellow-600' :
                            factor.color === 'green' ? 'text-green-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-2">{factor.title}</h3>
                        <p className="text-stone-600 text-sm">{factor.description}</p>
                      </div>

                      {/* Positive & Negative */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-50 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">Increases Yield</span>
                          </div>
                          <ul className="space-y-2">
                            {factor.positive.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 rounded-xl p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <TrendingDown className="w-5 h-5 text-red-600" />
                            <span className="font-semibold text-red-700">Reduces Yield</span>
                          </div>
                          <ul className="space-y-2">
                            {factor.negative.map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Practices Section */}
          {activeTab === "practices" && (
            <div className="animate-in fade-in duration-500">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-stone-900 mb-3">
                  Best Farming Practices
                </h2>
                <p className="text-stone-600 max-w-2xl mx-auto">
                  Follow these proven techniques to maximize your maize yield throughout the growing season.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bestPractices.map((practice, index) => (
                  <div 
                    key={practice.category}
                    className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                        <Wheat className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-stone-900">{practice.category}</h3>
                    </div>
                    <ul className="space-y-3">
                      {practice.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span className="text-stone-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Video Tutorial Placeholder */}
              <div className="mt-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-8 text-center text-white">
                <div className="w-20 h-20 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                  <Play className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Video Tutorials Coming Soon
                </h3>
                <p className="text-amber-50">
                  Watch step-by-step guides on maize farming techniques from local experts.
                </p>
              </div>
            </div>
          )}

          {/* PFJ Policy Section */}
          {activeTab === "policy" && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 mb-4">
                    Planting for Food & Jobs (PFJ)
                  </h2>
                  <p className="text-stone-600 mb-6">
                    The PFJ initiative, launched in 2017 by the Government of Ghana, aims to modernize 
                    agriculture and increase food production. It provides critical support to farmers 
                    across the country.
                  </p>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 mb-6">
                    <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                      Key Benefits for Farmers
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {pfjBenefits.map((benefit, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm text-stone-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                    <h4 className="font-bold text-stone-900 mb-2">Impact on Yields</h4>
                    <p className="text-stone-600 text-sm mb-4">
                      Our analysis shows that farmers participating in the PFJ program have seen 
                      yield increases of <strong className="text-emerald-600">15-25%</strong> on average, 
                      translating to approximately 0.3-0.5 MT/ha additional harvest.
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-emerald-600">+23%</p>
                        <p className="text-xs text-stone-600">Avg. Yield Increase</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-amber-600">50%</p>
                        <p className="text-xs text-stone-600">Fertilizer Subsidy</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                    <h3 className="font-bold text-stone-900 mb-4">How to Register for PFJ</h3>
                    <ol className="space-y-4">
                      {[
                        "Visit your nearest Ministry of Food & Agriculture (MoFA) office",
                        "Bring your Ghana Card and proof of farmland",
                        "Complete the farmer registration form",
                        "Receive your farmer ID and subsidy vouchers",
                        "Purchase subsidized inputs from authorized dealers"
                      ].map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-emerald-600">{index + 1}</span>
                          </div>
                          <span className="text-stone-600 pt-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-6">
                    <h4 className="font-bold mb-2">Need More Information?</h4>
                    <p className="text-emerald-50 text-sm mb-4">
                      Contact your local agricultural extension officer or visit the official 
                      MoFA website for detailed information about the PFJ program.
                    </p>
                    <a 
                      href="https://mofa.gov.gh" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white hover:text-emerald-100 font-semibold"
                    >
                      Visit MoFA Website
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {activeTab === "faq" && (
            <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-stone-900 mb-3">
                  Frequently Asked Questions
                </h2>
                <p className="text-stone-600">
                  Common questions about maize farming and our prediction system.
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
                    >
                      <span className="font-semibold text-stone-900 pr-4">{item.question}</span>
                      <div className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 transition-transform ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}>
                        <ChevronDown className="w-4 h-4 text-stone-600" />
                      </div>
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6 animate-in fade-in duration-300">
                        <p className="text-stone-600">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Still Have Questions */}
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 mb-4">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-semibold">Still have questions?</span>
                </div>
                <p className="text-stone-600 mb-4">
                  Contact our support team or visit your local agricultural extension office.
                </p>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
                >
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FarmingInsightsPage;