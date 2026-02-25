/**
 * Yield Interpreter - Plain Language Explanations for Farmers
 * Converts technical predictions into easy-to-understand farmer-friendly language
 */

import { PredictionInput } from '../types';

/**
 * Generates a plain language explanation of the predicted yield
 * Helps farmers understand what the number means in practical terms
 */
export const generateYieldExplanation = (yieldValue: number, yieldLag1: number): string => {
  const yieldGrowth = yieldValue - yieldLag1;
  const growthPercentageNum = (yieldGrowth / yieldLag1) * 100;

  if (yieldValue < 1.0) {
    return `Your predicted harvest is very low (${yieldValue.toFixed(2)} Mt/Ha). This suggests significant challenges in growing conditions or farm practices. Urgent action needed for next season.`;
  } else if (yieldValue < 1.5) {
    return `Your predicted harvest is below average (${yieldValue.toFixed(2)} Mt/Ha). Compared to your previous yield of ${yieldLag1.toFixed(2)} Mt/Ha, this represents a ${growthPercentageNum < 0 ? 'decrease' : 'increase'} of ${Math.abs(growthPercentageNum).toFixed(0)}%. Focus on improving soil health and pest management.`;
  } else if (yieldValue < 2.0) {
    return `Your predicted harvest is moderate (${yieldValue.toFixed(2)} Mt/Ha). While reasonable, there's room for improvement. Compared to your previous yield of ${yieldLag1.toFixed(2)} Mt/Ha, you're ${growthPercentageNum < 0 ? 'down' : 'up'} by ${Math.abs(growthPercentageNum).toFixed(0)}%. Small improvements in water management can help.`;
  } else if (yieldValue < 2.5) {
    return `Your predicted harvest is good (${yieldValue.toFixed(2)} Mt/Ha)! This is solid production. Compared to your previous yield of ${yieldLag1.toFixed(2)} Mt/Ha, you're ${growthPercentageNum < 0 ? 'down' : 'up'} by ${Math.abs(growthPercentageNum).toFixed(0)}%. Continue your current practices with minor adjustments.`;
  } else if (yieldValue < 3.0) {
    return `Your predicted harvest is very good (${yieldValue.toFixed(2)} Mt/Ha)! Excellent production ahead. Compared to your previous yield of ${yieldLag1.toFixed(2)} Mt/Ha, that's an increase of ${Math.abs(growthPercentageNum).toFixed(0)}%. Your farming practices are working well—maintain them consistently.`;
  } else {
    return `Your predicted harvest is excellent (${yieldValue.toFixed(2)} Mt/Ha)! Outstanding production expected. Compared to your previous yield of ${yieldLag1.toFixed(2)} Mt/Ha, you're seeing remarkable growth of ${Math.abs(growthPercentageNum).toFixed(0)}%. You're implementing best practices effectively.`;
  }
};

/**
 * Categorizes yield into simple, understandable levels
 */
export const getYieldCategory = (yieldValue: number): {
  category: string;
  emoji: string;
  color: string;
  textColor: string;
  bgColor: string;
} => {
  if (yieldValue < 1.0) {
    return {
      category: 'Critical',
      emoji: '⚠️',
      color: 'red',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
    };
  } else if (yieldValue < 1.5) {
    return {
      category: 'Low',
      emoji: '📉',
      color: 'orange',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
    };
  } else if (yieldValue < 2.0) {
    return {
      category: 'Moderate',
      emoji: '📊',
      color: 'yellow',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
    };
  } else if (yieldValue < 2.5) {
    return {
      category: 'Good',
      emoji: '✅',
      color: 'emerald',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
    };
  } else if (yieldValue < 3.0) {
    return {
      category: 'Very Good',
      emoji: '🌟',
      color: 'green',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
    };
  } else {
    return {
      category: 'Excellent',
      emoji: '🏆',
      color: 'emerald',
      textColor: 'text-emerald-800',
      bgColor: 'bg-emerald-50',
    };
  }
};

/**
 * Generates detailed, actionable recommendations based on yield and input conditions
 */
export const generateDetailedRecommendations = (
  yieldValue: number,
  inputs: PredictionInput,
  _riskFactors?: string[]
): string[] => {
  const recommendations: string[] = [];

  // WATER & RAINFALL RECOMMENDATIONS
  if (inputs.rainfall < 500) {
    recommendations.push(
      '🌧️ Critical water shortage detected. Install drip irrigation or rainwater harvesting systems to maximize available moisture. This is your highest priority.'
    );
  } else if (inputs.rainfall < 600) {
    recommendations.push(
      '💧 Rainfall is below optimal levels. Improve soil water retention by adding mulch and organic matter. Consider supplementary watering during dry spells.'
    );
  } else if (inputs.rainfall > 1000) {
    recommendations.push(
      '⚠️ Excess rainfall may cause waterlogging. Ensure proper drainage systems are in place. Consider raised beds or improved field drainage.'
    );
  } else {
    recommendations.push(
      '✅ Rainfall levels are good. Maintain consistent moisture levels through regular monitoring and light irrigation as needed.'
    );
  }

  // SOIL MOISTURE RECOMMENDATIONS
  if (inputs.soilMoisture < 0.4) {
    recommendations.push(
      '🏜️ Soil is very dry. Add organic compost or manure to improve water-holding capacity. This will help plants access water better during dry periods.'
    );
  } else if (inputs.soilMoisture < 0.5) {
    recommendations.push(
      '🌱 Soil moisture is tight. Apply mulch (straw, grass, leaves) around plants to reduce evaporation and keep soil cooler.'
    );
  } else if (inputs.soilMoisture > 0.8) {
    // cSpell:disable-next-line
    recommendations.push(
      '💦 Soil moisture is high. Ensure good field drainage to prevent root rot and fungal diseases. Avoid overwatering.'
    );
  } else {
    recommendations.push(
      '💧 Soil moisture is in the ideal range. Continue monitoring and adjust watering based on rainfall and crop growth stage.'
    );
  }

  // TEMPERATURE RECOMMENDATIONS
  if (inputs.temperature > 32) {
    recommendations.push(
      '🌡️ Temperature stress is a concern. Provide shade where possible, ensure adequate water supply, and consider heat-tolerant varieties for future seasons.'
    );
  } else if (inputs.temperature < 18) {
    recommendations.push(
      '❄️ Temperature is cooler than ideal. Maize prefers 20-30°C. Consider timing your planting for warmer months if possible.'
    );
  } else {
    recommendations.push(
      '🌤️ Temperature conditions are favorable for maize growth. Maintain this by protecting crops from extreme weather.'
    );
  }

  // SUNSHINE RECOMMENDATIONS
  if (inputs.sunlight < 5) {
    recommendations.push(
      '☀️ Low sunlight hours detected. Remove any shade-causing obstacles or trees. Maize needs at least 6-8 hours of direct sunlight daily for optimal growth.'
    );
  } else if (inputs.sunlight < 6) {
    recommendations.push(
      '🌅 Sunlight hours are a bit low. Check for and remove any obstacles blocking sunlight. Clear dense weeds that might shade plants.'
    );
  } else {
    recommendations.push(
      '☀️ Sunlight levels are excellent. Continue to maintain clear fields to maximize photosynthesis.'
    );
  }

  // PEST MANAGEMENT RECOMMENDATIONS
  if (inputs.pestRisk > 50) {
    recommendations.push(
      '🦗 High pest risk identified. Implement integrated pest management: scout fields regularly, use resistant varieties, apply organic or approved pesticides early. Training available through extension services.'
    );
  } else if (inputs.pestRisk > 25) {
    recommendations.push(
      '🐛 Moderate pest risk noted. Monitor fields weekly for early signs of pests. Consider preventive measures like crop rotation and maintaining field hygiene.'
    );
  } else {
    recommendations.push(
      '✅ Pest risk is low. Continue regular field monitoring and maintain good farm hygiene practices.'
    );
  }

  // POLICY & SUPPORT RECOMMENDATIONS
  if (!inputs.pfjPolicy) {
    recommendations.push(
      '📋 PFJ (Planting for Food and Jobs) Policy support is NOT active. Enroll in PFJ to access free improved seeds, fertilizers, and extension services. Contact your district agricultural office for enrollment.'
    );
  } else {
    recommendations.push(
      '✅ You are enrolled in the PFJ program. Ensure you collect all available inputs and attend training sessions to maximize benefits.'
    );
  }

  // YIELD-SPECIFIC RECOMMENDATIONS
  if (yieldValue < 1.5) {
    recommendations.push(
      '📚 Your yield is significantly below potential. Schedule a consultation with your district extension officer to assess soil nutrients, pest problems, and management practices. Consider soil testing.'
    );
  } else if (yieldValue >= 2.5 && yieldValue < 3.0) {
    recommendations.push(
      '🎯 You\'re on track for good yields. Fine-tune your practices: ensure timely planting, maintain proper plant spacing, and use quality seeds and fertilizers.'
    );
  } else if (yieldValue >= 3.0) {
    recommendations.push(
      '🏆 You\'re achieving excellent yields! Document your successful practices so you can replicate them every season. Consider sharing your methods with neighboring farmers.'
    );
  }

  // HISTORICAL YIELD COMPARISON
  const yieldChange = inputs.yieldLag1 - yieldValue;
  if (yieldChange > 0.5) {
    recommendations.push(
      `📈 Your yield is expected to drop by ${yieldChange.toFixed(2)} Mt/Ha compared to your previous yield. Investigate what changed—review weather, pests, soil conditions, and management practices to identify issues.`
    );
  } else if (yieldChange < -0.3) {
    recommendations.push(
      `📊 Your yield is expected to improve by ${Math.abs(yieldChange).toFixed(2)} Mt/Ha compared to your previous yield. Great progress! Identify what worked better this season and maintain those practices.`
    );
  }

  // Return top recommendations (max 8, prioritized)
  return recommendations.slice(0, 8);
};

/**
 * Generates a summary statement for quick understanding
 */
export const getYieldSummary = (yieldValue: number, confidence: number): string => {
  const confidencePercent = Math.round(confidence * 100);

  if (confidencePercent >= 85) {
    return `We are very confident (${confidencePercent}%) your farm will produce around ${yieldValue.toFixed(2)} Mt/Ha.`;
  } else if (confidencePercent >= 70) {
    return `We are confident (${confidencePercent}%) your farm will produce around ${yieldValue.toFixed(2)} Mt/Ha.`;
  } else {
    return `Based on current conditions, we estimate production around ${yieldValue.toFixed(2)} Mt/Ha (${confidencePercent}% confidence).`;
  }
};
