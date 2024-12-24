import {QueueItem} from '../types/types'
import {sortByConditions} from './sortByConditions'

export const movePositionUp = (
	selectedRows: string[],
	data: QueueItem[],
	maxPosition: number
): QueueItem[] => {
	// Находим выделенные элементы
	let selectedActions: QueueItem[] = data.filter((task) => selectedRows.includes(task.title))

	// Если ни один из выделенных элементов не может быть перемещён вниз, возвращаем исходные данные
	let ans = selectedActions.some((task) => task.position === maxPosition)
	console.log('ans', ans)
	selectedActions.map((task) => console.log(task.position === maxPosition))

	if (
		selectedActions.length === 0 ||
		selectedActions.some((task) => task.position === maxPosition)
	) {
		return data
	}

	const updatedData = [...data]

	selectedActions.forEach((task) => {
		const currentPosition = task.position

		const targetItemIndex = updatedData.findIndex((item) => item.position === currentPosition + 1)

		if (targetItemIndex !== -1) {
			updatedData[targetItemIndex] = {
				...updatedData[targetItemIndex],
				position: updatedData[targetItemIndex].position - 1,
			}
		}

		updatedData[data.findIndex((item) => item.title === task.title)] = {
			...task,
			position: currentPosition + 1,
		}
	})

	return sortByConditions(updatedData)
}
