import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },
  {
    title: 'MANAGEMENT',
    group: true,
  },
  
  {
      title: 'Events',
      icon: 'calendar-outline',
      link: '/pages/events',
        // {
        //   title: 'Calendar',
        //   link: '/pages/events/calendar',
        // },
    },
  {
    title: 'Groups',
    icon: 'people-outline',
    link: '/pages/groups',
    home: true,
  },
  // {
  //   title: 'Posts',
  //   icon: 'cast-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  
  
  {
    title: 'Departments',
    icon: 'pantone',
    link: '/pages/departments',
    home: true,
  },
  {
    title: 'Grade tickets',
    icon: 'paper-plane',
    link: '/pages/grade-tickets',
    home: true,
  },
  {
    title: 'View grades',
    icon: 'book-open',
    link: '/pages/all-grades',
    home: true
  },
  {
    title: 'Notifications',
    icon: 'message-square-outline',
    link: '/pages/notifications',
    home: true
  },
  {
    title: 'Semester',
    icon: 'book-outline',
    link: '/pages/semesters',
    home: true,
  },
];

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'All event proposal',
    icon: 'bulb',
    link: '/pages/event-proposals',
    home: true,
  },
  {
    title: 'Users',
    icon: 'person-outline',
    link: '/pages/users',
    home: true,
  },
  {
    title: 'Grade criteria',
    icon: 'bar-chart',
    link: '/pages/grades',
    home: true,
  },
]

export const MANAGER_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'My event proposal',
    icon: 'bulb',
    link: '/pages/my-event-proposal',
    home: true,
  },
]