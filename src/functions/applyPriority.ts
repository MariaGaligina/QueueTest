import {QueueItem} from '../types/types'
import {sortByConditions} from './sortByConditions'

export const applyPriority = (selectedRows: string[], data: QueueItem[], priority: number) => {
	let selectedActions: QueueItem[] = data.filter((task) => selectedRows.includes(task.title))

	if (priority < 0 || selectedActions.some((task) => task.maxPriority < priority)) {
		return data
	} else {
		const updatedData = data.map((item) => {
			if (selectedRows.includes(item.title)) {
				return {...item, priority: priority}
			}
			return item
		})
		return sortByConditions(updatedData)
	}
}
