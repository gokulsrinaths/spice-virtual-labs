import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, useState, Component } from 'react';
import { ExperimentsHome } from './pages/ExperimentsHome';
import { MassDensityExperiment } from './components/experiments/mass-density/MassDensityExperiment';
import { DynamicViscosityExperiment } from './components/experiments/viscosity/DynamicViscosityExperiment';
import { VaporPressureExperiment } from './components/experiments/vapor-pressure/VaporPressureExperiment';
import { BuoyancyExperiment } from './components/experiments/buoyancy/BuoyancyExperiment';
import { HydrostaticPressureExperiment } from './components/experiments/hydrostatic/HydrostaticPressureExperiment';
import { BernoulliExperiment } from './components/experiments/bernoulli/BernoulliExperiment';
import { EnergyEquationExperiment } from './components/experiments/energy/EnergyEquationExperiment';
import ReynoldsExperiment from './components/experiments/reynolds/ReynoldsExperiment';
import MinorHeadLossExperiment from './components/experiments/minor-head-loss/MinorHeadLossExperiment';
import { TopNav } from './components/navigation/TopNav';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-8">
          <h1 className="text-2xl text-red-600 mb-4">Something went wrong</h1>
          <pre className="bg-white p-4 rounded shadow-sm overflow-auto">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [isDebug] = useState(() => new URLSearchParams(window.location.search).has('debug'));

  return (
    <ErrorBoundary>
      <Router>
        <div className={`min-h-screen bg-gray-50 ${isDebug ? 'debug' : ''}`}>
          <TopNav />
          <div className="pt-16">
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<ExperimentsHome />} />
                <Route path="/experiments/mass-density" element={<MassDensityExperiment />} />
                <Route path="/experiments/viscosity" element={<DynamicViscosityExperiment />} />
                <Route path="/experiments/vapor-pressure" element={<VaporPressureExperiment />} />
                <Route path="/experiments/buoyancy" element={<BuoyancyExperiment />} />
                <Route path="/experiments/hydrostatic-pressure" element={<HydrostaticPressureExperiment />} />
                <Route path="/experiments/bernoulli" element={<BernoulliExperiment />} />
                <Route path="/experiments/energy" element={<EnergyEquationExperiment />} />
                <Route path="/experiments/reynolds" element={<ReynoldsExperiment />} />
                <Route path="/experiments/minor-head-loss" element={<MinorHeadLossExperiment />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}