import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './ReportCard.css'

const semesters = [
	{
		id: 1,
		label: 'Semester 1',
		term: 'Fall 2024',
		courses: [
			{ code: 'CS 201', name: 'Data Structures', marks: 88, credits: 4 },
			{ code: 'MA 203', name: 'Discrete Mathematics', marks: 78, credits: 4 },
			{ code: 'CS 205', name: 'Digital Logic Design', marks: 82, credits: 4 },
			{ code: 'CS 207', name: 'Programming in C', marks: 93, credits: 4 },
			{ code: 'HS 201', name: 'Technical Communication', marks: 77, credits: 4 },
		],
	},
	{
		id: 2,
		label: 'Semester 2',
		term: 'Spring 2025',
		courses: [
			{ code: 'CS 202', name: 'Object-Oriented Programming', marks: 92, credits: 4 },
			{ code: 'MA 204', name: 'Linear Algebra', marks: 86, credits: 4 },
			{ code: 'CS 206', name: 'Computer Organization', marks: 79, credits: 4 },
			{ code: 'CS 208', name: 'Database Systems', marks: 88, credits: 4 },
			{ code: 'ST 202', name: 'Probability & Statistics', marks: 84, credits: 4 },
		],
	},
	{
		id: 3,
		label: 'Semester 3',
		term: 'Fall 2025',
		courses: [
			{ code: 'CS 301', name: 'Operating Systems', marks: 87, credits: 4 },
			{ code: 'CS 303', name: 'Computer Networks', marks: 94, credits: 4 },
			{ code: 'CS 305', name: 'Software Engineering', marks: 89, credits: 4 },
			{ code: 'MA 301', name: 'Numerical Methods', marks: 78, credits: 4 },
			{ code: 'CS 307', name: 'Web Application Development', marks: 86, credits: 4 },
		],
	},
]

const navigation = [
	{ to: '/', label: 'Overview', marker: 'OV' },
	...semesters.map((semester) => ({
		to: `/semester-${semester.id}`,
		label: semester.label,
		marker: `0${semester.id}`,
	})),
	{ to: '/overall', label: 'Overall CGPA', marker: 'CG' },
]

const student = {
	name: 'Aarav Mehta',
	initials: 'AM',
	id: 'STU-240184',
	program: 'B.Tech Computer Science',
	department: 'School of Computing',
	year: 'Year 2 · Section B',
}

function gradeFor(marks) {
	if (marks >= 90) return { grade: 'O', points: 10 }
	if (marks >= 85) return { grade: 'A+', points: 9 }
	if (marks >= 75) return { grade: 'A', points: 8 }
	if (marks >= 70) return { grade: 'B+', points: 7 }
	if (marks >= 60) return { grade: 'B', points: 6 }
	if (marks >= 50) return { grade: 'C', points: 5 }
	return { grade: 'F', points: 0 }
}

function getSemesterStats(semester) {
	const credits = semester.courses.reduce((total, course) => total + course.credits, 0)
	const qualityPoints = semester.courses.reduce(
		(total, course) => total + gradeFor(course.marks).points * course.credits,
		0,
	)

	return { credits, qualityPoints, sgpa: qualityPoints / credits }
}

const totalCredits = semesters.reduce(
	(total, semester) => total + getSemesterStats(semester).credits,
	0,
)
const totalQualityPoints = semesters.reduce(
	(total, semester) => total + getSemesterStats(semester).qualityPoints,
	0,
)
const cgpa = totalQualityPoints / totalCredits
const formatGpa = (value) => value.toFixed(2)

function Metric({ label, value, detail }) {
	return (
		<div className="metric">
			<span className="metric-label">{label}</span>
			<strong className="metric-value">{value}</strong>
			<span className="metric-detail">{detail}</span>
		</div>
	)
}

function GradeTable({ semester }) {
	return (
		<div className="table-scroll">
			<table className="grade-table">
				<thead>
					<tr>
						<th>Course</th>
						<th>Marks</th>
						<th>Grade</th>
						<th>Credits</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{semester.courses.map((course) => {
						const result = gradeFor(course.marks)

						return (
							<tr key={course.code}>
								<td>
									<span className="course-name">{course.name}</span>
									<span className="course-code">{course.code}</span>
								</td>
								<td>{course.marks}<span className="mark-total"> / 100</span></td>
								<td><span className={`grade-pill grade-${result.grade.replace('+', 'plus')}`}>{result.grade}</span></td>
								<td>{course.credits}</td>
								<td>{result.points.toFixed(1)}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}

function OverviewPage() {
	const latestSemester = semesters.at(-1)
	const completedCourses = semesters.reduce((total, semester) => total + semester.courses.length, 0)

	return (
		<div className="page-content">
			<div className="welcome-line">
				<div>
					<p className="eyebrow">STUDENT RECORD · 2024—25</p>
					<h2>Good progress, Aarav.</h2>
					<p className="page-description">Your academic record across the first three semesters.</p>
				</div>
				<span className="standing"><span className="standing-dot" /> Excellent standing</span>
			</div>

			<section className="overview-hero" aria-label="Cumulative grade point average">
				<div className="hero-copy">
					<span className="hero-kicker">CUMULATIVE PERFORMANCE</span>
					<div className="hero-score">{formatGpa(cgpa)}<span> / 10</span></div>
					<p>Overall CGPA <span className="hero-separator">·</span> updated after {latestSemester.label}</p>
					<div className="hero-progress"><span style={{ width: `${cgpa * 10}%` }} /></div>
					<span className="hero-footnote">{totalCredits} credits completed</span>
				</div>
				<div className="hero-mark" aria-hidden="true"><span>AM</span><i /><i /><i /><i /><i /></div>
				<div className="hero-index">ACADEMIC<br />TRANSCRIPT <span>NO. 024</span></div>
			</section>

			<section className="metric-grid" aria-label="Academic totals">
				<Metric label="Credits earned" value={totalCredits} detail="of 160 program credits" />
				<Metric label="Courses completed" value={completedCourses} detail="across 3 semesters" />
				<Metric label="Latest SGPA" value={formatGpa(getSemesterStats(latestSemester).sgpa)} detail={latestSemester.term} />
			</section>

			<section className="section-block">
				<div className="section-heading">
					<div><p className="eyebrow">THE JOURNEY</p><h3>Semester results</h3></div>
					<span className="section-aside">SGPA · scale of 10</span>
				</div>
				<div className="semester-list">
					{semesters.map((semester, index) => {
						const stats = getSemesterStats(semester)

						return (
							<NavLink className="semester-row" key={semester.id} to={`/semester-${semester.id}`}>
								<span className="semester-number">0{semester.id}</span>
								<span className="semester-info"><strong>{semester.label}</strong><small>{semester.term} · {stats.credits} credits</small></span>
								<span className="semester-bar"><i style={{ width: `${stats.sgpa * 10}%` }} /></span>
								<strong className="semester-gpa">{formatGpa(stats.sgpa)}</strong>
								<span className={`trend-tag ${index === 0 ? 'trend-first' : ''}`}>{index === 0 ? 'BASELINE' : 'COMPLETED'}</span>
								<span className="row-arrow" aria-hidden="true">↗</span>
							</NavLink>
						)
					})}
				</div>
			</section>
		</div>
	)
}

function SemesterPage({ semester }) {
	const stats = getSemesterStats(semester)
	const excellentCount = semester.courses.filter((course) => gradeFor(course.marks).points >= 9).length

	return (
		<div className="page-content">
			<div className="welcome-line semester-welcome">
				<div>
					<p className="eyebrow">ACADEMIC RECORD · {semester.term.toUpperCase()}</p>
					<h2>{semester.label}</h2>
					<p className="page-description">Official course results and grade points for this term.</p>
				</div>
				<span className="term-stamp">2024—25 <span>●</span> FINAL</span>
			</div>

			<section className="semester-summary">
				<div className="semester-summary-main">
					<span className="summary-label">SEMESTER GRADE POINT AVERAGE</span>
					<strong>{formatGpa(stats.sgpa)}<span> / 10</span></strong>
					<p>Based on {stats.credits} earned credits</p>
				</div>
				<div className="summary-side">
					<span>GRADE DISTRIBUTION</span>
					<div className="distribution-bar" aria-label={`${excellentCount} excellent grades and ${semester.courses.length - excellentCount} other grades`}>
						{semester.courses.map((course) => {
							const isExcellent = gradeFor(course.marks).points >= 9
							return <i key={course.code} className={isExcellent ? 'distribution-excellent' : ''} />
						})}
					</div>
					<p><b>{excellentCount}</b> grades of 9 points or above</p>
				</div>
			</section>

			<section className="section-block results-block">
				<div className="section-heading">
					<div><p className="eyebrow">MARKSHEET</p><h3>Course results</h3></div>
					<span className="section-aside">{semester.courses.length} courses · {stats.credits} credits</span>
				</div>
				<GradeTable semester={semester} />
				<div className="table-footnote"><span>Passing grade: C (50 marks)</span><span>Grade points are credit weighted</span></div>
			</section>
		</div>
	)
}

function OverallPage() {
	return (
		<div className="page-content">
			<div className="welcome-line">
				<div>
					<p className="eyebrow">CUMULATIVE ACADEMIC RECORD</p>
					<h2>Overall CGPA</h2>
					<p className="page-description">A credit-weighted view of your academic performance.</p>
				</div>
				<span className="standing"><span className="standing-dot" /> In good standing</span>
			</div>

			<section className="cgpa-feature">
				<div className="cgpa-score-block">
					<span className="summary-label">CUMULATIVE GPA</span>
					<strong>{formatGpa(cgpa)}<span> / 10</span></strong>
					<p>Across {totalCredits} earned credits</p>
				</div>
				<div className="cgpa-scale">
					<div className="scale-labels"><span>0.00</span><span>10.00</span></div>
					<div className="hero-progress"><span style={{ width: `${cgpa * 10}%` }} /></div>
					<div className="scale-caption"><span>Academic scale</span><b>{Math.round(cgpa * 10)}th percentile of scale</b></div>
				</div>
			</section>

			<section className="section-block overall-breakdown">
				<div className="section-heading">
					<div><p className="eyebrow">WEIGHTED RESULTS</p><h3>Term-by-term breakdown</h3></div>
					<span className="section-aside">CGPA recalculated by earned credits</span>
				</div>
				<div className="table-scroll">
					<table className="grade-table breakdown-table">
						<thead><tr><th>Semester</th><th>Term</th><th>Credits</th><th>SGPA</th><th>Quality points</th></tr></thead>
						<tbody>
							{semesters.map((semester) => {
								const stats = getSemesterStats(semester)

								return (
									<tr key={semester.id}>
										<td><NavLink className="breakdown-link" to={`/semester-${semester.id}`}>{semester.label} <span>↗</span></NavLink></td>
										<td>{semester.term}</td>
										<td>{stats.credits}</td>
										<td><strong>{formatGpa(stats.sgpa)}</strong></td>
										<td>{stats.qualityPoints.toFixed(1)}</td>
									</tr>
								)
							})}
						</tbody>
						<tfoot><tr><td colSpan="2">Cumulative total</td><td>{totalCredits}</td><td><strong>{formatGpa(cgpa)}</strong></td><td>{totalQualityPoints.toFixed(1)}</td></tr></tfoot>
					</table>
				</div>
				<p className="calculation-note">CGPA = total quality points ÷ total earned credits. Each course contributes according to its credit value.</p>
			</section>
		</div>
	)
}

function ReportCard() {
	const { pathname } = useLocation()
	const currentItem = navigation.find((item) => item.to === pathname) ?? navigation[0]

	return (
		<div className="report-layout">
			<aside className="sidebar">
				<a className="school-brand" href="/" aria-label="Northfield University home">
					<span className="brand-seal">N<span>U</span></span>
					<span className="brand-name">NORTHFIELD<small>UNIVERSITY</small></span>
				</a>
				<div className="sidebar-caption">STUDENT PORTAL</div>
				<nav className="side-nav" aria-label="Report card pages">
					{navigation.map((item) => (
						<NavLink className={({ isActive }) => `nav-item${isActive ? ' nav-item-active' : ''}`} end={item.to === '/'} key={item.to} to={item.to}>
							<span className="nav-marker">{item.marker}</span>
							<span>{item.label}</span>
							{item.to === pathname && <span className="nav-indicator" />}
						</NavLink>
					))}
				</nav>
				<div className="sidebar-bottom">
					<div className="sidebar-divider" />
					<span className="sidebar-caption">CURRENT PROGRAM</span>
					<strong>{student.program}</strong>
					<span className="sidebar-year">Academic year 2024—25</span>
					<div className="sidebar-user"><span className="user-avatar">{student.initials}</span><span><strong>{student.name}</strong><small>{student.id}</small></span></div>
				</div>
			</aside>

			<main className="main-panel">
				<header className="topbar">
					<div className="breadcrumb"><span>RECORDS</span><b>/</b>{currentItem.label.toUpperCase()}</div>
					<div className="topbar-actions">
						<button className="print-button" onClick={() => window.print()} type="button"><span aria-hidden="true">↓</span> Print report</button>
						<span className="topbar-avatar" aria-label={student.name}>{student.initials}</span>
					</div>
				</header>
				<div className="main-content">
					<Routes>
						<Route element={<OverviewPage />} path="/" />
						{semesters.map((semester) => <Route element={<SemesterPage semester={semester} />} key={semester.id} path={`/semester-${semester.id}`} />)}
						<Route element={<OverallPage />} path="/overall" />
						<Route element={<Navigate replace to="/" />} path="*" />
					</Routes>
					<footer className="page-footer"><span>{student.department} · {student.id}</span><span>OFFICIAL ACADEMIC RECORD <i>●</i> 2024—25</span></footer>
				</div>
			</main>
		</div>
	)
}

export default ReportCard
