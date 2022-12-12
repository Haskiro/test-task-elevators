<template>
	<div class="form">
		<label for="elevator-button">{{ floor }}</label>
		<input type="radio" id="elevator-button" class="button" />
	</div>
</template>

<script>
export default {
	name: "ElevatorButton",
	props: {
		floor: Number,
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.button {
	margin: 0px;
}
</style>
