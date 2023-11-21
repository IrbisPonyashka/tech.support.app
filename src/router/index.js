import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Tasks from '@/views/tasks/Tasks.vue';
import Task from '@/views/tasks/Task.vue';
import Projects from '@/views/projects/Projects.vue';
import Agreements from '@/views/agreements/Agreements.vue';
import Agreement from '@/views/agreements/Agreement.vue';
import Settings from '@/views/settings/Settings.vue';
// import Tasks from '../App.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/', 
      name: 'Tasks',
      component: Tasks,
      children: [
        {
          name: 'Task',
          path: 'task/:id',
          component: Task
        },
      ]
    },
    {
      path: '/projects', 
      name: 'Projects',
      component: Projects
    },
    {
      path: '/agreements', 
      name: 'Agreements',
      component: Agreements,
      children: [
        {
          name: 'Agreement',
          path: 'agreement/:id',
          component: Agreement
        },
      ]
    },
    {
      path: '/settings', 
      name: 'Settings',
      component: Settings
    },
  ],
})

export default router
