import React from 'react'
import { BarChart3, CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react'
import { PredictionResult } from '../services/predictionService'

interface ResultDisplayProps {
  result: PredictionResult | null
  isLoading: boolean
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading }) => {
  if (!result && !isLoading) {
    return (
      <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center text-stone-400">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <BarChart3 size={32} />
        </div>
        <p className="font-medium text-stone-600">No Prediction Yet</p>
        <p className="text-xs max-w-[200px] mt-2">Fill the form and click predict to see AI-powered results here.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm animate-pulse space-y-6">
        <div className="h-48 bg-stone-100 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-stone-100 rounded w-3/4" />
          <div className="h-4 bg-stone-100 rounded w-1/2" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          {result.riskLevel === 'Low' ? <CheckCircle2 className="text-emerald-500" /> : <AlertTriangle className="text-amber-500" />}
        </div>

        <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Estimated Yield</p>
        <div className="flex items-baseline gap-2 mb-6">
          <h2 className="text-5xl font-bold text-stone-900">{result.predictedYield.toFixed(2)}</h2>
          <span className="text-stone-500 font-medium">Mt/Ha</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-stone-500 uppercase">Confidence</span>
              <span className="text-emerald-600">{(result.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl flex items-center gap-3 ${result.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            <ShieldCheck size={20} />
            <span className="text-sm font-bold">{result.riskLevel} Production Risk</span>
          </div>
        </div>
      </div>

      <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-lg">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <ChevronRight size={18} className="text-emerald-400" />
          Key Recommendations
        </h4>
        <ul className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="text-sm text-stone-300 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ResultDisplay
