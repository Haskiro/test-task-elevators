<template>
	<div class="elevator" :style="{ height: floorHeight + 2 + 'px' }">
		<span
			v-show="
				elevator.moving && elevator.currentFloor !== elevator.moveTo[0]
			"
			class="iconWrapper"
			><img
				src="@/assets/arrow.svg"
				alt="arrow"
				:style="{
					transform:
						elevator.currentFloor > elevator.moveTo[0]
							? 'rotate(180deg)'
							: 'rotate(0)',
				}"
			/>{{ elevator.moveTo[0] }}</span
		>
	</div>
</template>

<script>
export default {
	name: "ElevatorButton",
	props: {
		floorHeight: Number,
		elevator: Object,
	},
	data() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.elevator {
	background: cyan;
	width: 100%;
}

.iconWrapper {
	width: 40px;
	display: flex;
	align-items: center;
	gap: 5px;
	height: 20px;
	margin: 0px auto;
	background: white;
	border: 1px black solid;
	& img {
		height: 20px;
	}
}
</style>
