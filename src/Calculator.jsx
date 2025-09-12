import React, { useState, useEffect } from 'react';
import { 
  Calculator as CalculatorIcon, 
  Save, 
  History, 
  Wheat, 
  Droplets, 
  Sprout,
  Trash2,
  Copy,
  Download
} from 'lucide-react';

const FarmCalculator = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [savedCalculations, setSavedCalculations] = useState([]);

  // Agricultural calculation states
  const [farmData, setFarmData] = useState({
    landArea: '',
    cropType: 'wheat',
    seedRate: '',
    fertilizerRate: '',
    expectedYield: ''
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('farmCalculatorData');
    if (saved) {
      const data = JSON.parse(saved);
      setSavedCalculations(data.savedCalculations || []);
      setCalculationHistory(data.history || []);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      savedCalculations,
      history: calculationHistory
    };
    localStorage.setItem('farmCalculatorData', JSON.stringify(dataToSave));
  }, [savedCalculations, calculationHistory]);

  // Basic calculator functions
  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstValue, secondValue, operator) => {
    switch (operator) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
      default: return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);
    if (previousValue !== null && operator) {
      const newValue = calculate(previousValue, inputValue, operator);
      const calculation = `${previousValue} ${operator} ${inputValue} = ${newValue}`;
      
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
      
      // Add to history
      setCalculationHistory(prev => [
        { id: Date.now(), calculation, result: newValue, type: 'basic', timestamp: new Date() },
        ...prev.slice(0, 19) // Keep only last 20
      ]);
    }
  };

  // Agricultural calculations
  const calculateSeedRequirement = () => {
    const { landArea, cropType, seedRate } = farmData;
    if (!landArea || !seedRate) return 0;
    
    const seedRates = {
      wheat: 40, // kg per acre
      rice: 25,
      corn: 8,
      soybean: 35,
      cotton: 12
    };
    
    const rate = parseFloat(seedRate) || seedRates[cropType];
    const requirement = parseFloat(landArea) * rate;
    
    const calculation = `${landArea} acres × ${rate} kg/acre = ${requirement} kg seeds`;
    setCalculationHistory(prev => [
      { 
        id: Date.now(), 
        calculation, 
        result: requirement, 
        type: 'seed', 
        timestamp: new Date(),
        details: { landArea, cropType, seedRate: rate }
      },
      ...prev.slice(0, 19)
    ]);
    
    return requirement;
  };

  const calculateFertilizerRequirement = () => {
    const { landArea, cropType, fertilizerRate } = farmData;
    if (!landArea || !fertilizerRate) return 0;
    
    const requirement = parseFloat(landArea) * parseFloat(fertilizerRate);
    const calculation = `${landArea} acres × ${fertilizerRate} kg/acre = ${requirement} kg fertilizer`;
    
    setCalculationHistory(prev => [
      { 
        id: Date.now(), 
        calculation, 
        result: requirement, 
        type: 'fertilizer', 
        timestamp: new Date(),
        details: { landArea, cropType, fertilizerRate }
      },
      ...prev.slice(0, 19)
    ]);
    
    return requirement;
  };

  const calculateExpectedYield = () => {
    const { landArea, cropType, expectedYield } = farmData;
    if (!landArea || !expectedYield) return 0;
    
    const totalYield = parseFloat(landArea) * parseFloat(expectedYield);
    const calculation = `${landArea} acres × ${expectedYield} kg/acre = ${totalYield} kg total yield`;
    
    setCalculationHistory(prev => [
      { 
        id: Date.now(), 
        calculation, 
        result: totalYield, 
        type: 'yield', 
        timestamp: new Date(),
        details: { landArea, cropType, expectedYield }
      },
      ...prev.slice(0, 19)
    ]);
    
    return totalYield;
  };

  const saveCalculation = (calculation) => {
    setSavedCalculations(prev => [calculation, ...prev.slice(0, 9)]); // Keep only 10 saved
  };

  const exportData = () => {
    const dataToExport = {
      savedCalculations,
      history: calculationHistory,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-calculations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const Button = ({ onClick, className = '', children, variant = 'default' }) => {
    const baseClasses = 'h-12 text-lg font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-md';
    
    const variants = {
      default: 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600',
      number: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
      operator: 'bg-green-600 hover:bg-green-500 text-white border border-green-500',
      equals: 'bg-green-500 hover:bg-green-400 text-white border border-green-400',
      clear: 'bg-red-600 hover:bg-red-500 text-white border border-red-500',
      farm: 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-500'
    };

    return (
      <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
        {children}
      </button>
    );
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id 
          ? 'bg-green-600 text-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Wheat className="w-8 h-8 mr-3 text-green-400" />
          <h1 className="text-2xl font-bold">किसान Calculator</h1>
        </div>
        <button
          onClick={exportData}
          className="flex items-center px-3 py-2 bg-blue-600 rounded-lg text-sm"
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <TabButton id="basic" label="Basic" icon={CalculatorIcon} />
        <TabButton id="farm" label="Farm Calc" icon={Sprout} />
        <TabButton id="history" label="History" icon={History} />
        <TabButton id="saved" label="Saved" icon={Save} />
      </div>

      <div className="max-w-sm mx-auto">
        {/* Basic Calculator Tab */}
        {activeTab === 'basic' && (
          <>
            {/* Display */}
            <div className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
              <div className="text-right">
                <div className="text-gray-400 text-sm mb-1">
                  {previousValue !== null && operator ? `${previousValue} ${operator}` : ''}
                </div>
                <div className="text-3xl font-light text-white break-all">{display}</div>
              </div>
            </div>

            {/* Button Grid */}
            <div className="grid grid-cols-4 gap-2">
              <Button onClick={clear} variant="clear" className="col-span-2">Clear</Button>
              <Button onClick={() => setDisplay(display.slice(0, -1) || '0')} variant="default">⌫</Button>
              <Button onClick={() => performOperation('÷')} variant="operator">÷</Button>

              <Button onClick={() => inputNumber(7)} variant="number">7</Button>
              <Button onClick={() => inputNumber(8)} variant="number">8</Button>
              <Button onClick={() => inputNumber(9)} variant="number">9</Button>
              <Button onClick={() => performOperation('×')} variant="operator">×</Button>

              <Button onClick={() => inputNumber(4)} variant="number">4</Button>
              <Button onClick={() => inputNumber(5)} variant="number">5</Button>
              <Button onClick={() => inputNumber(6)} variant="number">6</Button>
              <Button onClick={() => performOperation('-')} variant="operator">-</Button>

              <Button onClick={() => inputNumber(1)} variant="number">1</Button>
              <Button onClick={() => inputNumber(2)} variant="number">2</Button>
              <Button onClick={() => inputNumber(3)} variant="number">3</Button>
              <Button onClick={() => performOperation('+')} variant="operator">+</Button>

              <Button onClick={() => inputNumber(0)} variant="number" className="col-span-2">0</Button>
              <Button onClick={inputDecimal} variant="default">.</Button>
              <Button onClick={performCalculation} variant="equals">=</Button>
            </div>
          </>
        )}

        {/* Farm Calculator Tab */}
        {activeTab === 'farm' && (
          <div className="space-y-4">
            {/* Farm Input Form */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-green-400" />
                Farm Details
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Land Area (Acres)</label>
                  <input
                    type="number"
                    value={farmData.landArea}
                    onChange={(e) => setFarmData({...farmData, landArea: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Enter land area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Crop Type</label>
                  <select
                    value={farmData.cropType}
                    onChange={(e) => setFarmData({...farmData, cropType: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="wheat">Wheat (गेहूं)</option>
                    <option value="rice">Rice (चावल)</option>
                    <option value="corn">Corn (मक्का)</option>
                    <option value="soybean">Soybean (सोयाबीन)</option>
                    <option value="cotton">Cotton (कपास)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Seed Rate (kg/acre)</label>
                  <input
                    type="number"
                    value={farmData.seedRate}
                    onChange={(e) => setFarmData({...farmData, seedRate: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Seeds per acre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fertilizer Rate (kg/acre)</label>
                  <input
                    type="number"
                    value={farmData.fertilizerRate}
                    onChange={(e) => setFarmData({...farmData, fertilizerRate: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Fertilizer per acre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Expected Yield (kg/acre)</label>
                  <input
                    type="number"
                    value={farmData.expectedYield}
                    onChange={(e) => setFarmData({...farmData, expectedYield: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    placeholder="Expected yield per acre"
                  />
                </div>
              </div>
            </div>

            {/* Farm Calculations */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => {
                  const result = calculateSeedRequirement();
                  setDisplay(String(result));
                }}
                variant="farm"
                className="flex items-center justify-center"
              >
                <Sprout className="w-4 h-4 mr-2" />
                Seed Requirement
              </Button>

              <Button
                onClick={() => {
                  const result = calculateFertilizerRequirement();
                  setDisplay(String(result));
                }}
                variant="farm"
                className="flex items-center justify-center"
              >
                <Droplets className="w-4 h-4 mr-2" />
                Fertilizer Requirement
              </Button>

              <Button
                onClick={() => {
                  const result = calculateExpectedYield();
                  setDisplay(String(result));
                }}
                variant="farm"
                className="flex items-center justify-center"
              >
                <Wheat className="w-4 h-4 mr-2" />
                Total Yield
              </Button>
            </div>

            {/* Quick Results Display */}
            {display !== '0' && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{display}</div>
                  <div className="text-sm text-gray-400 mt-1">kg</div>
                  <button
                    onClick={() => {
                      const lastCalc = calculationHistory[0];
                      if (lastCalc) saveCalculation(lastCalc);
                    }}
                    className="mt-2 px-3 py-1 bg-blue-600 rounded text-sm flex items-center mx-auto"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save Result
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Calculation History</h3>
              <button
                onClick={() => setCalculationHistory([])}
                className="text-red-400 text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </button>
            </div>
            
            {calculationHistory.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No calculations yet</div>
            ) : (
              calculationHistory.map((calc) => (
                <div key={calc.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-mono">{calc.calculation}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {calc.type} • {new Date(calc.timestamp).toLocaleString()}
                      </div>
                      {calc.details && (
                        <div className="text-xs text-gray-500 mt-1">
                          {calc.details.cropType && `Crop: ${calc.details.cropType} • `}
                          {calc.details.landArea && `Area: ${calc.details.landArea} acres`}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => navigator.clipboard?.writeText(calc.calculation)}
                        className="text-blue-400 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => saveCalculation(calc)}
                        className="text-green-400 p-1"
                      >
                        <Save className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Saved Calculations</h3>
              <button
                onClick={() => setSavedCalculations([])}
                className="text-red-400 text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </button>
            </div>
            
            {savedCalculations.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No saved calculations</div>
            ) : (
              savedCalculations.map((calc) => (
                <div key={calc.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-mono">{calc.calculation}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {calc.type} • {new Date(calc.timestamp).toLocaleString()}
                      </div>
                      <div className="text-lg font-bold text-green-400 mt-1">
                        Result: {calc.result} kg
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSavedCalculations(prev => prev.filter(c => c.id !== calc.id));
                      }}
                      className="text-red-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmCalculator;
