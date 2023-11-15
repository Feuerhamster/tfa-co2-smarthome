<span class="ripple-loader">
	<span></span>
	<span></span>
</span>


<style lang="scss">
.ripple-loader {
	width: 1.2rem;
	height: 1.2rem;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.ripple-loader span {
	position: absolute;
	border: 4px solid #ffffff;
	border-radius: 50%;
	width: 100%;
	height: 100%;
	animation: ripple-loader 2s infinite;
}

.ripple-loader span:nth-child(2) {
	animation-delay: -1.5s;
}

@keyframes ripple-loader {
	0% {
		transform: scale(0);
		opacity: 1;
	}
	100% {
		transform: scale(1);
		opacity: 0;
	}
}
</style>