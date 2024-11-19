// src/store.js
import { createStore } from 'vuex';

const store = createStore({
	state: {
		chance: 1
	},
	mutations: {
		setChance(state) {
			state.chance = state.chance - 1;
		},
	},
	actions: {
		spinWheel({ commit }) {
			commit('setChance'); // Commit the mutation to change the theme
		},
	},
	getters: {
		currentChance(state) {
			return state.chance; // Getter to access the current theme
		},
	},
});

export default store;
