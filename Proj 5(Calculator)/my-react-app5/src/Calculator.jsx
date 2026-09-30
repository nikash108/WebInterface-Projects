import { useEffect, useState } from 'react'
import './Calculator.css'

const buttons = [
	{ label: 'AC', type: 'action' },
	{ label: '+/-', type: 'action' },
	{ label: '%', type: 'action' },
	{ label: '/', type: 'operator' },
	{ label: '7', type: 'number' },
	{ label: '8', type: 'number' },
	{ label: '9', type: 'number' },
	{ label: '*', type: 'operator' },
	{ label: '4', type: 'number' },
	{ label: '5', type: 'number' },
	{ label: '6', type: 'number' },
	{ label: '-', type: 'operator' },
	{ label: '1', type: 'number' },
	{ label: '2', type: 'number' },
	{ label: '3', type: 'number' },
	{ label: '+', type: 'operator' },
	{ label: '0', type: 'number', wide: true },
	{ label: '.', type: 'number' },
	{ label: '=', type: 'equals' },
]

const formatValue = (value) => {
	if (!Number.isFinite(value)) return 'Error'
	return String(Number(value.toFixed(10)))
}

function Calculator() {
	const [display, setDisplay] = useState('0')
	const [storedValue, setStoredValue] = useState(null)
	const [operator, setOperator] = useState(null)
	const [waitingForOperand, setWaitingForOperand] = useState(false)

	const clear = () => {
		setDisplay('0')
		setStoredValue(null)
		setOperator(null)
		setWaitingForOperand(false)
	}

	const inputNumber = (value) => {
		if (display === 'Error' || waitingForOperand) {
			setDisplay(value)
			setWaitingForOperand(false)
			return
		}
		if (value === '.' && display.includes('.')) return
		setDisplay(display === '0' && value !== '.' ? value : display + value)
	}

	const calculate = (left, right, operation) => {
		if (operation === '+') return left + right
		if (operation === '-') return left - right
		if (operation === '*') return left * right
		if (operation === '/') return right === 0 ? NaN : left / right
		return right
	}

	const chooseOperator = (nextOperator) => {
		const currentValue = Number(display)
		if (Number.isNaN(currentValue)) return
		if (storedValue !== null && operator && !waitingForOperand) {
			const result = calculate(storedValue, currentValue, operator)
			setDisplay(formatValue(result))
			setStoredValue(result)
		} else {
			setStoredValue(currentValue)
		}
		setOperator(nextOperator)
		setWaitingForOperand(true)
	}

	const press = (label) => {
		if (/^\d$/.test(label) || label === '.') inputNumber(label)
		else if (label === 'AC') clear()
		else if (label === '+/-') setDisplay(formatValue(Number(display) * -1))
		else if (label === '%') setDisplay(formatValue(Number(display) / 100))
		else if (label === '=') {
			if (storedValue !== null && operator) {
				const result = calculate(storedValue, Number(display), operator)
				setDisplay(formatValue(result))
				setStoredValue(null)
				setOperator(null)
				setWaitingForOperand(true)
			}
		} else chooseOperator(label)
	}

	useEffect(() => {
		const handleKeyDown = (event) => {
			const keyMap = { Enter: '=', Escape: 'AC', Backspace: 'AC' }
			const key = keyMap[event.key] || event.key
			if (/^[0-9.+\-*/%]$/.test(key) || key === '=' || key === 'AC') {
				event.preventDefault()
				press(key)
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	})

	return (
		<main className="calculator-page">
			<section className="calculator-shell" aria-label="Calculator">
				<div className="calculator-heading">
					<div>
						<p className="eyebrow">Pocket arithmetic</p>
						<h1>Calculate<br /><em>clearly.</em></h1>
					</div>
					<span className="status-dot" aria-label="Ready" />
				</div>

				<div className="display-panel">
					<span className="display-label">Result</span>
					<output className="display-value" aria-live="polite">{display}</output>
				</div>

				<div className="keypad">
					{buttons.map(({ label, type, wide }) => (
						<button
							className={`key key-${type}${wide ? ' key-wide' : ''}`}
							key={label}
							type="button"
							onClick={() => press(label)}
							aria-label={label === '*' ? 'multiply' : label}
						>
							{label === '*' ? '×' : label}
						</button>
					))}
				</div>
				<p className="calculator-footnote">Basic operations <span>•</span> keyboard ready</p>
			</section>
		</main>
	)
}

export default Calculator
