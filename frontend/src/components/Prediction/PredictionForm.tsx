import React from 'react'
import { InputField, InputGroup } from '../components/Common/Input'
import { GHANA_DISTRICTS } from '../utils/constants'
import { Sprout, Loader2, Info } from 'lucide-react'
import { PredictionInput } from '../services/predictionService'

interface PredictionFormProps {
  inputs: PredictionInput
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

const PredictionForm: React.FC<PredictionFormProps> = ({ inputs, onChange, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      <InputGroup label="Location & General">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-stone-500 ml-1">District</label>
          <select
            name="district"
            value={inputs.district}
            onChange={onChange}
            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
          >
            {GHANA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <InputField label="Yield Lag1 (Mt/Ha)" name="yieldLag1" value={inputs.yieldLag1} onChange={onChange} step="0.1" />
        <InputField label="Years Since PFJ" name="yearsSincePFJ" value={inputs.yearsSincePFJ} onChange={onChange} />
        <div className="flex items-center gap-3 pt-6 px-2">
          <input
            type="checkbox"
            id="pfjPolicy"
            name="pfjPolicy"
            checked={inputs.pfjPolicy}
            onChange={onChange}
            className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="pfjPolicy" className="text-sm font-semibold text-stone-700">PFJ Policy Active</label>
        </div>
      </InputGroup>

      <InputGroup label="Climate & Atmosphere">
        <InputField label="Rainfall (mm)" name="rainfall" value={inputs.rainfall} onChange={onChange} />
        <InputField label="Temperature (°C)" name="temperature" value={inputs.temperature} onChange={onChange} />
        <InputField label="Humidity (%)" name="humidity" value={inputs.humidity} onChange={onChange} />
        <InputField label="Sunlight (hrs)" name="sunlight" value={inputs.sunlight} onChange={onChange} />
      </InputGroup>

      <InputGroup label="Advanced Metrics">
        <InputField label="Soil Moisture (%)" name="soilMoisture" value={inputs.soilMoisture} onChange={onChange} />
        <InputField label="Pest Risk (%)" name="pestRisk" value={inputs.pestRisk} onChange={onChange} />
        <InputField label="Growing Deg Days" name="growingDegreeDays" value={inputs.growingDegreeDays} onChange={onChange} />
        <InputField label="Water Availability" name="waterAvailability" value={inputs.waterAvailability} onChange={onChange} step="0.01" />
        <InputField label="Climate Stress" name="climateStress" value={inputs.climateStress} onChange={onChange} step="0.01" />
        <InputField label="Moist-Temp Ratio" name="moistureTempRatio" value={inputs.moistureTempRatio} onChange={onChange} step="0.1" />
        <InputField label="Rainfall per Sun" name="rainfallPerSun" value={inputs.rainfallPerSun} onChange={onChange} />
        <InputField label="Yield Growth Rate (%)" name="yieldGrowthRate" value={inputs.yieldGrowthRate} onChange={onChange} step="0.1" />
      </InputGroup>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-12 rounded-2xl shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Sprout />}
          {isLoading ? 'Analyzing Data...' : 'Predict Harvest Yield'}
        </button>
      </div>
    </form>
  )
}

export default PredictionForm
