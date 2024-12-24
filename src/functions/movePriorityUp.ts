import {QueueItem} from '../types/types'
import {sortByConditions} from './sortByConditions'

export const movePriorityUp = (selectedRows: string[], data: QueueItem[]): QueueItem[] => {
	let selectedActions: QueueItem[] = []
	let selectedPriority: number[] = []

	selectedRows.forEach((item) => {
		selectedActions.push(data.filter((task) => task.title === item)[0])
	})
	selectedPriority = selectedActions.map((task) => task.priority)

	let isNullPriority: boolean = false
	selectedActions.map((item) => {
		if (item.priority === 0) {
			isNullPriority = true
		}
	})

	if (isNullPriority) {
		return data
	} else {
		const newData = [...data].map((task) => {
			if (task.priority > 0 && selectedRows.includes(task.title)) {
				return {
					...task,
					priority: task.priority - 1,
				}
			} else {
				return task
			}
		})

		return sortByConditions(newData)
	}
}
