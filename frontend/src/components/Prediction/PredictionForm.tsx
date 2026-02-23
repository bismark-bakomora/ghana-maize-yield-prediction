import React from 'react'
import Input from '../Common/Input'
import { GHANA_DISTRICTS } from '../../utils/constants'
import { Sprout, Loader2 } from 'lucide-react'
import type { PredictionInput } from '../../types'

interface PredictionFormProps {
  inputs: PredictionInput
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

/* ---------- Helper Components ---------- */

interface InputGroupProps {
  label: string
  children: React.ReactNode
}

const InputGroup: React.FC<InputGroupProps> = ({ label, children }) => (
  <div className="space-y-4 mb-8">
    <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wide">
      {label}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
)

interface InputFieldProps {
  label: string
  name: string
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  step?: string
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  step = '1',
}) => (
  <Input
    label={label}
    type="number"
    name={name}
    value={value}
    onChange={onChange}
    step={step}
    required
  />
)

/* ---------- Main Component ---------- */

const PredictionForm: React.FC<PredictionFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100"
    >
      {/* Location & General */}
      <InputGroup label="Location & General">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <select
            name="district"
            value={inputs.district}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {GHANA_DISTRICTS.map((d: string) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="Yield Lag1 (Mt/Ha)"
          name="yieldLag1"
          value={inputs.yieldLag1}
          onChange={onChange}
          step="0.1"
        />

        <InputField
          label="Year"
          name="year"
          value={inputs.year}
          onChange={onChange}
        />

        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            name="pfjPolicy"
            checked={inputs.pfjPolicy}
            onChange={onChange}
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700">
            PFJ Policy Active
          </span>
        </div>
      </InputGroup>

      {/* Climate */}
      <InputGroup label="Climate & Atmosphere">
        <InputField
          label="Rainfall (mm)"
          name="rainfall"
          value={inputs.rainfall}
          onChange={onChange}
        />
        <InputField
          label="Temperature (°C)"
          name="temperature"
          value={inputs.temperature}
          onChange={onChange}
        />
        <InputField
          label="Humidity (%)"
          name="humidity"
          value={inputs.humidity}
          onChange={onChange}
        />
        <InputField
          label="Sunlight (hrs)"
          name="sunlight"
          value={inputs.sunlight}
          onChange={onChange}
        />
      </InputGroup>

      {/* Advanced */}
      <InputGroup label="Advanced Metrics">
        <InputField
          label="Soil Moisture (%)"
          name="soilMoisture"
          value={inputs.soilMoisture}
          onChange={onChange}
        />
        <InputField
          label="Pest Risk (%)"
          name="pestRisk"
          value={inputs.pestRisk}
          onChange={onChange}
        />
      </InputGroup>

      {/* Submit */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Sprout />}
          {isLoading ? 'Analyzing Data...' : 'Predict Harvest Yield'}
        </button>
      </div>
    </form>
  )
}

export default PredictionForm