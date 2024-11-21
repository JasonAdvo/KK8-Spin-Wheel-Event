<template>

	<!-- Prize Popup -->
	<PrizePopup :prize="selectedPrize" :isVisible="showPopup" @update:isVisible="showPopup = $event" />

	<div class="flex jc-center relative">

		<img @click="togglePopupExit" class="Exit_Button absolute pointer" src="/images/exit-button.svg"
			alt="Exit Button">
		<img @click="togglePopupSetting" class="Setting_Button absolute pointer" src="/images/setting-button.svg"
			alt="Setting Button">

		<div class="Full_Container">

			<section class="Spin_Wheel_Section ">
				<div class="Spin_Wheel">
					<div class="relative flex align-center" style="height: 500px; overflow: hidden;">
						<img class="SpinWheelOuterFrame absolute" src="/images/spinwheel-outer-frame.webp"
							alt="Spin Wheel Outer Frame">

						<img class="SpinWheelRing absolute"
							:src="`/images/spinwheel-fx/spinwheel-fx_00${formattedIndex}.webp`" alt="Spinning Wheel" />

						<div style="overflow:hidden;">
							<SpinTheWheel class="relative"
								style="width: 100%; left: unset; right: unset; transform: unset; max-width: 100%; z-index: 2;"
								ref="wheelEl" type="image" :useWeight="true" :verify="canvasVerify" :prizeId="prizeId"
								:angleBase="-10" :prizes="prizesImage" :rotationDuration="1000"
								@rotateStart="onImageRotateStart" @rotateEnd="onRotateEnd">

								<template #wheel>
									<img class="SpinWheelInnerFrame" style="transform: unset"
										src="/images/spinwheel-inner-frame.webp" alt="Spin Wheel" />
								</template>
							</SpinTheWheel>
						</div>

						<img class="SpinWheelArrow absolute" src="/images/spinwheel-arrow.webp" alt="Spin Wheel Arrow">

						<div class="Spin_Wheel_Button absolute w-80 fs-14 fw-800 color-622200 text-uppercase jc-center align-center background-orange pointer"
							@click="onImageRotateStart">
							转动好运
						</div>
					</div>

					<div class="Chance_Section ta-center color-white">
						你有 {{ currentChance }} 次旋转机会
					</div>

				</div>
			</section>

			<section class="Prize_Section ji-center ">

				<div class="Prize_Title fs-18 fw-600 text-uppercase  ">
					奖品
				</div>

				<div class="Prize">
					<div class="Prize_Item" v-for="(Prize, Index) in PrizeList" :key="Index">
						<div class="flex jc-center align-center" style="height: 70px;">
							<img :src="Prize.img" :alt="Prize.title">
						</div>

						<div class="fs-12 color-white ta-center">
							{{ Prize.title }}
						</div>
					</div>
				</div>
			</section>

			<section class="Prize_Record_Section ji-center">
				<div class="Prize_Record flex fd-column background-030F9A w-full">
					<div class="Prize_Tab flex jc-sb">
						<div class="Tab_Button flex jc-center align-center pointer fw-700"
							:class="{ 'background-white color-000D78': selectedTab !== 'WinnerList', 'background-orange color-622200': selectedTab === 'WinnerList' }"
							@click="selectedTab = 'WinnerList'">
							获奖名单
						</div>

						<div class="Tab_Button flex jc-center align-center pointer fw-700"
							:class="{ 'background-white color-000D78': selectedTab !== 'WinnerRecord', 'background-orange color-622200': selectedTab === 'WinnerRecord' }"
							@click="selectedTab = 'WinnerRecord'">
							获奖记录
						</div>
					</div>

					<div class="Winner_List" v-if="selectedTab === 'WinnerList'">
						<div class="flex fd-column">
							<div class="flex jc-sb align-center mb-5" v-for="(Record, Index) in WinnerList"
								:key="Index">
								<div class="fs-16 color-white">
									{{ Record.date }}
								</div>

								<div class="flex fd-column">
									<div class="fs-12 color-white ta-left" style="width: 120px;">
										{{ Record.Winner }}
									</div>

									<div class="flex jc-sb align-center">
										<div class="fs-12 color-FFC800">
											{{ Record.Reward }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="Winner_Record_List" v-if="selectedTab === 'WinnerRecord'">
						<div class="flex fd-column">
							<div class="flex jc-sb align-center mb-5" v-for="(Record, Index) in RecordList"
								:key="Index">
								<div class="fs-16 color-white">
									{{ Record.date }}
								</div>

								<div class="flex fd-column">
									<div class="fs-12 color-white ta-left" style="width: 120px;">
										{{ Record.Reward }}
									</div>

									<div class="flex jc-sb align-center">
										<img @click="copyToClipboard(Record.Code)"
											@touchstart="copyToClipboard(Record.Code)"
											style="width: 10px; height: 12px; cursor: pointer;"
											src="/images/Copy_Icon.webp" alt="Copy Icon">
										<div class="fs-12 color-FFC800">
											Promo Code:
										</div>
										<div class="fs-12 color-FFC800">
											{{ Record.Code }}
										</div>
									</div>
								</div>
							</div>

							<div class="Redeem_Button flex jc-center align-center background-orange pointer">
								<div class="fs-14 fw-800 color-622200 text-uppercase">
									兑换
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

		</div>
	</div>

	<!-- Overlay For Setting -->
	<div v-if="showPopupSetting" class="overlay" @click="togglePopupSetting"></div>
	<!-- Pop-up Card For Setting -->
	<div v-if="showPopupSetting" class="popup-card">

		<img class="absolute pointer" style="right: 20px; top: 10px;" @click="togglePopupSetting"
			src="/images/exit-icon.svg" alt="Exit">

		<div class="color-white ta-center fs-18 fw-600"
			style="font-style: normal; line-height: 110%; letter-spacing: -0.18px; margin-top: 10px;">
			设置
		</div>

		<br>

		<div class="Setting_Control_Section">

			<div class="flex" style="gap: 10px;">
				<img v-if="!VolumeMute" style="cursor: pointer;" @click="muteVolume" src="/images/volume-icon.svg"
					alt="Volume">
				<img v-if="VolumeMute" style="cursor: pointer;" @click="muteVolume" src="/images/volume-mute-icon.svg"
					alt="Volume">

				<div class="windowsSlider">
					<input v-model="percent" type="range" class="windowsSliderInput" min="0" max="98"
						@input="updateVolume" />
					<div class="windowsSliderProgress" :style="{ width: percent + '%' }"></div>
				</div>
			</div>

			<br>

			<div class="flex" style="gap: 10px;">
				<img v-if="!MusicMute" style="cursor: pointer;" @click="muteMusic" src="/images/music-icon.svg"
					alt="Music">

				<img v-if="MusicMute" style="cursor: pointer;" @click="muteMusic" src="/images/music-mute-icon.svg"
					alt="Music">

				<div class="windowsSlider">
					<input v-model="percent2" type="range" class="windowsSliderInput" min="0" max="98"
						@input="updateMVolume" />
					<div class="windowsSliderProgress" :style="{ width: percent2 + '%' }"></div>
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

		<div class="color-white ta-center fs-12 fw-400"
			style="font-style: normal; line-height: 113.5%; margin-bottom: 10px; ">

			<div>
				需要帮助?
			</div>
			<div>
				立即联系我们的客服团队
			</div>

		</div>

		<div class="flex jc-center align-center background-orange pointer"
			style="width: 180px; height: 35px; padding: 9px 29px; border-radius: 4px; margin-bottom: 10px;">
			<div class="color-622200 ta-center fw-14 fw-800 text-uppercase"
				style="font-style: normal; line-height: normal; white-space: nowrap;">
				客户服务
			</div>
		</div>
	</div>

	<!-- Overlay For Exit -->
	<div v-if="showPopupExit" class="overlay" @click="togglePopupExit"></div>
	<!-- Pop-up Card For Exit -->
	<div v-if="showPopupExit" class="popup-card">

		<img class="absolute pointer" style="right: 20px; top: 10px;" @click="togglePopupExit"
			src="/images/exit-icon.svg" alt="Exit">

		<div class="color-white ta-center fs-18 fw-600" style="font-style: normal; line-height: 110%; 
			letter-spacing: -0.18px; margin-top: 10px;">
			退出
		</div>

		<br>

		<div class="color-white ta-center fs-12 fw-400" style="font-style: normal;line-height: 113.5%; ">

			<div>
				您确定要退出吗?
			</div>
			<div>
				奖金还在等着您领取!
			</div>

		</div>

		<br>

		<div class="flex jc-center align-center pointer"
			style="width: 180px; height: 35px; padding: 9px 29px; border-radius: 4px; border: 2px solid #FFFCFC; margin-bottom: 10px;">
			<div class="color-white ta-center fs-14 fw-700 text-uppercase"
				style="font-style: normal;line-height: normal; white-space: nowrap;">
				是
			</div>
		</div>

		<div class="flex jc-center align-center background-orange pointer"
			style="width: 180px; height: 35px; padding: 9px 29px;border-radius: 4px;margin-bottom: 10px;"
			@click="togglePopupExit">
			<div class="color-622200 ta-center fw-14 fw-800 text-uppercase"
				style="font-style: normal; line-height: normal; white-space: nowrap;">
				否
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
			selectedLanguage: "zh",
			selectedTab: "WinnerRecord",
			PrizeList: [
				{ img: '/images/Rolex.webp', title: '劳力士手表' },
				{ img: '/images/Iphone.webp', title: '苹果16手机' },
				{ img: '/images/Money.webp', title: '免费奖金 RM188' },
				{ img: '/images/Money.webp', title: '免费奖金 RM88' },
				{ img: '/images/Money.webp', title: '免费奖金 RM58' },
				{ img: '/images/Money.webp', title: '免费奖金 RM38' },
				{ img: '/images/Money.webp', title: '免费奖金 RM28' },
				{ img: '/images/Money.webp', title: '免费奖金 RM18' },
				{ img: '/images/Money.webp', title: '免费奖金 RM8' },
			],
			RecordList: [
				{ date: '2024-11-08', Reward: '免费奖金 RM28', Code: '123ab' },
				{ date: '2024-11-07', Reward: '免费奖金 RM18', Code: '123ba' },
				{ date: '2024-11-06', Reward: '免费奖金 RM8', Code: '321ab' },
				{ date: '2024-11-05', Reward: '免费奖金 RM18', Code: '321ba' },
				{ date: '2024-11-04', Reward: '免费奖金 RM28', Code: '456cd' },
				{ date: '2024-11-03', Reward: '免费奖金 RM18', Code: '456dc' },
				{ date: '2024-11-02', Reward: '免费奖金 RM8', Code: '654cd' },
				{ date: '2024-11-01', Reward: '免费奖金 RM18', Code: '654dc' },
			],
			WinnerList: [
				{ date: '2024-11-08', Reward: '免费奖金 RM28', Winner: 'do**t*' },
				{ date: '2024-11-07', Reward: '免费奖金 RM18', Winner: 'do**t*' },
				{ date: '2024-11-06', Reward: '免费奖金 RM8', Winner: 'do**t*' },
				{ date: '2024-11-05', Reward: '免费奖金 RM18', Winner: 'do**t*' },
				{ date: '2024-11-04', Reward: '免费奖金 RM28', Winner: 'do**t*' },
				{ date: '2024-11-03', Reward: '免费奖金 RM18', Winner: 'do**t*' },
				{ date: '2024-11-02', Reward: '免费奖金 RM8', Winner: 'do**t*' },
				{ date: '2024-11-01', Reward: '免费奖金 RM18', Winner: 'do**t*' },
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
				{ id: 1, value: "劳力士手表", weight: 1, code: '123ab' },
				{ id: 2, value: "免费奖金 RM8", weight: 0, code: '123ab' },
				{ id: 3, value: "免费奖金 RM8", weight: 0, code: '123ab' },
				{ id: 4, value: "免费奖金 RM28", weight: 0, code: '123ab28' },
				{ id: 5, value: "免费奖金 RM28", weight: 0, code: '123ab' },
				{ id: 6, value: "免费奖金 RM58", weight: 0, code: '123ab58' },
				{ id: 7, value: "免费奖金 RM58", weight: 0, code: '123ab' },
				{ id: 8, value: "免费奖金 RM188", weight: 0, code: '123ab' },
				{ id: 9, value: "免费奖金 RM188", weight: 0, code: '123ab' },
				{ id: 10, value: "苹果16手机", weight: 0, code: '123ab' },
				{ id: 11, value: "免费奖金 RM8", weight: 0, code: '123ab' },
				{ id: 12, value: "免费奖金 RM8", weight: 0, code: '123ab' },
				{ id: 13, value: "免费奖金 RM18", weight: 0, code: '123ab18' },
				{ id: 14, value: "免费奖金 RM18", weight: 0, code: '123ab' },
				{ id: 15, value: "免费奖金 RM38", weight: 0, code: '123ab38' },
				{ id: 16, value: "免费奖金 RM38", weight: 0, code: '123ab' },
				{ id: 17, value: "免费奖金 RM88", weight: 0, code: '123ab' },
				{ id: 18, value: "免费奖金 RM88", weight: 0, code: '123ab' }
			]
		};
	},
	watch: {
		percent(newValue) {
			if (newValue > 0) {
				// Unmute using Vuex
				this.$store.dispatch('toggleMute', false); // Set VolumeMute to false in Vuex
			} else {
				this.$store.dispatch('toggleMute', true); // Mute if volume is 0
			}
		},
		percent2(newValue) {
			if (newValue > 0) {
				// Unmute using Vuex
				this.$store.dispatch('toggleMusicMute', false); // Set MusicMute to false in Vuex
			} else {
				this.$store.dispatch('toggleMusicMute', true); // Mute if volume is 0
			}
		},
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
		this.playBGM();
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
		playBGM() {
			this.bgm.play();
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
			this.showPopupSetting = !this.showPopupSetting;

			if (this.showPopupSetting) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
		},
		togglePopupExit() {
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
			if (this.VolumeMute) {

				this.bgm.volume = 0; // Mute the audio

			} else {
				this.bgm.volume = this.percent / 100; // Restore volume from Vuex
			}
		},
		muteMusic() {
			this.$store.dispatch('toggleMusicMute'); // Toggle mute in Vuex
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
			this.$store.dispatch('updateBgmVolume', this.percent); // Update Vuex volume
			if (this.percent === 0) {
				this.$store.dispatch('toggleMute'); // If slider is 0, mute the volume
			} else {
				this.bgm.volume = this.percent / 100; // Update the audio volume
				if (this.VolumeMute) {
					this.$store.dispatch('toggleMute'); // Unmute if volume is adjusted
				}
			}
		},
		updateMVolume() {
			this.$store.dispatch('updateMusicVolume', this.percent2); // Update Vuex volume
			if (this.percent2 === 0) {
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
			if (navigator.clipboard) {
				navigator.clipboard.writeText(code).then(() => {
					alert("Promo code copied: " + code);
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
				alert("Promo code copied: " + code);
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
.Full_Container {
	width: 100%;
}

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

.Spin_Wheel img {
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}

.SpinWheelOuterFrame {
	width: 95%;
	z-index: 1;
}

.SpinWheelRing {
	width: 135%;
	z-index: 0;
}

.SpinWheelInnerFrame {
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
	display: inline-flex;
	padding: 8px 16px;
	border-radius: 4px;
	font-style: normal;
	line-height: normal;
	letter-spacing: 0.42px;
	max-width: 350px;
	bottom: 30px;
	left: 50%;
	transform: translateX(-50%);
	z-index: 10;
}

.Chance_Section {
	/* bottom: 0;
	left: 50%;
	transform: translateX(-50%); */
	white-space: nowrap;
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
	font-style: normal;
	line-height: 113.5%;
	/* 20.43px */
	letter-spacing: 0.9px;
	position: relative;
	width: 50%;
	text-align: center;
	padding: 5px 0;
}

.Prize {
	display: grid;
	grid-template-columns: auto auto auto auto;
	grid-gap: 8px;
	margin-top: 20px;
}

.Prize_Item {
	/* Set the frame as the first background image */
	background-image:
		url('/images/Prize frame.webp'),
		/* Frame image */
		linear-gradient(180deg, #000D78 0%, #051ACE 100%);
	/* Gradient overlay */
	/* Configure the frame and gradient to cover the element */
	background-size: 100% 100%;
	/* Ensure both images cover the entire element */
	background-repeat: no-repeat;
	padding: 10%;
	border-radius: 18px;
}

/* Set all .Prize_Item img elements to have a width of 45px by default */
.Prize_Item img {
	width: 45px;
}

/* Set only the first two items to be 35px */
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

.Prize_Tab {
	margin-bottom: 10px;
}

.Tab_Button {
	font-size: 12px;
	padding: 10px 24px;
	width: 48%;
	border-radius: 4px;
	font-style: normal;
	line-height: normal;
	white-space: nowrap;
}

.Tab_Button.Selected {
	border-radius: 4px;
	background: linear-gradient(180deg, #FFC800 0%, #FF7E04 100%);
	color: #622200;
	font-style: normal;
	font-weight: 800;
	line-height: normal;
}

.Redeem_Button {
	margin-top: 10px;
	padding: 9px 20px;
	gap: 10px;
	align-self: stretch;
	border-radius: 4px;
}

.Redeem_Button div {
	font-style: normal;
	line-height: normal;
	letter-spacing: 0.42px;
}

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 9998;
}

.popup-card {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	z-index: 9999;
	text-align: center;
	width: 90%;
	max-width: 330px;
	color: white;
	border-radius: 15px;
	border: 2px solid #FFF;
	background: linear-gradient(180deg, #000D78 -31.67%, #051ACE 101.82%);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.Setting_Control_Section {
	text-align: -webkit-center;
}

.windowsSlider {
	height: 30px;
	width: 230px;
	border-radius: 25px;
	background: #00000060;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px solid white;
}

.windowsSliderInput {
	-webkit-appearance: none;
	background: transparent;
	outline: none;
	border: none;
	height: 20px;
	width: 100%;
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
	position: absolute;
	left: 2px;
	width: 50%;
	height: 80%;
	border-radius: 25px;
	background: white;
	z-index: 1;
}

.language-dropdown select {
	border-radius: 15px;
	padding: 5px;
	outline: none;
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
		bottom: 2px;
	}
}
</style>