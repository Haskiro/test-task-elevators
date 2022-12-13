<template>
	<div class="form">
		<p>{{ floor }}</p>
		<button
			@click="callElevator"
			:id="'elevator-button' + floor"
			class="button"
			:class="{ checked: checked }"
		/>
	</div>
</template>

<script>
export default {
	name: "ElevatorButton",
	props: {
		floor: Number,
		elevatorsCount: Number,
	},
	data() {
		return {
			checked: false,
		};
	},
	watch: {
		elevatorsCount(value) {
			if (value > 0) this.checked = false;
		},
	},
	methods: {
		callElevator: function () {
			this.$emit("callElevator", this.floor);
			if (this.elevatorsCount === 0) {
				this.checked = true;
			}
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
