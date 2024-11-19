// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeEN from '../views/SpinWheelEN.vue';
import HomeZH from '../views/SpinWheelZH.vue';
import HomeMS from '../views/SpinWheelMS.vue';

const routes = [
	{
		path: '/',
		name: 'Home EN',
		component: HomeEN
	},
	{
		path: '/zh',
		name: 'Home ZH',
		component: HomeZH
	},
	{
		path: '/ms',
		name: 'Home MS',
		component: HomeMS
	}

	// Add more routes as needed
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
