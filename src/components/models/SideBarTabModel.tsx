import { useState } from 'react';
import { TabModel } from '@/src/app/student/dashboard/models/TabModel';

export function useSidebarViewModel() {
  const tabs: TabModel[] = [
    { label: 'Stack', icon: '/dashboardStack' },
    { label: 'Education', icon: '/dashboardEducation' },
    { label: 'Notes', icon: '/dashboardNotesIcon' },
    { label: 'Reference', icon: '/dashboardReferenceIcon' },
    { label: 'Simulation', icon: '/QuestionIcon' },

  ];

  const headerTabs: TabModel[]=[
    { label: 'Setting', icon: '/settingIcon'},
    { label: 'Notification', icon: '/notificationIcon'},
    { label: 'TempProfilePhoto', icon: '/tempProfilePhoto'},
  ];

  const sideBarExpandTabs: TabModel[] = [
    { label: 'Dashboard', icon: '/dashboardStack' },
    { label: 'Course Map', icon: '/dashboardEducation' },
    { label: 'Course Assignments', icon: '/dashboardNotesIcon' },
    { label: 'Assignments Score', icon: '/dashboardReferenceIcon' },
    { label: 'Simulation', icon: '/QuestionIcon' },

  ];


  

  return { tabs,sideBarExpandTabs,headerTabs };
}
