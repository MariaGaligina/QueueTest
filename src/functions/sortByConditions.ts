import {QueueItem} from '../types/types'

export const sortByConditions = (array: QueueItem[]) => {
	return array.sort((a: QueueItem, b: QueueItem) => {
		if (a.priority !== b.priority) {
			return a.priority - b.priority
		}
		return b.position - a.position
	})
}
