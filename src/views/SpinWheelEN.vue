<template>

	<!-- Prize Popup -->
	<PrizePopup :prize="selectedPrize" :isVisible="showPopup" @update:isVisible="showPopup = $event" />

	<div class="d-flex justify-content-center position-relative">

		<img @click="togglePopupExit" class="Exit_Button position-absolute pointer" src="/images/exit-button.svg"
			alt="Exit Button">
		<img @click="togglePopupSetting" class="Setting_Button position-absolute pointer"
			src="/images/setting-button.svg" alt="Setting Button">

		<div class="Full_Container w-100">

			<section class="Spin_Wheel_Section ">
				<div class="Spin_Wheel">
					<div class="position-relative d-flex align-items-center overflow-hidden" style="height: 500px;">
						<img class="SpinWheelOuterFrame position-absolute start-50 top-50 translate-middle"
							src="/images/spinwheel-outer-frame.webp" alt="Spin Wheel Outer Frame">

						<img class="SpinWheelRing position-absolute start-50 top-50 translate-middle"
							:src="`/images/spinwheel-fx/spinwheel-fx_00${formattedIndex}.webp`" alt="Spinning Wheel" />

						<div class="overflow-hidden">
							<SpinTheWheel class="Wheel position-relative w-100" ref="wheelEl" type="image"
								:useWeight="true" :verify="canvasVerify" :prizeId="prizeId" :angleBase="-7"
								:prizes="prizesImage" :rotationDuration="1000" @rotateStart="onImageRotateStart"
								@rotateEnd="onRotateEnd">

								<template #wheel>
									<img class="SpinWheelInnerFrame" src="/images/spinwheel-inner-frame.webp"
										alt="Spin Wheel" />
								</template>

							</SpinTheWheel>
						</div>

						<img class="SpinWheelArrow position-absolute start-50 top-50 translate-middle"
							src="/images/spinwheel-arrow.webp" alt="Spin Wheel Arrow">

						<div class="Spin_Wheel_Button position-absolute w-80 background-orange rounded-2 start-50 translate-middle-x pointer"
							@click="onImageRotateStart">
							<div class="d-inline-flex justify-content-center align-items-center">
								<div class="fs-14 fw-800 color-622200 text-uppercase">
									Spin Your Luck
								</div>
							</div>
						</div>
					</div>

					<div class="text-center color-white">
						You have {{ currentChance }} spin(s) chance
					</div>

				</div>
			</section>

			<section class="Prize_Section ji-center ">

				<div class="Prize_Title position-relative w-50 text-center">
					<div class="fs-18 fw-600 text-uppercase">
						Prizes
					</div>
				</div>

				<div class="Prize">
					<div class="Prize_Item" v-for="(Prize, Index) in PrizeList" :key="Index">
						<div class="d-flex justify-content-center align-items-center" style="height: 70px;">
							<img :src="Prize.img" :alt="Prize.title">
						</div>

						<div class="fs-12 color-white text-center">
							{{ Prize.title }}
						</div>
					</div>
				</div>
			</section>

			<section class="Prize_Record_Section ji-center">
				<div class="Prize_Record d-flex flex-column background-030F9A w-full">
					<div class="d-flex justify-content-between mb-2">
						<div class="Tab_Button text-nowrap rounded-2 d-flex justify-content-center align-items-center pointer"
							:class="{ 'background-white color-000D78': selectedTab !== 'WinnerList', 'background-orange color-622200': selectedTab === 'WinnerList' }"
							@click="handleClick('WinnerList')">
							<div class="fw-bold">
								WINNER LIST
							</div>
						</div>

						<div class="Tab_Button text-nowrap rounded-2 d-flex justify-content-center align-items-center pointer"
							:class="{ 'background-white color-000D78': selectedTab !== 'WinnerRecord', 'background-orange color-622200': selectedTab === 'WinnerRecord' }"
							@click="handleClick('WinnerRecord')">
							<div class="fw-bold">
								WINNER RECORD
							</div>
						</div>
					</div>

					<div class="Winner_List" v-if="selectedTab === 'WinnerList'">
						<div class="d-flex flex-column">
							<div class="d-flex justify-content-between align-items-center mb-1"
								v-for="(Record, Index) in WinnerList" :key="Index">
								<div class="fs-16 color-white">
									{{ Record.date }}
								</div>

								<div class="d-flex flex-column">
									<div class="fs-12 color-white text-start" style="width: 120px;">
										{{ Record.Winner }}
									</div>

									<div class="d-flex justify-content-between align-items-center">
										<div class="fs-12 color-FFC800">
											{{ Record.Reward }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="Winner_Record_List" v-if="selectedTab === 'WinnerRecord'">
						<div class="d-flex flex-column">
							<div class="d-flex justify-content-between align-items-center mb-1"
								v-for="(Record, Index) in RecordList" :key="Index">
								<div class="fs-16 color-white">
									{{ Record.date }}
								</div>

								<div class="d-flex flex-column">
									<div class="fs-12 color-white text-start" style="width: 120px;">
										{{ Record.Reward }}
									</div>

									<div class="d-flex justify-content-between align-items-center">
										<img @click="copyToClipboard(Record.Code)"
											@touchstart="copyToClipboard(Record.Code)" class="pointer"
											style="width: 10px; height: 12px;" src="/images/Copy_Icon.webp"
											alt="Copy Icon">
										<div class="fs-12 color-FFC800">
											Promo Code:
										</div>
										<div class="fs-12 color-FFC800">
											{{ Record.Code }}
										</div>
									</div>
								</div>
							</div>

							<div @click="playBGM"
								class="Redeem_Button rounded-2 mt-2 d-flex justify-content-center align-items-center background-orange pointer">
								<div class="fs-14 fw-800 color-622200 text-uppercase">
									Redeem
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

		</div>
	</div>

	<!-- Overlay For Setting -->
	<div v-if="showPopupSetting" class="overlay fixed-top w-100 h-100" @click="togglePopupSetting"></div>
	<!-- Pop-up Card For Setting -->
	<div v-if="showPopupSetting" class="popup-card position-fixed start-50 top-50 translate-middle">

		<div class="d-flex flex-column align-items-center">

			<img class="position-absolute pointer" style="right: 20px; top: 10px;" @click="togglePopupSetting"
				src="/images/exit-icon.svg" alt="Exit">

			<div class="color-white text-center fs-18 fw-600 mt-3">
				Settings
			</div>

			<br>

			<div class="Setting_Control_Section">

				<div class="d-flex gap-2">
					<img v-if="!VolumeMute" class="pointer" @click="muteVolume" src="/images/volume-icon.svg"
						alt="Volume">
					<img v-if="VolumeMute" class="pointer" @click="muteVolume" src="/images/volume-mute-icon.svg"
						alt="Volume">

					<div
						class="windowsSlider rounded-pill position-relative d-flex justify-content-center align-items-center">

						<input v-model="percent" type="range" class="windowsSliderInput w-100 rounded-pill" min="0"
							max="98" @input="updateVolume" />
						<div v-if="bgmNotMuted" class="windowsSliderProgress position-absolute rounded-pill"
							:style="{ width: percent + '%' }">
						</div>

					</div>
				</div>

				<br>

				<div class="d-flex gap-2">
					<img v-if="!MusicMute" class="pointer" @click="muteMusic" src="/images/music-icon.svg" alt="Music">

					<img v-if="MusicMute" class="pointer" @click="muteMusic" src="/images/music-mute-icon.svg"
						alt="Music">

					<div
						class="windowsSlider rounded-pill position-relative d-flex justify-content-center align-items-center">

						<input v-model="percent2" type="range" class="windowsSliderInput w-100 rounded-pill" min="0"
							max="98" @input="updateMVolume" />
						<div v-if="musicNotMuted" class="windowsSliderProgress position-absolute rounded-pill"
							:style="{ width: percent2 + '%' }">
						</div>

					</div>
				</div>

			</div>

			<!-- <br>

			<div class="language-dropdown">
				<select class="fs-16 fw-600 background-white" @change="handleLanguageChange" v-model="selectedLanguage">
					<option value="en">English</option>
					<option value="zh">中文</option>
					<option value="ms">Bahasa</option>
				</select>
			</div> -->

			<br>

			<div class="color-white text-center fs-12 mb-2">

				<div>
					Need Help?
				</div>
				<div>
					Contact our customer support now
				</div>

			</div>

			<div
				class="Option_Button d-flex justify-content-center align-items-center background-orange pointer rounded-2 mb-3">
				<div class="text-center">
					<div class="fst-normal color-622200 fs-14 fw-800 text-uppercase text-nowrap">
						CUSTOMER SERVICE
					</div>
				</div>
			</div>

		</div>


	</div>

	<!-- Overlay For Exit -->
	<div v-if="showPopupExit" class="overlay fixed-top w-100 h-100" @click="togglePopupExit"></div>
	<!-- Pop-up Card For Exit -->
	<div v-if="showPopupExit" class="popup-card position-fixed start-50 top-50 translate-middle">

		<div class="d-flex flex-column align-items-center">
			<img class="position-absolute pointer" style="right: 20px; top: 10px;" @click="togglePopupExit"
				src="/images/exit-icon.svg" alt="Exit">

			<div class="text-center mt-3">
				<div class="color-white fs-18 fw-600 ">
					Exit Game
				</div>
			</div>

			<br>

			<div class="text-center">
				<div class="color-white fs-12 fst-normal">
					Are you really leaving?
					Bonus is still waiting for you!
				</div>
			</div>

			<br>

			<div class="Option_Button d-flex justify-content-center align-items-center pointer mb-2 rounded-2"
				style="border: 2px solid #FFFCFC;">
				<div class="color-white text-center fs-14 fw-bold text-uppercase ">
					Yes
				</div>
			</div>

			<div class="Option_Button d-flex justify-content-center align-items-center background-orange pointer mb-3 rounded-2"
				@click="togglePopupExit">
				<div class="color-622200 text-center fw-14 fw-800 text-uppercase fst-normal">
					No
				</div>
			</div>
		</div>
	</div>

</template>

<script>
import { SpinTheWheel } from 'vue-spin-the-wheel'
import PrizePopup from '@/components/PrizePopup.vue';// Import the PrizePopup component
import { switchLanguage } from '@/i18n'
import { mapGetters } from 'vuex';

export default {
	components: {
		SpinTheWheel,
		PrizePopup
	},
	data() {
		return {
			n: 0, // Current frame index
			animationFrameId: null, // ID for canceling the animation
			frameRate: 60, // Default frame rate (will adjust dynamically)
			useSetInterval: false, // Determines whether to use setInterval or requestAnimationFrame
			bgm: null,
			music: null,
			swMusic: null,
			rewardMusic: null,
			bgmNotMuted: true,
			musicNotMuted: true,
			selectedLanguage: "en",
			selectedTab: "WinnerRecord",
			PrizeList: [
				{ img: '/images/Rolex.webp', title: 'ROLEX' },
				{ img: '/images/Iphone.webp', title: 'IPHONE 16' },
				{ img: '/images/Money.webp', title: 'FREE CREDIT RM188' },
				{ img: '/images/Money.webp', title: 'FREE CREDIT RM88' },
				{ img: '/images/Money.webp', title: 'FREE CREDIT RM58' },
				{ img: '/images/Money.webp', title: 'FREE CREDIT RM38' },
				{ img: '/images/Money.webp', title: 'FREE CREDIT RM28' },
				{ img: '/images/Money.webp', title: 'FREE CREDIT RM18' },
				{ img: '/images/Money.webp', title: 'FREE CREDIT RM8' },
			],
			RecordList: [
				{ date: '2024-11-08', Reward: 'FREE CREDIT RM28', Code: '123ab' },
				{ date: '2024-11-07', Reward: 'FREE CREDIT RM18', Code: '123ba' },
				{ date: '2024-11-06', Reward: 'FREE CREDIT RM8', Code: '321ab' },
				{ date: '2024-11-05', Reward: 'FREE CREDIT RM18', Code: '321ba' },
				{ date: '2024-11-04', Reward: 'FREE CREDIT RM28', Code: '456cd' },
				{ date: '2024-11-03', Reward: 'FREE CREDIT RM18', Code: '456dc' },
				{ date: '2024-11-02', Reward: 'FREE CREDIT RM8', Code: '654cd' },
				{ date: '2024-11-01', Reward: 'FREE CREDIT RM18', Code: '654dc' },
			],
			WinnerList: [
				{ date: '2024-11-08', Reward: 'FREE CREDIT RM28', Winner: 'do**t*' },
				{ date: '2024-11-07', Reward: 'FREE CREDIT RM18', Winner: 'do**t*' },
				{ date: '2024-11-06', Reward: 'FREE CREDIT RM8', Winner: 'do**t*' },
				{ date: '2024-11-05', Reward: 'FREE CREDIT RM18', Winner: 'do**t*' },
				{ date: '2024-11-04', Reward: 'FREE CREDIT RM28', Winner: 'do**t*' },
				{ date: '2024-11-03', Reward: 'FREE CREDIT RM18', Winner: 'do**t*' },
				{ date: '2024-11-02', Reward: 'FREE CREDIT RM8', Winner: 'do**t*' },
				{ date: '2024-11-01', Reward: 'FREE CREDIT RM18', Winner: 'do**t*' },
			],
			showPopupSetting: false,
			showPopupExit: false,
			percent: this.$store.getters.currentBgmVolume,
			percent2: this.$store.getters.currentMusicVolume,
			prizeId: 1,
			canvasVerify: false,
			isSpinning: false,
			showPopup: false, // Controls visibility of the popup
			selectedPrize: {}, // Prize details to pass to the popup
			prizesImage: [
				{ id: 1, value: "Rolex", weight: 1, code: '123ab' },
				{ id: 2, value: "Free Credit RM8", weight: 0, code: '123ab' },
				{ id: 3, value: "Free Credit RM8", weight: 0, code: '123ab' },
				{ id: 4, value: "Free Credit RM28", weight: 0, code: '123ab28' },
				{ id: 5, value: "Free Credit RM28", weight: 0, code: '123ab' },
				{ id: 6, value: "Free Credit RM58", weight: 0, code: '123ab58' },
				{ id: 7, value: "Free Credit RM58", weight: 0, code: '123ab' },
				{ id: 8, value: "Free Credit RM188", weight: 0, code: '123ab' },
				{ id: 9, value: "Free Credit RM188", weight: 0, code: '123ab' },
				{ id: 10, value: "Iphone 16", weight: 0, code: '123ab' },
				{ id: 11, value: "Free Credit RM8", weight: 0, code: '123ab' },
				{ id: 12, value: "Free Credit RM8", weight: 0, code: '123ab' },
				{ id: 13, value: "Free Credit RM18", weight: 0, code: '123ab18' },
				{ id: 14, value: "Free Credit RM18", weight: 0, code: '123ab' },
				{ id: 15, value: "Free Credit RM38", weight: 0, code: '123ab38' },
				{ id: 16, value: "Free Credit RM38", weight: 0, code: '123ab' },
				{ id: 17, value: "Free Credit RM88", weight: 0, code: '123ab' },
				{ id: 18, value: "Free Credit RM88", weight: 0, code: '123ab' }
			]
		};
	},
	computed: {
		formattedIndex() {
			// Ensure the index has the correct number of digits, like 001 or 123
			return String(this.n).padStart(3, '0');
		},
		...mapGetters(['currentChance']),
		VolumeMute() {
			return this.$store.getters.isbgmMuted; // Get mute state from Vuex
		},
		MusicMute() {
			return this.$store.getters.isMusicMuted;
		}
	},
	mounted() {
		this.detectFrameRateAndStartLoop();
		this.musicLoad()
		// this.playBGM();
	},
	methods: {
		musicLoad() {
			// BGM music
			this.bgm = new Audio('/audio/Children Game Loop.wav');
			this.bgm.loop = true;
			this.bgm.volume = this.percent / 100; // Set initial volume based on Vuex state

			// Click music
			this.music = new Audio('/audio/Click.wav');
			this.music.volume = this.percent2 / 100;

			// Spin Wheel music
			this.swMusic = new Audio('/audio/Spin wheel spinning.mp3');
			this.swMusic.volume = this.percent2 / 100;

			// Get Reward music
			this.rewardMusic = new Audio('/audio/Win.wav');
			this.rewardMusic.volume = this.percent2 / 100;

		},
		handleClick(tabName) {
			this.selectedTab = tabName;
			this.playBGM();
		},
		playBGM() {
			// Check if BGM is playing. If not, toggle its state in Vuex and play the BGM.
			if (!this.$store.getters.currentBgmState) {
				this.$store.dispatch('toggleBgmPlaying');
				this.bgm.play(); // Ensure this.bgm is your BGM audio instance
			}
		},
		detectFrameRateAndStartLoop() {
			let frameCount = 0;
			let startTime = performance.now();

			const measureFrameRate = (timestamp) => {
				frameCount++;
				const elapsed = timestamp - startTime;

				if (elapsed >= 1000) {
					// Calculate the actual frame rate
					this.frameRate = frameCount;

					// Decide which method to use based on frame rate
					this.useSetInterval = this.frameRate > 50;

					// Start the appropriate loop
					this.useSetInterval ? this.startIntervalLoop() : this.startAnimationFrameLoop();
					return; // Stop measuring after 1 second
				}

				requestAnimationFrame(measureFrameRate);
			};

			requestAnimationFrame(measureFrameRate);
		},
		startAnimationFrameLoop() {
			const loop = (timestamp) => {
				this.n = (this.n + 1) % 124; // Increment and reset the index
				// console.log('Start < 60Hz Looping')
				this.animationFrameId = requestAnimationFrame(loop); // Schedule the next frame
			};

			this.animationFrameId = requestAnimationFrame(loop); // Start the animation
		},
		startIntervalLoop() {
			setInterval(() => {
				this.n = (this.n + 1) % 124; // Increment and reset the index
				// console.log('Start > 60Hz Looping')
			}, 50); // Fixed 50ms interval
		},
		stopLoop() {
			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId); // Stop the animation frame loop
			}
		},
		togglePopupSetting() {

			// Check if BGM is playing. If not, toggle its state in Vuex and play the BGM.
			this.playBGM()

			this.showPopupSetting = !this.showPopupSetting;

			if (this.showPopupSetting) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		},
		togglePopupExit() {

			// Check if BGM is playing. If not, toggle its state in Vuex and play the BGM.
			this.playBGM()

			this.showPopupExit = !this.showPopupExit;

			if (this.showPopupExit) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		},
		// Trigger the spin on start and calculate the final angle
		onImageRotateStart() {
			if (this.isSpinning || this.currentChance === 0) return; // Prevent spinning if already spinning or no chances left

			this.isSpinning = true; // Lock the spin

			// Check if BGM is playing. If not, toggle its state in Vuex and play the BGM.
			this.playBGM()

			this.$store.dispatch('spinWheel');

			this.music.play();
			this.swMusic.play();

			// Select the prize ID and store it for later
			this.selectedPrizeId = this.selectRandomPrize();
			this.prizeId = this.selectedPrizeId;

			// Ensure the target angle is passed correctly to the wheel component
			this.$refs.wheelEl.startRotate();
		},

		// After the spin ends, determine the prize and display the result
		onRotateEnd() {
			// Use the previously selected prize ID
			const prizeId = this.selectedPrizeId;

			// Find the prize details and store them
			this.selectedPrize = this.prizesImage.find(p => p.id === prizeId);

			// Show the prize result and unlock for the next spin
			this.showPopup = true; // Show the popup with the prize details

			this.isSpinning = false; // Unlock for the next spin

			this.rewardMusic.play();

			if (this.currentChance === 0) {
				this.isSpinning = true; // Lock spinning when chances are exhausted
			}
		},
		selectRandomPrize() {
			// Define only the target prize IDs
			const targetPrizes = [4, 6, 13, 15];

			// Select a random prize ID from the targetPrizes array
			const randomIndex = Math.floor(Math.random() * targetPrizes.length);

			// Return the randomly selected prize ID
			return targetPrizes[randomIndex];
		},
		muteVolume() {
			this.$store.dispatch('toggleMute'); // Toggle mute in Vuex

			this.bgmNotMuted = !this.bgmNotMuted;

			if (this.VolumeMute) {

				this.bgm.volume = 0; // Mute the audio

			} else {
				this.bgm.volume = this.percent / 100; // Restore volume from Vuex
			}
		},
		muteMusic() {
			this.$store.dispatch('toggleMusicMute'); // Toggle mute in Vuex

			this.musicNotMuted = !this.musicNotMuted;

			if (this.MusicMute) {

				this.music.volume = 0; // Mute the audio
				this.swMusic.volume = 0; // Mute the audio
				this.rewardMusic.volume = 0; // Mute the audio

			} else {
				this.music.volume = this.percent2 / 100; // Restore volume from Vuex
				this.swMusic.volume = this.percent2 / 100; // Restore volume from Vuex
				this.rewardMusic.volume = this.percent2 / 100; // Restore volume from Vuex
			}
		},
		updateVolume() {
			this.bgmNotMuted = true;

			this.percent = Number(this.percent);

			this.$store.dispatch('updateBgmVolume', this.percent); // Update Vuex volume

			if (this.percent === 0) {
				this.bgm.volume = 0;

				this.$store.dispatch('toggleMute'); // If slider is 0, mute the volume
			} else {

				this.bgm.volume = this.percent / 100; // Update the audio volum

				if (this.VolumeMute) {
					this.$store.dispatch('toggleMute'); // Unmute if volume is adjusted
				}
			}
		},
		updateMVolume() {
			this.musicNotMuted = true;

			this.$store.dispatch('updateMusicVolume', this.percent2); // Update Vuex volume

			this.percent2 = Number(this.percent2);

			if (this.percent2 === 0) {
				this.music.volume = 0;
				this.swMusic.volume = 0;
				this.rewardMusic.volume = 0;

				this.$store.dispatch('toggleMusicMute'); // If slider is 0, mute the volume
			} else {
				this.music.volume = this.percent2 / 100; // Update the audio volume
				this.swMusic.volume = this.percent2 / 100; // Update volume from Vuex
				this.rewardMusic.volume = this.percent2 / 100; // Update volume from Vuex

				if (this.MusicMute) {
					this.$store.dispatch('toggleMusicMute'); // Unmute if volume is adjusted
				}
			}
		},
		copyToClipboard(code) {

			// Check if BGM is playing. If not, toggle its state in Vuex and play the BGM.
			this.playBGM()

			if (navigator.clipboard) {
				navigator.clipboard.writeText(code).then(() => {
				}).catch((err) => {
					console.error("Error copying text: ", err);
				});
			} else {
				// Fallback using textarea for mobile devices
				const textArea = document.createElement('textarea');
				textArea.value = code;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}
		},
		handleLanguageChange(event) {
			const lang = event.target.value; // Get selected language code
			this.changeLanguage(lang); // Call the provided changeLanguage method
		},
		changeLanguage(lang) {

			const routeMap = {
				en: "/",
				zh: "/zh",
				ms: "/ms",
			};

			const targetRoute = routeMap[lang];
			this.$router.push(targetRoute);

			switchLanguage(lang); // Call the function and pass the desired language

			document.body.style.overflow = 'auto';

			window.location.reload();
		},
	},
	beforeDestroy() {
		this.stopLoop(); // Clean up the animation frame when the component is destroyed
	}
};
</script>

<style scoped>
.Spin_Wheel_Section {
	text-align: -webkit-center;
}

.Spin_Wheel {
	background-image: url('/images/SpinWheelBackground.webp');
	background-position: center;
	background-size: cover;
	/* height: 500px; */
	text-align: -webkit-center;
}

.SpinWheelOuterFrame {
	width: 95%;
	z-index: 1;
}

.SpinWheelRing {
	width: 135%;
	z-index: 0;
}

.Wheel {
	left: unset;
	right: unset;
	transform: unset;
	max-width: 100%;
	z-index: 2;
}

.SpinWheelInnerFrame {
	transform: unset;
	width: 75%;
	z-index: 1;
}

.SpinWheelArrow {
	width: 30%;
	z-index: 3;
}

.Exit_Button {
	left: 20px;
	top: 40px;
	z-index: 100;
}

.Setting_Button {
	right: 20px;
	top: 40px;
	z-index: 100;
}

.Spin_Wheel_Button {
	padding: 8px 16px;
	letter-spacing: 0.42px;
	max-width: 350px;
	bottom: 30px;
	z-index: 10;
}

.Prize_Section {
	margin-top: 30px;
	padding: 0 20px;
}

.Prize_Title::before {
	content: "";
	background: linear-gradient(90deg, rgba(217, 217, 217, 0.00) 0%, #00D0FF 53%, rgba(255, 255, 255, 0.00) 100%);
	mix-blend-mode: overlay;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.Prize_Title {
	color: #E3F0FF;
	padding: 5px 0;
}

.Prize {
	display: grid;
	grid-template-columns: auto auto auto auto;
	grid-gap: 8px;
	margin-top: 20px;
}

.Prize_Item {
	background-image:
		url('/images/Prize frame.webp'),
		/* Frame image */
		linear-gradient(180deg, #000D78 0%, #051ACE 100%);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	padding: 10%;
	border-radius: 18px;
}

.Prize_Item img {
	width: 45px;
}

.Prize_Item:nth-child(1) img,
.Prize_Item:nth-child(2) img {
	width: 35px;
}

.Prize_Record_Section {
	margin-top: 20px;
	padding: 0 20px 30px;
}

.Prize_Record {
	padding: 24px 20px;
	border-radius: 10px;
	max-width: 400px;
}

.Tab_Button {
	font-size: 12px;
	padding: 10px 24px;
	width: 48%;
}

.Tab_Button.Selected {
	border-radius: 4px;
	background: linear-gradient(180deg, #FFC800 0%, #FF7E04 100%);
	color: #622200;
	font-weight: 800;
}

.Redeem_Button {
	padding: 9px 20px;
	align-self: stretch;
}

.Redeem_Button div {
	font-style: normal;
	line-height: normal;
	letter-spacing: 0.42px;
}

.overlay {
	background: rgba(0, 0, 0, 0.5);
}

.popup-card {
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	z-index: 9999;
	width: 90%;
	max-width: 330px;
	border-radius: 15px;
	border: 2px solid #FFF;
	background: linear-gradient(180deg, #000D78 -31.67%, #051ACE 101.82%);
}

.Setting_Control_Section {
	text-align: -webkit-center;
}

.windowsSlider {
	height: 30px;
	width: 230px;
	background: #00000060;
	border: 2px solid white;
}

.windowsSliderInput {
	-webkit-appearance: none;
	background: transparent;
	outline: none;
	border: none;
	height: 20px;
	border-radius: 25px;
	z-index: 2;
}

.windowsSliderInput::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	cursor: pointer;
}

.windowsSliderProgress {
	left: 2px;
	height: 80%;
	background: white;
	z-index: 1;
}

.language-dropdown select {
	border-radius: 15px;
	padding: 5px;
	outline: none;
}

.Option_Button {
	width: 180px;
	height: 35px;
	padding: 10px 30px;
}

/* CSS Start From 430px width */
@media screen and (min-width: 430px) {
	.Spin_Wheel {
		background-image: url('/images/spinwheel-bg-web.webp');
		max-width: 500px;
	}

	.Exit_Button {
		left: 5%;
	}

	.Setting_Button {
		right: 5%;
	}

	.Tab_Button {
		font-size: 14px;
	}
}

/* CSS Start From 769px width */
@media screen and (min-width: 769px) {
	.Prize_Section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.Prize {
		display: flex;
	}

	.Prize_Item {
		width: 100%;
		max-width: 105px;
		padding: 10px;
	}

	.Full_Container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		max-width: 1200px
	}

	.Spin_Wheel_Section {
		order: 1;
		width: 50%;
	}

	.Spin_Wheel {
		padding-top: 65px;
	}

	.Prize_Record_Section {
		order: 2;
		width: 50%;
		margin-top: 100px;
		padding-bottom: 0;
	}

	.Prize_Section {
		order: 3;
		margin-bottom: 20px;
	}

	.Spin_Wheel_Button {
		bottom: 25px;
	}
}
</style>