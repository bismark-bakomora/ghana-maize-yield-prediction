import React, { useState } from 'react';
import { Loader2, Sprout, Info, ChevronRight, AlertTriangle, BarChart3, Lightbulb } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { usePrediction } from '../hooks/usePrediction';
import { PredictionInput } from '../types';
import { GHANA_DISTRICTS } from '../constants';
import { generateYieldExplanation, getYieldCategory, generateDetailedRecommendations, getYieldSummary } from '../utils/yieldInterpreter';

// Sub-component for grouping related inputs
const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-4 mb-8">
    <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider border-l-4 border-emerald-500 pl-3">
      {label}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  </div>
);

// Sub-component for reusable input fields
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  min?: number;
  max?: number;
  step?: string;
  options?: { label: string; value: string }[];
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "number", value, onChange, min, max, step, options }) => {
  if (options) {
    return (
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-stone-500 ml-1">{label}</label>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
        >
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-stone-500 ml-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
      />
    </div>
  );
};

const PredictionPage: React.FC = () => {
  const { createPrediction, currentPrediction, isLoading } = usePrediction();
  const [inputs, setInputs] = useState<PredictionInput>({
    district: '',
    year: new Date().getFullYear(),
    rainfall: 800,
    temperature: 27,
    humidity: 70,
    sunlight: 7,
    soilMoisture: 0.6,
    pestRisk: 20,
    pfjPolicy: true,
    yieldLag1: 2.2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'select-one' ? value :
              parseFloat(value) || 0
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!inputs.district) {
      alert('Please select a district');
      return;
    }
    
    try {
      await createPrediction(inputs);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    label: String(currentYear - 5 + i),
    value: String(currentYear - 5 + i)
  }));

  const districtOptions = GHANA_DISTRICTS.map(d => ({ label: d, value: d }));

  return (
    <Layout>
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-2">Maize Yield Predictor</h1>
            <p className="text-stone-500">Provide environmental and location data to estimate harvest yields.</p>
          </div>
          <div className="bg-stone-100 px-4 py-2 rounded-full flex items-center gap-2 text-stone-600 text-sm">
            <Info size={16} />
            <span>AI-powered predictions</span>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Form Column */}
          <div className="xl:col-span-3">
            <form onSubmit={handlePredict} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              
              {/* Location & Time */}
              <InputGroup label="Location & Time">
                <InputField 
                  label="District" 
                  name="district" 
                  type="select-one"
                  value={inputs.district} 
                  onChange={handleInputChange}
                  options={districtOptions}
                />
                <InputField 
                  label="Year" 
                  name="year" 
                  type="select-one"
                  value={inputs.year.toString()} 
                  onChange={handleInputChange}
                  options={yearOptions}
                />
                <InputField 
                  label="Previous Yield (Mt/Ha)" 
                  name="yieldLag1" 
                  value={inputs.yieldLag1} 
                  onChange={handleInputChange}
                  min={0}
                  step="0.1"
                />
                <div className="flex items-center gap-3 pt-6 px-2">
                  <input
                    type="checkbox"
                    id="pfjPolicy"
                    name="pfjPolicy"
                    checked={inputs.pfjPolicy}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="pfjPolicy" className="text-sm font-semibold text-stone-700">
                    PFJ Policy Active
                  </label>
                </div>
              </InputGroup>

              {/* Climate & Atmosphere */}
              <InputGroup label="Climate & Atmosphere">
                <InputField 
                  label="Rainfall (mm)" 
                  name="rainfall" 
                  value={inputs.rainfall} 
                  onChange={handleInputChange}
                  min={0}
                  max={2000}
                />
                <InputField 
                  label="Temperature (°C)" 
                  name="temperature" 
                  value={inputs.temperature} 
                  onChange={handleInputChange}
                  min={15}
                  max={40}
                  step="0.1"
                />
                <InputField 
                  label="Humidity (%)" 
                  name="humidity" 
                  value={inputs.humidity} 
                  onChange={handleInputChange}
                  min={0}
                  max={100}
                />
                <InputField 
                  label="Sunlight (hours/day)" 
                  name="sunlight" 
                  value={inputs.sunlight} 
                  onChange={handleInputChange}
                  min={0}
                  max={24}
                  step="0.1"
                />
              </InputGroup>

              {/* Soil & Risk Factors */}
              <InputGroup label="Soil & Risk Factors">
                <InputField 
                  label="Soil Moisture (0-1)" 
                  name="soilMoisture" 
                  value={inputs.soilMoisture} 
                  onChange={handleInputChange}
                  min={0}
                  max={1}
                  step="0.01"
                />
                <InputField 
                  label="Pest Risk (%)" 
                  name="pestRisk" 
                  value={inputs.pestRisk} 
                  onChange={handleInputChange}
                  min={0}
                  max={100}
                />
              </InputGroup>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sprout />}
                  {isLoading ? 'Analyzing Data...' : 'Predict Harvest Yield'}
                </button>
              </div>
            </form>
          </div>

          {/* Results Column */}
          <div className="xl:col-span-1 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
            {!currentPrediction && !isLoading && (
              <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center text-stone-400">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <BarChart3 size={32} />
                </div>
                <p className="font-medium text-stone-600">No Prediction Yet</p>
                <p className="text-xs max-w-[200px] mt-2">Fill the form and click predict to see AI-powered results here.</p>
              </div>
            )}

            {isLoading && (
              <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm animate-pulse space-y-6">
                <div className="h-48 bg-stone-100 rounded-2xl" />
                <div className="space-y-3">
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                  <div className="h-4 bg-stone-100 rounded w-1/2" />
                </div>
              </div>
            )}

            {currentPrediction && !isLoading && (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                {/* Main Yield Card */}
                <div className="bg-gradient-to-br from-emerald-50 to-stone-50 p-8 rounded-3xl shadow-xl border border-emerald-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-4xl">
                    {getYieldCategory(currentPrediction.predictedYield).emoji}
                  </div>
                  
                  <p className="text-xs font-bold text-emerald-700 uppercase mb-2 tracking-wide">Your Estimated Harvest</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <h2 className="text-6xl font-bold text-stone-900">
                      {currentPrediction.predictedYield.toFixed(2)}
                    </h2>
                    <span className="text-stone-600 font-semibold text-lg">Metric Tons/Hectare</span>
                  </div>

                  {/* Yield Category Badge */}
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                    getYieldCategory(currentPrediction.predictedYield).bgColor
                  } ${getYieldCategory(currentPrediction.predictedYield).textColor}`}>
                    {getYieldCategory(currentPrediction.predictedYield).category} Yield
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-3 mt-6 pt-6 border-t border-emerald-200">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-stone-600 uppercase">Prediction Confidence</span>
                        <span className="text-emerald-700 text-sm">
                          {(currentPrediction.confidence * 100).toFixed(0)}% Confident
                        </span>
                      </div>
                      <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000" 
                          style={{ width: `${currentPrediction.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Confidence Interval */}
                    <p className="text-xs text-stone-600">
                      Most likely range: <span className="font-semibold text-stone-800">
                        {currentPrediction.confidenceInterval?.lower.toFixed(2)} - {currentPrediction.confidenceInterval?.upper.toFixed(2)} Mt/Ha
                      </span>
                    </p>
                  </div>
                </div>

                {/* Plain Language Explanation */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-blue-100">
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-stone-900">
                    <Lightbulb size={20} className="text-blue-600" />
                    What This Means for Your Farm
                  </h4>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {generateYieldExplanation(currentPrediction.predictedYield, inputs.yieldLag1)}
                  </p>
                </div>

                {/* Quick Summary */}
                <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200">
                  <p className="text-sm text-stone-700 leading-relaxed italic">
                    💡 {getYieldSummary(currentPrediction.predictedYield, currentPrediction.confidence)}
                  </p>
                </div>

                {/* Detailed Recommendations */}
                <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white p-7 rounded-3xl shadow-xl">
                  <h4 className="font-bold mb-5 flex items-center gap-2 text-lg">
                    <ChevronRight size={22} className="text-emerald-300" />
                    Detailed Action Plan
                  </h4>
                  <ul className="space-y-4">
                    {generateDetailedRecommendations(
                      currentPrediction.predictedYield,
                      inputs,
                      currentPrediction.riskFactors || []
                    ).map((rec, i) => (
                      <li key={i} className="text-sm text-emerald-50 flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-700 flex-shrink-0 text-xs font-bold">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors */}
                {currentPrediction.riskFactors && currentPrediction.riskFactors.length > 0 && (
                  <div className="bg-amber-50 border-2 border-amber-200 text-amber-900 p-6 rounded-3xl">
                    <h4 className="font-bold mb-4 flex items-center gap-2 text-base">
                      <AlertTriangle size={20} />
                      Identified Risk Factors
                    </h4>
                    <ul className="space-y-2">
                      {currentPrediction.riskFactors.map((risk, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Model & Confidence Info */}
                <div className="bg-stone-100 p-4 rounded-2xl text-xs text-stone-600">
                  <p>Model: <span className="font-semibold">{currentPrediction.modelVersion}</span></p>
                  <p className="mt-1">This prediction is based on your location, weather patterns, soil conditions, and farming practices.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PredictionPage;