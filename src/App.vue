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
				:key="floor.id"
				:windowHeight="windowHeight"
				:floorCount="floorCount"
				:floorHeight="calcFloorHeight()"
			/>
			<elevator-cabin
				class="elevator"
				:elevator="elevators[n - 1]"
				:floorHeight="calcFloorHeight()"
				:style="{
					bottom: elevators[n - 1].currentHeight + 'px',
				}"
			/>
		</li>
		<li class="buttonsList">
			<elevator-button
				v-for="floor in floorList"
				:floor="floor.id"
				:key="floor.id"
				:style="{ flexBasis: calcFloorHeight() + 1 + 'px' }"
				@callElevator="callElevator"
			/>
		</li>
	</ul>
</template>

<script>
import "../styles/reset.scss";
import ElevatorShaft from "@/components/ElevatorShaft";
import ElevatorButton from "@/components/ElevatorButton";
import ElevatorCabin from "@/components/ElevatorCabin";
import { uuid } from "vue-uuid";
import {
	checkIfFloorIsInTarget,
	checkPresenceElevatorOnTheFloor,
	findNearestElevator,
	sleep,
} from "@/utils/elevator.js";

export default {
	name: "App",
	components: { ElevatorShaft, ElevatorButton, ElevatorCabin },
	data() {
		return {
			floorCount: 7,
			elevatorCount: 1,
			elevators: [],
			windowHeight: null,
			windowWidth: null,
			floorList: [],
		};
	},
	created() {
		this.createFloorList();
		this.createElevatorList();
	},
	mounted() {
		this.matchHeightAndWidth();
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
			for (let i = 1; i <= this.floorCount; i++) {
				if (i === 1) {
					this.floorList.unshift({
						id: i,
						elevatorCount: this.elevatorCount,
					});
				} else {
					this.floorList.unshift({ id: i, elevatorCount: 0 });
				}
			}
		},
		createElevatorList: function () {
			for (let i = 1; i <= this.elevatorCount; i++) {
				this.elevators.push({
					id: uuid.v4(),
					currentFloor: 1,
					moveTo: [],
					moving: false,
					currentHeight: 0,
					firstCall: true,
					moveListIsEmpty: true,
					waiting: false,
				});
			}
		},
		callElevator: function (floor) {
			if (checkIfFloorIsInTarget(floor, this.elevators)) return;
			if (checkPresenceElevatorOnTheFloor(floor, this.floorList)) return;
			const elevatorId = findNearestElevator(floor, this.elevators);
			const indexOfElevator = this.elevators.findIndex(
				(el) => el.id === elevatorId
			);
			const currentElevator = this.elevators[indexOfElevator];
			const indexOfFloor = this.floorList.findIndex(
				(el) => el.id === currentElevator.currentFloor
			);
			if (this.floorList[indexOfFloor].elevatorCount > 0)
				this.floorList[indexOfFloor].elevatorCount -= 1;
			currentElevator.moveTo.push(floor);
			currentElevator.moving = true;
			currentElevator.firstCall = false;
			if (currentElevator.moveListIsEmpty === true)
				this.moveElevator(currentElevator);
			currentElevator.moveListIsEmpty = false;
		},
		moveElevator: async function (currentElevator) {
			while (currentElevator.moveTo.length > 0) {
				if (currentElevator.currentFloor < currentElevator.moveTo[0]) {
					const dif =
						currentElevator.moveTo[0] -
						currentElevator.currentFloor;
					for (let i = 1; i <= dif; i++) {
						currentElevator.currentHeight +=
							this.calcFloorHeight() + 2;
						await sleep(1000);
						currentElevator.currentFloor += 1;
					}
					currentElevator.moveTo.shift();
					if (currentElevator.moveTo.length === 0)
						currentElevator.moving = false;
				} else {
					const dif =
						currentElevator.currentFloor -
						currentElevator.moveTo[0];
					for (let i = 1; i <= dif; i++) {
						currentElevator.currentHeight -=
							this.calcFloorHeight() + 2;
						await sleep(1000);
						currentElevator.currentFloor -= 1;
					}
					currentElevator.moveTo.shift();
					if (currentElevator.moveTo.length === 0)
						currentElevator.moving = false;
				}
				currentElevator.waiting = true;
				await sleep(3000);
				currentElevator.waiting = false;
			}
			currentElevator.moveListIsEmpty = true;
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
