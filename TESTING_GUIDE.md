# Testing Guide - Enhanced Prediction Page

## How to Test the New Features

### Prerequisites
- Backend running on `http://localhost:8000`
- Frontend dependencies installed

### Quick Start

```powershell
# Terminal 1: Start Backend
cd c:\Users\bisma\Desktop\work\ghana-maize-yield-prediction
& venv\Scripts\Activate.ps1
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Start Frontend
cd c:\Users\bisma\Desktop\work\ghana-maize-yield-prediction\frontend
npm run dev
```

### Test Scenarios

#### Test 1: Critical/Low Yield
**Expected Result:** Red/Orange alerts with urgent recommendations

**Input Values:**
- District: Kumasi Metropolitan
- Year: 2026
- Rainfall: 420 mm ← Below optimal (< 500)
- Temperature: 33°C ← High stress (> 32)
- Humidity: 55%
- Sunlight: 4.5 hours ← Low (< 6)
- Soil Moisture: 0.3 ← Very dry (< 0.4)
- Pest Risk: 75% ← High
- PFJ Policy: OFF ← Not enrolled
- Previous Yield: 2.5 Mt/Ha

**Expected Output:**
- 📉 Yield Category: "Low" or "Critical"
- Explanation mentions "significantly below potential"
- 8 detailed recommendations about irrigation, compost, pest management, PFJ enrollment
- Quick summary: "We estimate production around X Mt/Ha"

---

#### Test 2: Good/Very Good Yield
**Expected Result:** Green checkmarks with positive affirmations

**Input Values:**
- District: Accra Metropolitan
- Year: 2026
- Rainfall: 850 mm ← Good (optimal)
- Temperature: 27°C ← Ideal
- Humidity: 72%
- Sunlight: 7.5 hours ← Good (> 6)
- Soil Moisture: 0.68 ← Ideal (0.5-0.8)
- Pest Risk: 20% ← Low
- PFJ Policy: ON ← Enrolled
- Previous Yield: 2.1 Mt/Ha

**Expected Output:**
- ✅ Yield Category: "Good" or "Very Good"
- Explanation: "Continue current practices"
- Recommendations focus on maintaining (not fixing)
- Summary: "We are very confident your farm will produce..."
- Positive tone throughout

---

#### Test 3: Moderate Yield (Room for Improvement)
**Expected Result:** Yellow/Moderate alerts with improvement suggestions

**Input Values:**
- District: Tamale Metropolitan
- Year: 2026
- Rainfall: 650 mm ← Slightly below optimal
- Temperature: 29°C ← Slightly high
- Humidity: 65%
- Sunlight: 6 hours ← Borderline
- Soil Moisture: 0.55 ← Acceptable
- Pest Risk: 35% ← Moderate
- PFJ Policy: ON
- Previous Yield: 1.9 Mt/Ha

**Expected Output:**
- 📊 Yield Category: "Moderate"
- Explanation mentions "room for improvement"
- Recommendations balanced between maintaining and improving
- Focus on water management and pest prevention

---

### What to Look For

#### Visual Elements ✓
- [ ] Yield value displayed prominently
- [ ] Category emoji appears (📉✅🌟🏆)
- [ ] Color-coded sections (blue, green, amber)
- [ ] Confidence bar shows percentage
- [ ] Confidence interval displayed (lower-upper range)
- [ ] Numbered list with numbered circles

#### Text Content ✓
- [ ] Plain language explanation in "What This Means for Your Farm"
- [ ] Mentions previous year's yield and comparison
- [ ] Quick summary statement
- [ ] 8 numbered action items (not technical jargon)
- [ ] Uses farmer-friendly language (e.g., "Add compost" not "increase soil organic matter")
- [ ] Emoji in each recommendation

#### Functional Features ✓
- [ ] Scroll works on long recommendations
- [ ] All recommendations match the yield (low yield = urgent help, good yield = maintain)
- [ ] Rainfall section updates based on input
- [ ] Soil moisture section updates based on input
- [ ] Temperature section updates based on input
- [ ] Sunlight section updates based on input
- [ ] Pest risk section updates based on input
- [ ] PFJ policy section updates based on checkbox
- [ ] Year-over-year comparison updates based on previous yield

---

### Testing Checklist

**Visual Design:**
- [ ] Results panel scrolls smoothly
- [ ] Fonts are readable on mobile
- [ ] Colors are distinct and accessible
- [ ] Layout looks good on different screen sizes
- [ ] Emojis display properly

**Content Quality:**
- [ ] Explanations avoid jargon
- [ ] Numbers are formatted correctly (2 decimals)
- [ ] Percentages show correctly
- [ ] Recommendations are specific and actionable
- [ ] Risk factors are clearly identified

**Logic:**
- [ ] Low rainfall → Irrigation recommendation appears
- [ ] High temperature → Temperature stress warning appears
- [ ] Low soil moisture → Compost recommendation appears
- [ ] High pest risk → Pest management recommendation appears
- [ ] PFJ not enrolled → PFJ enrollment recommendation appears
- [ ] Yield declining → History comparison recommendation appears

---

### Common Issues & Solutions

**Issue:** Recommendations don't appear
- Check: Backend is returning predictions correctly
- Check: currentPrediction is not null
- Check: Browser console for errors

**Issue:** Emojis not displaying
- Check: Check browser/OS emoji support
- Check: Font rendering settings

**Issue:** Numbers showing too many decimals
- Check: `.toFixed(2)` is being called
- Check: Backend returns proper numbers

**Issue:** Scrolling not working
- Check: `max-h-[calc(100vh-200px)] overflow-y-auto` in results div
- Check: Content is actually longer than viewport

---

### Performance Testing

Run the build to check:
```powershell
cd frontend
npm run build
```

Expected:
- ✓ Build completes in < 10 seconds
- ✓ No TypeScript errors
- ✓ Bundle size warnings are informational only

---

### Browser Compatibility

Tested on:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 10+)

---

### Final Validation Checklist

Before deploying:
- [ ] Build completes successfully
- [ ] No console errors in browser dev tools
- [ ] All three test scenarios produce different outputs
- [ ] Farmer-friendly language is present (not technical)
- [ ] Numbers format correctly
- [ ] Mobile layout looks good
- [ ] Links/buttons are clickable
- [ ] Recommendations match the predicted yield
- [ ] Emojis display correctly
- [ ] Colors are distinct and accessible

---

### Notes

- The utility file `yieldInterpreter.ts` contains all the logic
- To modify recommendations, edit the `generateDetailedRecommendations()` function
- To change yield categories, edit the `getYieldCategory()` function
- To change explanations, edit the `generateYieldExplanation()` function
- All functions are pure (no side effects) for easy testing

---

**Ready to test!** 🎉
