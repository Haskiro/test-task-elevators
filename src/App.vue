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
				v-for="button in buttonsList"
				:button="button"
				:key="button.id"
				:style="{ flexBasis: calcFloorHeight() + 1 + 'px' }"
				@callElevator="callElevator"
			/>
		</li>
	</ul>
</template>

<script>
import "@/styles/reset.scss";
import ElevatorShaft from "@/components/ElevatorShaft";
import ElevatorButton from "@/components/ElevatorButton";
import ElevatorCabin from "@/components/ElevatorCabin";
import { uuid } from "vue-uuid";
import {
	checkIfFloorIsInTarget,
	checkPresenceElevatorOnTheFloor,
	findNearestElevator,
	moveElevator,
} from "@/utils/elevator.js";

export default {
	name: "App",
	components: { ElevatorShaft, ElevatorButton, ElevatorCabin },
	data() {
		return {
			floorCount: 5,
			elevatorCount: 1,
			elevators: [],
			windowHeight: null,
			windowWidth: null,
			floorList: [],
			buttonsList: [],
		};
	},
	created() {
		this.checkLocalStorage();
	},
	mounted() {
		this.matchHeightAndWidth();
		this.continueMovingElevator();
	},
	watch: {
		elevators: {
			handler(val) {
				localStorage.setItem(
					"elevators",
					JSON.stringify(
						val.map((item) => {
							return {
								...item,
								moveTo: JSON.stringify(item.moveTo),
							};
						})
					)
				);
			},
			deep: true,
		},
		buttonsList: {
			handler(val) {
				localStorage.setItem("buttonsList", JSON.stringify(val));
			},
			deep: true,
		},
		floorList: {
			handler(val) {
				localStorage.setItem("floorList", JSON.stringify(val));
			},
			deep: true,
		},
	},
	methods: {
		checkLocalStorage: function () {
			const elevatorCount = localStorage.getItem("elevatorCount");
			const floorCount = localStorage.getItem("floorCount");
			if (
				elevatorCount != this.elevatorCount ||
				floorCount != this.floorCount
			) {
				localStorage.clear();
				localStorage.setItem("elevatorCount", this.elevatorCount);
				localStorage.setItem("floorCount", this.floorCount);
			}
			const elevators = JSON.parse(localStorage.getItem("elevators"));
			if (elevators)
				elevators.map((el) => (el.moveTo = JSON.parse(el.moveTo)));
			const floorList = JSON.parse(localStorage.getItem("floorList"));
			const buttonsList = JSON.parse(localStorage.getItem("buttonsList"));
			if (!elevators || !floorList || !buttonsList) {
				this.createFloorList();
				this.createElevatorList();
				this.createButtonList();
			} else {
				this.elevators = [...elevators];
				this.floorList = [...floorList];
				this.buttonsList = [...buttonsList];
			}
		},
		matchHeightAndWidth: function () {
			this.windowHeight = this.$refs.mainBlock.clientHeight - 20;
			this.windowWidth = this.$refs.mainBlock.clientWidth - 70;
		},
		continueMovingElevator: function () {
			this.elevators.forEach((el) => {
				if (el.moving === true) {
					if (el.currentFloor < el.moveTo[0]) el.currentFloor += 1;
					if (el.currentFloor > el.moveTo[0]) el.currentFloor -= 1;
					moveElevator(
						el,
						this.floorList,
						this.buttonsList,
						this.calcFloorHeight
					);
				}
			});
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
		createButtonList: function () {
			for (let i = 1; i <= this.floorCount; i++) {
				this.buttonsList.unshift({ id: i, checked: false });
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
			this.buttonsList[
				this.buttonsList.findIndex((item) => item.id === floor)
			].checked = true;
			const elevatorId = findNearestElevator(floor, this.elevators);
			const indexOfElevator = this.elevators.findIndex(
				(el) => el.id === elevatorId
			);
			const currentElevator = this.elevators[indexOfElevator];
			currentElevator.moveTo.push(floor);
			currentElevator.moving = true;
			currentElevator.firstCall = false;
			if (currentElevator.moveListIsEmpty === true)
				moveElevator(
					currentElevator,
					this.floorList,
					this.buttonsList,
					this.calcFloorHeight
				);
			currentElevator.moveListIsEmpty = false;
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
