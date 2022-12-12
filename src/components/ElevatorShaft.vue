<template>
	<div class="shaft">
		<div class="row" :style="{ height: floorHeight + 'px' }"></div>
	</div>
</template>

<script>
export default {
	name: "ElevatorShaft",
	components: {},
	props: {
		windowHeight: Number,
		floorCount: Number,
		floorHeight: Number,
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.shaft {
	display: flex;
	align-items: center;
	position: relative;
}

.row {
	border-top: 1px solid lightgrey;
	width: 100%;
	box-sizing: content-box;
}
</style>
