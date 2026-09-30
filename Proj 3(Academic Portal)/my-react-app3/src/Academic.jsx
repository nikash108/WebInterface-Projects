import { useState } from 'react'
import './Academic.css'

const subjects = [
	{ code: 'CS301', name: 'Data Structures', teacher: 'Dr. Smith', grade: 'A', attendance: 85, tone: 'green' },
	{ code: 'CS302', name: 'Database Management', teacher: 'Prof. Johnson', grade: 'B+', attendance: 78, tone: 'blue' },
	{ code: 'CS303', name: 'Web Development', teacher: 'Dr. Williams', grade: 'A+', attendance: 90, tone: 'green' },
	{ code: 'CS304', name: 'Operating Systems', teacher: 'Prof. Brown', grade: 'B', attendance: 75, tone: 'blue' },
	{ code: 'CS305', name: 'Computer Networks', teacher: 'Dr. Davis', grade: 'A-', attendance: 80, tone: 'green' },
	{ code: 'CS306', name: 'Software Engineering', teacher: 'Prof. Miller', grade: 'B+', attendance: 70, tone: 'coral' },
]

const metrics = [
	{ label: 'CGPA', value: '8.2', detail: 'Out of 10', icon: '✦', tone: 'mint' },
	{ label: 'Attendance', value: '82%', detail: 'Minimum 75% required', icon: '◷', tone: 'blue' },
	{ label: 'Current GPA', value: '8.5', detail: 'This semester', icon: '↗', tone: 'gold' },
	{ label: 'Credits', value: '18/24', detail: 'Completed', icon: '◈', tone: 'lavender' },
]

function Icon({ children }) {
	return <span className="icon" aria-hidden="true">{children}</span>
}

function Academic() {
	const [semester, setSemester] = useState('3rd Semester')
	const [notificationsOpen, setNotificationsOpen] = useState(false)
	const [profileOpen, setProfileOpen] = useState(false)
	const [criteriaOpen, setCriteriaOpen] = useState(false)
	const [transcriptOpen, setTranscriptOpen] = useState(false)

	function downloadReport() {
		const report = `Studentfolio academic report\nStudent: Nikash\nSemester: ${semester}\nCGPA: 8.2\nAttendance: 82%\nCredits: 18/24`
		const reportUrl = URL.createObjectURL(new Blob([report], { type: 'text/plain' }))
		const link = document.createElement('a')
		link.href = reportUrl
		link.download = `nikash-${semester.toLowerCase().replace(' ', '-')}-report.txt`
		link.click()
		URL.revokeObjectURL(reportUrl)
	}

	return (
		<main className="portal-shell">
			<header className="topbar">
				<div className="brand-lockup"><div className="brand-mark"><span>✦</span></div><div><p className="eyebrow">COLLEGE OF COMPUTING</p><h1>Student<span>folio</span></h1></div></div>
				<div className="topbar-actions"><div className="sync-status"><span className="pulse-dot" /> Updated just now</div><div className="action-anchor"><button className="circle-button" type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}>♧<span className="notification-dot" /></button>{notificationsOpen && <div className="popover notification-popover"><strong>All caught up</strong><span>No new academic notifications.</span></div>}</div><div className="action-anchor"><button className="avatar mini-avatar" type="button" aria-label="Open profile" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}>NK</button>{profileOpen && <div className="popover profile-popover"><strong>Nikash Kumar</strong><span>Student ID 41162524305</span><button type="button" onClick={() => setProfileOpen(false)}>Close profile</button></div>}</div></div>
			</header>

			<section className="welcome-row"><div><p className="eyebrow accent-eyebrow">ACADEMIC OVERVIEW / 2024-25</p><h2>Good morning, Nikash <span className="wave">✦</span></h2><p className="lede">Here is your academic pulse for the current semester.</p></div><label className="semester-picker"><span>Viewing</span><select value={semester} onChange={(event) => setSemester(event.target.value)}><option>3rd Semester</option><option>2nd Semester</option><option>1st Semester</option></select><span className="select-arrow">⌄</span></label></section>

			<section className="profile-banner"><div className="profile-main"><div className="avatar profile-avatar">NK</div><div className="profile-copy"><div className="profile-name-row"><h3>Nikash</h3><span className="verified">✓ Verified student</span></div><p>Student ID <strong>41162524305</strong><span className="separator">/</span> nikash@college.edu</p><div className="profile-tags"><span>Computer Science Engineering</span><span>Year 3 · {semester}</span></div></div></div><div className="contact-detail"><span>PHONE</span><strong>+91 917 678 7975</strong></div></section>

			<section className="eligibility-banner"><div className="eligibility-icon">✓</div><div><strong>Eligible for Placement</strong><p>Your academic profile meets the current placement criteria.</p></div><div className="criteria"><span><b>CGPA</b> 8.2 <small>/ 7.5 required</small></span><span><b>Attendance</b> 82% <small>/ 75% required</small></span></div><button className="text-button" type="button" aria-expanded={criteriaOpen} onClick={() => setCriteriaOpen((open) => !open)}>View criteria <span>{criteriaOpen ? '↑' : '→'}</span></button></section>
			{criteriaOpen && <section className="detail-panel criteria-panel"><div><strong>Placement criteria</strong><p>You are above the minimum academic and attendance thresholds for campus recruitment.</p></div><div><span>Minimum CGPA</span><b>7.5</b></div><div><span>Minimum attendance</span><b>75%</b></div><div><span>Profile status</span><b className="status-text">Qualified</b></div></section>}

			<section className="metrics-section"><div className="section-heading"><div><p className="eyebrow">YOUR NUMBERS</p><h2>Academic snapshot</h2></div><button className="download-button" type="button" onClick={downloadReport}><Icon>↓</Icon> Download report</button></div><div className="metric-grid">{metrics.map((metric) => <article className={`metric-card ${metric.tone}`} key={metric.label}><div className="metric-icon">{metric.icon}</div><p>{metric.label}</p><strong>{metric.value}</strong><small>{metric.detail}</small></article>)}</div></section>

			<section className="subjects-section"><div className="section-heading"><div><p className="eyebrow">CURRENT ENROLLMENT</p><h2>Enrolled subjects <span className="count-badge">06</span></h2></div><button className="text-button dark" type="button" aria-expanded={transcriptOpen} onClick={() => setTranscriptOpen((open) => !open)}>See full transcript <span>{transcriptOpen ? '↑' : '→'}</span></button></div>{transcriptOpen && <div className="detail-panel transcript-panel"><strong>Transcript summary</strong><span>6 subjects · 18 credits attempted · 8.5 current GPA</span><b>Semester standing: Excellent</b></div>}<div className="subject-grid">{subjects.map((subject) => <article className="subject-card" key={subject.code}><div className="subject-card-top"><span className="subject-code">{subject.code}</span><span className={`grade-pill ${subject.tone}`}>Grade: {subject.grade}</span></div><h3>{subject.name}</h3><p className="teacher">{subject.teacher}</p><div className="attendance-row"><span>Attendance</span><strong>{subject.attendance}%</strong></div><div className="progress-track"><span className={subject.tone} style={{ width: `${subject.attendance}%` }} /></div></article>)}</div></section>
			<footer><span>Studentfolio</span><span>Academic year 2024-25 <i /> All records are up to date</span></footer>
		</main>
	)
}

export default Academic
