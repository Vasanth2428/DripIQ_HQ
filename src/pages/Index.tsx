import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { OverviewHub } from '@/components/views/OverviewHub';
import { ScheduleView } from '@/components/views/ScheduleView';
import { ReportsView } from '@/components/views/ReportsView';
import { FountainDetail } from '@/components/views/FountainDetail';

const Index = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedFountain, setSelectedFountain] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedFountain(null); // Reset fountain selection when changing views
  };

  const handleFountainSelect = (fountainId: string) => {
    setSelectedFountain(fountainId);
    setCurrentView('fountain-detail');
  };

  const handleBackToOverview = () => {
    setSelectedFountain(null);
    setCurrentView('overview');
  };

  const renderCurrentView = () => {
    if (currentView === 'fountain-detail' && selectedFountain) {
      return <FountainDetail fountainId={selectedFountain} onBack={handleBackToOverview} />;
    }

    switch (currentView) {
      case 'overview':
        return <OverviewHub />;
      case 'schedule':
        return <ScheduleView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <OverviewHub />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="ml-72 min-h-screen">
        <div className="p-8">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default Index;