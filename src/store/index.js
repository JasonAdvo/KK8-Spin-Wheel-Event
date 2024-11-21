// src/store.js
import { createStore } from 'vuex';

const store = createStore({
	state: {
		// Load the saved value from localStorage or set a default value of 1
		// chance: localStorage.getItem('chance') ? parseInt(localStorage.getItem('chance')) : 1,
		isBgmPlaying: false,
		bgmVolume: localStorage.getItem('bgmVolume') ? parseInt(localStorage.getItem('bgmVolume')) : 98, // Default volume is 98
		bgmMute: false,
		musicVolume: localStorage.getItem('musicVolume') ? parseInt(localStorage.getItem('musicVolume')) : 98, // Default volume is 98
		musicMute: false,
		chance: 1, // Set to 1 if no chance to use
	},
	mutations: {
		setChance(state) {
			// state.chance += 1;  // Increase chance when want to increase the chance in local storage
			state.chance -= 1;  // Decrease chance
			localStorage.setItem('chance', state.chance);  // Save the new value to localStorage
		},
		setBgmVolume(state, volume) {
			state.bgmVolume = volume;
			localStorage.setItem('bgmVolume', volume);
		},
		setMusicVolume(state, volume) {
			state.musicVolume = volume;
			localStorage.setItem('musicVolume', volume);
		},
		setBgmMute(state, isMuted) {
			state.bgmMute = isMuted;
		},
		setMusicMute(state, isMuted) {
			state.musicMute = isMuted;
		},
		setBgmPlaying(state, isPlayed) {
			state.isBgmPlaying = isPlayed;
		},
	},
	actions: {
		spinWheel({ commit }) {
			commit('setChance'); // Commit the mutation to change the chance
		},
		updateBgmVolume({ commit }, volume) {
			commit('setBgmVolume', volume);
		},
		updateMusicVolume({ commit }, volume) {
			commit('setMusicVolume', volume);
		},
		toggleMute({ commit, state }) {
			const isMuted = !state.bgmMute;
			commit('setBgmMute', isMuted);
			commit('setBgmVolume', isMuted ? 0 : state.bgmVolume); // If muted, set volume to 0
		},
		toggleMusicMute({ commit, state }) {
			const isMuted = !state.musicMute;
			commit('setMusicMute', isMuted);
			commit('setMusicVolume', isMuted ? 0 : state.musicVolume); // If muted, set volume to 0
		},
		toggleBgmPlaying({ commit, state }) {
			const isPlaying = !state.isBgmPlaying;
			commit('setBgmPlaying', isPlaying);
		},
	},
	getters: {
		currentChance(state) {
			return state.chance; // Getter to access the current chance
		},
		currentBgmVolume(state) {
			return state.bgmVolume;
		},
		currentMusicVolume(state) {
			return state.musicVolume;
		},
		isbgmMuted(state) {
			return state.bgmMute;
		},
		isMusicMuted(state) {
			return state.musicMute;
		},
		currentBgmState(state) {
			return state.isBgmPlaying;
		},
	},
});

export default store;