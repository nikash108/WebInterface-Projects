import { useEffect, useId, useReducer, useState } from 'react'
import './Form.css'

const initialState = {
	values: { name: '', email: '', username: '', password: '', confirm: '', terms: false },
	touched: {},
	submitted: false,
}

const passwordRules = [
	['length', 'At least 8 characters', (value) => value.length >= 8],
	['upper', 'One uppercase letter', (value) => /[A-Z]/.test(value)],
	['number', 'One number', (value) => /\d/.test(value)],
	['symbol', 'One special character', (value) => /[^A-Za-z0-9]/.test(value)],
]

function formReducer(state, action) {
	if (action.type === 'change') {
		return { ...state, values: { ...state.values, [action.name]: action.value } }
	}
	if (action.type === 'touch') return { ...state, touched: { ...state.touched, [action.name]: true } }
	if (action.type === 'submit') return { ...state, submitted: true, touched: Object.fromEntries(Object.keys(state.values).map((key) => [key, true])) }
	return state
}

function validate(values, usernameAvailable = true) {
	const errors = {}
	if (!values.name.trim()) errors.name = 'Tell us your full name.'
	if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email address.'
	if (!/^[a-zA-Z0-9_]{3,16}$/.test(values.username)) errors.username = 'Use 3-16 letters, numbers, or underscores.'
	else if (!usernameAvailable) errors.username = 'That username is already taken.'
	if (!passwordRules.every(([, , test]) => test(values.password))) errors.password = 'Your password does not meet every requirement.'
	if (values.confirm !== values.password) errors.confirm = 'Passwords do not match.'
	if (!values.terms) errors.terms = 'Please accept the terms to continue.'
	return errors
}

function Field({ id, label, error, touched, hint, children }) {
	return <div className={`field ${touched && error ? 'has-error' : ''}`}>
		<label htmlFor={id}>{label}</label>
		{children}
		<div className="field-meta">{touched && error ? <span className="error" role="alert">{error}</span> : hint && <span>{hint}</span>}</div>
	</div>
}

function Form() {
	const [state, dispatch] = useReducer(formReducer, initialState)
	const [usernameStatus, setUsernameStatus] = useState('idle')
	const [success, setSuccess] = useState(false)
	const formId = useId()
	const { values, touched } = state
	const validUsernameFormat = /^[a-zA-Z0-9_]{3,16}$/.test(values.username)
	const visibleUsernameStatus = validUsernameFormat ? usernameStatus : 'idle'
	const errors = validate(values, visibleUsernameStatus !== 'taken')

	useEffect(() => {
		if (!validUsernameFormat) return undefined
		const timer = window.setTimeout(() => setUsernameStatus(values.username.toLowerCase() === 'admin' ? 'taken' : 'available'), 650)
		return () => window.clearTimeout(timer)
	}, [values.username, validUsernameFormat])

	const showError = (name) => (touched[name] || state.submitted) && errors[name]
	const update = (event) => {
		const { name, type, checked, value } = event.target
		if (name === 'username') setUsernameStatus(/^[a-zA-Z0-9_]{3,16}$/.test(value) ? 'checking' : 'idle')
		dispatch({ type: 'change', name, value: type === 'checkbox' ? checked : value })
	}
	const submit = (event) => {
		event.preventDefault()
		dispatch({ type: 'submit' })
		if (!Object.keys(errors).length && visibleUsernameStatus === 'available') setSuccess(true)
	}

	if (success) return <main className="page-shell"><section className="success-panel" aria-live="polite"><div className="success-mark">OK</div><p className="eyebrow">Account ready</p><h1>Welcome aboard, {values.name.split(' ')[0]}.</h1><p>Your profile has been created with <strong>{values.email}</strong>.</p><button className="text-button" type="button" onClick={() => window.location.reload()}>Create another account</button></section></main>

	return <main className="page-shell">
		<section className="intro"><div className="brand-mark">N<span>/</span></div><p className="eyebrow">New account</p><h1>Make room for<br /><em>what&apos;s next.</em></h1><p className="intro-copy">A considered space for your ideas, projects, and the people who bring them to life.</p><div className="progress"><span>01</span><div><i /><b /></div><span>03</span></div><p className="step-label">Your details <span>•</span> Takes about 2 minutes</p></section>
		<section className="form-panel"><div className="form-heading"><div><p className="eyebrow">Step 01 / 03</p><h2>Create your account</h2></div><span className="required-note">* Required</span></div>
			<form onSubmit={submit} noValidate>
				<div className="form-grid">
					<Field id={`${formId}-name`} label="Full name" error={showError('name')} touched={touched.name || state.submitted} hint="How should we call you?"><input id={`${formId}-name`} name="name" value={values.name} onChange={update} onBlur={() => dispatch({ type: 'touch', name: 'name' })} placeholder="Alex Morgan" autoComplete="name" /></Field>
					<Field id={`${formId}-email`} label="Email address" error={showError('email')} touched={touched.email || state.submitted} hint="We&apos;ll never share it."><input id={`${formId}-email`} name="email" value={values.email} onChange={update} onBlur={() => dispatch({ type: 'touch', name: 'email' })} placeholder="alex@example.com" autoComplete="email" type="email" /></Field>
					<Field id={`${formId}-username`} label="Username" error={showError('username')} touched={touched.username || state.submitted} hint={visibleUsernameStatus === 'checking' ? 'Checking availability…' : visibleUsernameStatus === 'available' ? 'Username is available.' : 'Your public handle.'}><div className="input-status"><input id={`${formId}-username`} name="username" value={values.username} onChange={update} onBlur={() => dispatch({ type: 'touch', name: 'username' })} placeholder="alexmorgan" autoComplete="username" aria-describedby={`${formId}-username-status`} />{visibleUsernameStatus === 'available' && <span className="available" id={`${formId}-username-status`}>OK</span>}</div></Field>
					<Field id={`${formId}-password`} label="Password" error={showError('password')} touched={touched.password || state.submitted} hint="Make it memorable, not guessable."><input id={`${formId}-password`} name="password" value={values.password} onChange={update} onBlur={() => dispatch({ type: 'touch', name: 'password' })} placeholder="••••••••" autoComplete="new-password" type="password" /></Field>
					<div className="password-meter" aria-label="Password requirements">{passwordRules.map(([key, label, test]) => <span className={test(values.password) ? 'met' : ''} key={key}><i />{label}</span>)}</div>
					<Field id={`${formId}-confirm`} label="Confirm password" error={showError('confirm')} touched={touched.confirm || state.submitted}><input id={`${formId}-confirm`} name="confirm" value={values.confirm} onChange={update} onBlur={() => dispatch({ type: 'touch', name: 'confirm' })} placeholder="••••••••" autoComplete="new-password" type="password" /></Field>
				</div>
				<label className={`terms ${showError('terms') ? 'has-error' : ''}`}><input type="checkbox" name="terms" checked={values.terms} onChange={update} onBlur={() => dispatch({ type: 'touch', name: 'terms' })} /><span>I agree to the <a href="#terms">Terms of use</a> and <a href="#privacy">Privacy policy</a>.</span></label>
				{showError('terms') && <p className="error terms-error" role="alert">{errors.terms}</p>}
				<button className="submit-button" type="submit">Continue <span>→</span></button>
			</form>
		</section>
	</main>
}

export default Form
