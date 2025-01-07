<!-- PrizePopup.vue -->
<template>
	<div v-if="isVisible"
		class="prize-popup-overlay fixed-top w-100 h-100 d-flex flex-column justify-content-center align-items-center">
		<div class="prize-popup d-flex flex-column align-items-center position-relative text-center">
			<img class="Congrats position-absolute start-50 translate-middle-x"
				:src="`/images/Congrats_${this.$i18n.locale}.webp`" alt="Congrats">
			<img class="Treasure_Box position-absolute start-50 translate-middle-x" style="z-index: 1;"
				src="/images/Treasure_Box.webp" alt="Treasure Box">
			<img class="Outer_Flare_Left position-absolute" src="/images/Outer_Flare_Left.webp" alt="Outer Flare Frame">
			<img class="Outer_Flare_Right position-absolute" src="/images/Outer_Flare_Right.webp"
				alt="Outer Flare Frame">
			<img class="Outer_Flare_Bottom position-absolute" src="/images/Outer_Flare_Bottom.webp "
				alt="Outer Flare Frame">

			<div
				class="prize-inner-popup position-relative text-center d-flex flex-column justify-content-center align-items-center">
				<img class="Inner_Flare_Top position-absolute" src="/images/Inner_Flare_Top.webp"
					alt="Inner Flare Frame">
				<img class="Inner_Flare_Bottom position-absolute" src="/images/Inner_Flare_Bottom.webp"
					alt="Inner Flare Frame">
				<div style="padding: 20px;">
					<div class="prize-popup-header">
						<h2 class="color-white text-uppercase fw-bold fs-18">{{ $t('You_Won') }} :</h2>
					</div>
					<div class="prize-popup-body">
						<p class="prize-text color-white text-uppercase fw-800 fs-36">{{ prize.value }}</p>
					</div>
				</div>
			</div>

			<div class="d-flex" style="gap: 5px">
				<div class="text-decoration-underline fs-14 color-white text-uppercase">
					{{ $t('Promo') }}
				</div>

				<div @click="copyToClipboard" style="cursor: pointer; z-index: 1;">
					<img src="/images/Reward_Copy_Icon.svg" alt="Copy">
				</div>
			</div>

			<div class="d-flex" style="margin-top: 10px; gap: 20px; width: 260px">
				<input type="checkbox" id="checkbox" v-model="checked" />
				<div class="color-white fs-14 text-start">
					{{ $t('Checking_Msg') }}
				</div>
			</div>

			<div class="prize-popup-footer">
				<button class="background-orange color-622200 fs-14 fw-800 text-uppercase position-relative rounded-2"
					style="width: 200px; margin: 20px 0; z-index: 1;" @click="checkRedeem">{{ $t('Redeem') }}</button>
			</div>
		</div>

		<div v-if="showCopyText" class="color-01BA20 fs-14 fw-600">
			&#10003; {{ $t('Copied_Text') }}
		</div>

		<div v-if="showCheckText" class="color-F00 fs-14 fw-600">
			{{ $t('Error_Text') }}
		</div>

		<div v-if="showErrorCopyText" class="color-F00 fs-14 fw-600">
			{{ $t('Error_Copy_Text') }}
		</div>

	</div>
</template>

<script>
export default {
	props: {
		prize: {
			type: Object,
			default: () => ({
				value: "",
				code: "",
			}),
		},
		isVisible: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			showCopyText: false,
			successCopyText: false,
			showCheckText: false,
			checked: false,
			showErrorCopyText: false
		}
	},
	watch: {
		isVisible(newVal) {
			// When popup is shown, prevent body scrolling
			if (newVal) {
				document.body.style.overflow = "hidden"; // Disable scrolling
			} else {
				document.body.style.overflow = ""; // Re-enable scrolling when popup is closed
			}
		},
	},
	methods: {
		closePopup() {
			this.$emit('update:isVisible', false); // Close the popup by emitting event

			this.showCopyText = false;
			this.showCheckText = false;
			this.checked = false;
			this.showErrorCopyText = false;
			this.successCopyText = false;
		},
		copyToClipboard() {
			const promoCode = this.prize.code;  // Get the actual promo code value

			if (navigator.clipboard) {
				// Use the Clipboard API for modern browsers
				navigator.clipboard.writeText(promoCode).then(() => {
					// alert("Promo code copied: " + promoCode);
				}).catch((err) => {
					console.error("Error copying text: ", err);
					// Set error flag when copying fails
					this.showErrorCopyText = true;
				});
			} else {
				// Fallback using textarea for older browsers or mobile devices
				const textArea = document.createElement('textarea');
				textArea.value = promoCode; // Set the value to the promo code
				document.body.appendChild(textArea);
				textArea.select();

				try {
					const successful = document.execCommand('copy');
					if (!successful) {
						// If execCommand fails to copy, set the error flag
						this.showErrorCopyText = true;
					}
				} catch (err) {
					// Catch any error and set the error flag
					console.error("Error copying text using execCommand: ", err);
					this.showErrorCopyText = true;
				}

				document.body.removeChild(textArea);
			}

			this.successCopyText = true;
			this.showCopyText = true;
			this.showCheckText = false;
		}
		,
		checkRedeem() {
			if (!this.successCopyText) {
				// If the promo code hasn't been copied
				this.showCheckText = true; // Show "Copy and tick the checkbox" message
			} else if (!this.checked) {
				// If the checkbox isn't ticked
				this.showCheckText = true; // Show "Copy and tick the checkbox" message
				this.showCopyText = false; // Hide the "Promo code copied" message, but retain its value as true
			} else {
				// Both conditions are met: promo code is copied, and checkbox is ticked
				this.showCheckText = false; // Hide the "Copy and tick the checkbox" message
				this.closePopup(); // Trigger the closePopup function
			}
		}
	},
};
</script>

<style scoped>
.prize-popup-overlay {
	background: rgba(0, 0, 0, 0.5);
	/* Semi-transparent black background */
	z-index: 101;
	backdrop-filter: blur(10px);
	/* Apply blur effect to the background */
}

.Treasure_Box {
	top: 30px;
	width: 60%;
	max-width: 280px;
}

.Congrats {
	width: 90%;
	top: -9%;
}

.Outer_Flare_Left,
.Outer_Flare_Right {
	height: 320px;
}

.Outer_Flare_Left {
	left: -30px;
}

.Outer_Flare_Right {
	right: -30px;
	bottom: 10px;
}

.Outer_Flare_Bottom {
	width: 320px;
	left: 0;
	bottom: -104px;
}

.prize-inner-popup::before {
	content: "";
	background: rgba(255, 255, 255, 0.20);
	mix-blend-mode: overlay;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.prize-inner-popup {
	max-width: 400px;
	width: 80%;
	height: auto;
	margin-top: 60%;
	margin-bottom: 20px;
}

.Inner_Flare_Top,
.Inner_Flare_Bottom {
	height: 150px;
	width: 200px;
}

.Inner_Flare_Top {
	top: -75px;
	left: 10px;
}

.Inner_Flare_Bottom {
	bottom: -75px;
	right: 15px;
}

.prize-popup {
	background: rgba(255, 255, 255, 0.10);
	padding: 20px;
	width: 90%;
	max-width: 500px;
	max-height: 90vh;
}

.prize-popup-header h2 {
	margin-bottom: 15px;
}

.prize-text {
	font-weight: bold;
	margin-top: 10px;
}

.prize-popup-footer button {
	padding: 10px 20px;
	border: none;
	cursor: pointer;
}

.prize-popup-footer button:hover {
	background-color: #e76f00;
}

@media screen and (max-width: 430px) {
	.prize-text {
		font-size: 24px;
	}
}

@media screen and (min-width: 375px) {
	.Congrats {
		top: -10%;
	}
}

/* CSS Start From 430px width */
@media screen and (min-width: 430px) {

	.prize-inner-popup {
		margin-top: 55%;
	}

	.Congrats {
		top: -10%;
	}

	.prize-text {
		font-size: 36px;
	}

}

/* CSS Start From 550px width */
@media screen and (min-width: 550px) {

	.Congrats {
		top: -78px;
	}
}

/* CSS Start From 769px width */
@media screen and (min-width: 769px) {

	.Treasure_Box {
		top: 35px;
		width: 280px;
	}

	.Congrats {
		top: -80px;
		width: 450px;
	}
}
</style>
