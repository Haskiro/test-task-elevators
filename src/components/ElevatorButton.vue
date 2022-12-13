<template>
	<div class="form">
		<p>{{ button.id }}</p>
		<button
			@click="callElevator"
			:id="'elevator-button' + button.id"
			class="button"
			:class="{ checked: button.checked }"
		/>
	</div>
</template>

<script>
export default {
	name: "ElevatorButton",
	props: {
		button: Object,
	},
	methods: {
		callElevator: function () {
			this.$emit("callElevator", this.button.id);
		},
	},
};
</script>

<style lang="scss" scoped>
.button {
	margin: 0px;
	width: 20px;
	height: 20px;
	background: grey;
	border: none;
	border-radius: 50%;
	padding: 0px;
	margin-left: 5px;
	cursor: pointer;
	&.checked {
		background: orange;
	}
}

.form {
}
</style>
