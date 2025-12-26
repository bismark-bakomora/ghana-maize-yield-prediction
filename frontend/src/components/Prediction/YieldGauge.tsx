import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Sprout } from 'lucide-react'

interface YieldGaugeProps {
  yieldValue: number
  confidence: number // 0 - 1
  maxYield?: number
  riskLevel?: 'Low' | 'Medium' | 'High'
}

const YieldGauge: React.FC<YieldGaugeProps> = ({
  yieldValue,
  confidence,
  maxYield = 10,
  riskLevel = 'Low'
}) => {
  // Set color based on risk
  const color =
    riskLevel === 'Low' ? '#16a34a' : riskLevel === 'Medium' ? '#f59e0b' : '#dc2626'

  // Gauge percentage
  const percentage = Math.min((yieldValue / maxYield) * 100, 100)

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-4 left-4 opacity-20">
        <Sprout size={120} className="text-emerald-400" />
      </div>
      <h4 className="text-sm font-bold text-stone-500 uppercase mb-4">Predicted Yield</h4>
      <div className="w-40 h-40 mx-auto">
        <CircularProgressbar
          value={percentage}
          text={`${yieldValue.toFixed(2)} Mt/Ha`}
          strokeWidth={12}
          styles={buildStyles({
            pathColor: color,
            textColor: '#111827',
            trailColor: '#e5e7eb',
            textSize: '16px',
          })}
        />
      </div>
      <p className="text-center text-sm mt-4 text-stone-600">
        Confidence: {(confidence * 100).toFixed(0)}%
      </p>
      <div className={`mt-4 text-center font-bold ${
        riskLevel === 'Low' ? 'text-emerald-600' : riskLevel === 'Medium' ? 'text-amber-600' : 'text-red-600'
      }`}>
        {riskLevel} Production Risk
      </div>
    </div>
  )
}

export default YieldGauge
