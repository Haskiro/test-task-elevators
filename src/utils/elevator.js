/* 
floor: number - номер этажа

elevators: {
	id: string, 
	currentFloor: number, 
	moveTo: string[],
	moving: boolean
 }[] - список лифтов

 floorList: {
	id: number, 
	elevatorsCount: number
 }[] - список этажей

 buttonsList: {
	id: number,
	cheked: boolead
 }[] - список кнопок
*/

// Проверка, назначен ли заданному этажу лифт
export function checkIfFloorIsInTarget(floor, elevators) {
	return elevators.some((el) => el.moveTo.some((el) => el === floor));
}

//Проверка, есть ли уже на этаже лифт(ы)
export function checkPresenceElevatorOnTheFloor(floor, floorList) {
	return floorList.find((el) => el.id === floor).elevatorCount > 0;
}

//Поиск ближайшего лифта, приоритет у свободных
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

export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

//Логика движения лифта
export async function moveElevator(
	currentElevator,
	floorList,
	buttonsList,
	calcFloorHeight
) {
	while (currentElevator.moveTo.length > 0) {
		const indexOfFloor = floorList.findIndex(
			(el) => el.id === currentElevator.currentFloor
		);
		if (floorList[indexOfFloor].elevatorCount > 0)
			floorList[indexOfFloor].elevatorCount -= 1;
		if (currentElevator.currentFloor < currentElevator.moveTo[0]) {
			const dif =
				currentElevator.moveTo[0] - currentElevator.currentFloor;
			for (let i = 1; i <= dif; i++) {
				currentElevator.currentHeight += calcFloorHeight() + 2;
				await sleep(1000);
				currentElevator.currentFloor += 1;
			}
			floorList[
				floorList.findIndex((el) => el.id === currentElevator.moveTo[0])
			].elevatorCount += 1;
		} else {
			const dif =
				currentElevator.currentFloor - currentElevator.moveTo[0];
			for (let i = 1; i <= dif; i++) {
				currentElevator.currentHeight -= calcFloorHeight() + 2;
				await sleep(1000);
				currentElevator.currentFloor -= 1;
			}
			floorList[
				floorList.findIndex((el) => el.id === currentElevator.moveTo[0])
			].elevatorCount += 1;
		}
		currentElevator.waiting = true;
		buttonsList[
			buttonsList.findIndex(
				(item) => item.id === currentElevator.moveTo[0]
			)
		].checked = false;
		await sleep(3000);
		currentElevator.moveTo.shift();
		currentElevator.waiting = false;
	}
	currentElevator.moving = false;
	currentElevator.moveListIsEmpty = true;
}
