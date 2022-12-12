<template>
	<ul class="list" ref="mainBlock">
		<li
			class="item"
			:style="{
				width:
					calcElevatorWidth() > 100
						? 100 + 'px'
						: calcElevatorWidth() + 'px',
			}"
			v-for="n in elevatorCount"
			:key="n"
		>
			<elevator-shaft
				v-for="floor in floorList"
				:key="floor"
				:windowHeight="windowHeight"
				:floorCount="floorCount"
				:floorHeight="calcFloorHeight()"
			/>
			<elevator-cabin
				class="elevator"
				:elevator="elevators[n - 1]"
				:floorHeight="calcFloorHeight()"
			/>
		</li>
		<li class="buttonsList">
			<elevator-button
				v-for="floor in floorList"
				:floor="floor"
				:key="floor"
				:style="{ flexBasis: calcFloorHeight() + 1 + 'px' }"
			/>
		</li>
	</ul>
</template>

<script>
import "../styles/reset.scss";
import ElevatorShaft from "@/components/ElevatorShaft";
import ElevatorButton from "@/components/ElevatorButton";
import ElevatorCabin from "@/components/ElevatorCabin.vue";
import { uuid } from "vue-uuid";

export default {
	name: "App",
	components: { ElevatorShaft, ElevatorButton, ElevatorCabin },
	data() {
		return {
			floorCount: 5,
			elevatorCount: 2,
			elevators: [
				{
					id: uuid.v4(),
					currentFloor: 1,
					moveTo: [5],
					moving: true,
				},
				{
					id: uuid.v4(),
					currentFloor: 1,
					moveTo: [],
					moving: false,
				},
			],
			elevatorMargin: null,
			windowHeight: null,
			windowWidth: null,
			floorList: [],
		};
	},
	created() {
		this.createFloorList();
	},
	mounted() {
		this.matchHeightAndWidth();
		this.calcElevatorMargin();
	},
	methods: {
		matchHeightAndWidth: function () {
			this.windowHeight = this.$refs.mainBlock.clientHeight - 20;
			this.windowWidth = this.$refs.mainBlock.clientWidth - 70;
		},
		calcElevatorWidth: function () {
			return Math.floor(this.windowWidth / this.elevatorCount);
		},
		calcFloorHeight: function () {
			return Math.floor(this.windowHeight / this.floorCount);
		},
		createFloorList: function () {
			for (var i = 1; i <= this.floorCount; i++) {
				this.floorList.unshift(i);
			}
		},
		calcElevatorMargin: function () {
			this.elevatorMargin =
				this.windowHeight - this.calcFloorHeight() * this.floorCount;
		},
	},
	computed: {},
};
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin: 10px 0px;
	height: calc(100vh - 20px);
}

.list {
	height: 100%;
	display: flex;
}

.item {
	border-right: 2px solid black;
	border-bottom: 2px solid black;
	border-top: 2px solid black;
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}

.buttonsList {
	display: flex;
	flex-direction: column;
	& .form {
		display: flex;
		align-items: center;
	}
}

.elevator {
	position: absolute;
	left: 0px;
	bottom: 0px;
}
</style>
