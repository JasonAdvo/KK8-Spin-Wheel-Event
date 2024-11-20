// src/store.js
import { createStore } from 'vuex';

const store = createStore({
	state: {
		// Load the saved value from localStorage or set a default value of 1
		chance: localStorage.getItem('chance') ? parseInt(localStorage.getItem('chance')) : 1,
		// chance: 1, // Set to 1 if no chance to use
	},
	mutations: {
		setChance(state) {
			// state.chance += 1;  // Increase chance when want to increase the chance in local storage
			state.chance -= 1;  // Decrease chance
			localStorage.setItem('chance', state.chance);  // Save the new value to localStorage
		},
	},
	actions: {
		spinWheel({ commit }) {
			commit('setChance'); // Commit the mutation to change the chance
		},
	},
	getters: {
		currentChance(state) {
			return state.chance; // Getter to access the current chance
		},
	},
});

export default store;