import {QueueItem} from '../types/types'
import {sortByConditions} from './sortByConditions'

export const movePositionDown = (
	selectedRows: string[],
	data: QueueItem[],
	minPosition: number
): QueueItem[] => {
	let selectedActions: QueueItem[] = data.filter((task) => selectedRows.includes(task.title))
	if (
		selectedActions.length === 0 ||
		selectedActions.some((task) => task.position === minPosition)
	) {
		return data
	}
	const updatedData = [...data]

	selectedActions.forEach((task) => {
		const currentPosition = task.position
		const targetItemIndex = updatedData.findIndex((item) => item.position === currentPosition - 1)

		if (targetItemIndex !== -1) {
			updatedData[targetItemIndex] = {
				...updatedData[targetItemIndex],
				position: updatedData[targetItemIndex].position + 1,
			}
		}

		updatedData[data.findIndex((item) => item.title === task.title)] = {
			...task,
			position: currentPosition - 1,
		}
	})

	return sortByConditions(updatedData)
}
