'use client';

import { useEffect, useState } from 'react';
import ListagemTable from './ListagemTable';

export type TabType = 'lista' | 'tabela' | 'organograma';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'lista', label: 'Listagem', icon: '👥' },
  { id: 'tabela', label: 'Organograma', icon: '📊' },
];

interface TabsNavigationProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export default function TabsNavigation({ activeTab: activeTabProp, onTabChange }: TabsNavigationProps) {
  const [internalTab, setInternalTab] = useState<TabType>(activeTabProp ?? 'lista');

  useEffect(() => {
    if (activeTabProp) setInternalTab(activeTabProp);
  }, [activeTabProp]);

  const setActive = (tab: TabType) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="sticky top-96 z-30 bg-gray-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 justify-center sm:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                internalTab === tab.id
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo das abas */}
        <div className="mt-6">
          {internalTab === 'lista' && <ListagemTable />}

          {internalTab === 'tabela' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-gray-600">Visualização em Organograma</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}