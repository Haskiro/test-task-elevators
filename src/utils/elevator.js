/* 
floor: number - номер этажа
elevators: {
	id: string, 
	currentFloor: number, 
	moveTo: string[],
	moving: boolean
 }[] - список лифтов
*/
// Проверка, назначен ли заданному этажу лифт
export function checkIfFloorIsInTarget(floor, elevators) {
	return elevators.some((el) => el.moveTo.some((el) => el === floor));
}

//Проверка, есть ли уже на этаже лифт(ы)
export function checkPresenceElevatorOnTheFloor(floor, floorList) {
	return floorList.find((el) => el.id === floor).elevatorCount > 0;
}

//
export function findNearestElevator(floor, elevators) {
	let nearestElevator;
	let minDif = 1000;
	const filteredElevators = findWorkfreeElevators(elevators);
	if (filteredElevators.length > 0) {
		for (let item of filteredElevators) {
			let dif = Math.abs(floor - item.currentFloor);

			if (dif < minDif) {
				minDif = dif;
				nearestElevator = item.id;
			}
		}
	} else {
		for (let item of elevators) {
			let dif = Math.abs(floor - item.moveTo[item.moveTo.length - 1]);

			if (dif < minDif) {
				minDif = dif;
				nearestElevator = item.id;
			}
		}
	}

	return nearestElevator;
}

//Проверка, есть ли свободные лифты
export function findWorkfreeElevators(elevators) {
	return elevators.filter((el) => el.moving === false);
}
