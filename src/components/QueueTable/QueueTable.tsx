import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {QueueItem} from './../../types/types.ts'
import {movePositionDown} from '../../functions/movePositionDown.ts'
import {movePositionUp} from '../../functions/movePositionUp.ts'
import {movePriorityDown} from '../../functions/movePriorityDown.ts'
import {movePriorityUp} from '../../functions/movePriorityUp.ts'
import {applyPriority} from '../../functions/applyPriority.ts'
import styles from './Queue.module.scss'

const QueueTable: React.FC = () => {
	const [data, setData] = useState<QueueItem[]>([])
	const [selectedRows, setSelectedRows] = useState<string[]>([])
	const [maxPosition, setMaxPosition] = useState<number>(Infinity)
	const [minPosition, setMinPosition] = useState<number>(0)
	const [positions, setPositions] = useState<number[]>([])
	const [maxPriorities, setMaxPriorities] = useState<number[]>([])
	const [priority, setPriority] = useState<number>(0)
	const [maxPriority, setMaxPriority] = useState<number>(Infinity)

	const sortByConditions = (array: QueueItem[]) => {
		return array.sort((a: QueueItem, b: QueueItem) => {
			if (a.priority !== b.priority) {
				return a.priority - b.priority
			}
			return b.position - a.position
		})
	}

	const findMin = (values: number[]) => values.reduce((x, y) => Math.min(x, y))
	const findMax = (values: number[]) => values.reduce((x, y) => Math.max(x, y))

	useEffect(() => {
		const fetchData = async () => {
			const result = await axios.get('http://localhost:3000/action')
			const formattedData: QueueItem[] = result.data.map((item: QueueItem) => ({
				title: item.title,
				position: item.position,
				priority: item.priority,
				maxPriority: item.maxPriority,
			}))

			setData(sortByConditions(formattedData))
			setPositions(formattedData.map((item) => item.position))
			setMaxPriorities(formattedData.map((item) => item.maxPriority))
		}
		fetchData()
	}, [])

	useEffect(() => {
		if (data.length > 0) {
			setMaxPosition(findMax(positions))
			setMinPosition(findMin(positions))
			setMaxPriority(findMax(maxPriorities))
		}
	}, [data])

	const toggleRowSelection = (e: React.MouseEvent<HTMLTableRowElement>) => {
		const title = e.currentTarget.children[0].textContent

		if (title === null) {
			return
		} else {
			setSelectedRows((prev) => {
				if (prev.includes(title)) {
					return prev.filter((i) => i !== title)
				} else {
					return [...prev, title]
				}
			})
		}
	}

	const handleGenerateJson = () => {
		console.log(JSON.stringify(data, null, 2))
	}

	return (
		<div className={styles.content}>
			<div className={styles.table}>
				<table>
					<thead>
						<tr>
							<th>Название</th>
							<th>Позиция</th>
							<th>Приоритет</th>
							<th>Макс. приоритет</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item) => (
							<tr
								key={item.title}
								onClick={(event: React.MouseEvent<HTMLTableRowElement, MouseEvent>) =>
									toggleRowSelection(event)
								}
								style={{
									backgroundColor: selectedRows.includes(item.title) ? 'lightblue' : 'white',
								}}>
								<td>{item.title}</td>
								<td>{item.position}</td>
								<td>{item.priority}</td>
								<td>{item.maxPriority}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className={styles.controls}>
				<button onClick={() => setData(movePositionUp(selectedRows, data, maxPosition))}>
					Переместить вверх по позиции
				</button>
				<button onClick={() => setData(movePositionDown(selectedRows, data, minPosition))}>
					Переместить вниз по позиции
				</button>
				<button onClick={() => setData(movePriorityUp(selectedRows, data))}>
					Переместить вверх по приоритету
				</button>
				<button onClick={() => setData(movePriorityDown(selectedRows, data))}>
					Переместить вниз по приоритету
				</button>
				<label htmlFor='setPriority'>Выбор значения приоритета</label>
				<input
					type='number'
					value={priority}
					onChange={(e) => setPriority(Number(e.target.value))}
					placeholder='Введите приоритет'
					min='0'
					max={maxPriority}
					id='setPriority'
				/>
				<button onClick={() => setData(applyPriority(selectedRows, data, priority))}>
					Установить приоритет
				</button>
				<button onClick={handleGenerateJson}>Сформировать JSON</button>
			</div>
		</div>
	)
}

export default QueueTable
