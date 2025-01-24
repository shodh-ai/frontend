import { useState } from 'react';
import { TabModel } from '@/src/app/student/dashboard/models/TabModel';

export function useSidebarViewModel() {
  const tabs: TabModel[] = [
    { label: 'Stack', icon: '/dashboardStack' },
    { label: 'Education', icon: '/dashboardEducation' },
    { label: 'Notes', icon: '/dashboardNotesIcon' },
    { label: 'Reference', icon: '/dashboardReferenceIcon' },

  ];

  const headerTabs: TabModel[]=[
    { label: 'Setting', icon: '/settingIcon'},
    { label: 'Notification', icon: '/notificationIcon'},
    { label: 'TempProfilePhoto', icon: '/tempProfilePhoto'},
  ];

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleSelectTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
  };

  return { tabs,headerTabs,  activeTab, handleSelectTab };
}
