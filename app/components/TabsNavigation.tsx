'use client';

import { useEffect, useState } from 'react';

export type TabType = 'lista' | 'organograma';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'lista', label: 'Listagem', icon: '👥' },
  { id: 'organograma', label: 'Organograma', icon: '📊' },
];

interface TabsNavigationProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export default function TabsNavigation({
  activeTab: activeTabProp,
  onTabChange,
}: TabsNavigationProps) {
  const [internalTab, setInternalTab] = useState<TabType>(
    activeTabProp ?? 'lista'
  );

  useEffect(() => {
    if (activeTabProp) setInternalTab(activeTabProp);
  }, [activeTabProp]);

  const setActive = (tab: TabType) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="sticky top-96 z-30 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-3 justify-center sm:justify-start">
          {tabs.map((tab) => {
            const isActive = internalTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-medium
                  transition-all
                  ${
                    isActive
                      ? 'bg-[var(--jj-red)] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
