import { useMemo, useState } from 'react'
import './App.css'
import './Attendance.css'

const initialMembers = ['Nikash', 'Kanisk', 'Faaiz', 'Kamesh', 'Nishanth', 'Gowtham', 'Gokul', 'Srikanth', 'Dharun', 'Mithun']
const initialAttendance = Object.fromEntries(initialMembers.map((name) => [name, false]))

function App() {
  const [members, setMembers] = useState(initialMembers)
  const [attendance, setAttendance] = useState(initialAttendance)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [newMember, setNewMember] = useState('')

  const presentCount = members.filter((member) => attendance[member]).length
  const absentCount = members.length - presentCount
  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return members.filter((member) => {
      const matchesQuery = member.toLowerCase().includes(normalizedQuery)
      const matchesFilter = filter === 'all' || (filter === 'present' ? attendance[member] : !attendance[member])
      return matchesQuery && matchesFilter
    })
  }, [attendance, filter, members, query])

  function updateMemberStatus(member, isPresent) {
    setAttendance((current) => ({ ...current, [member]: isPresent }))
  }

  function setAllStatuses(isPresent) {
    setAttendance(Object.fromEntries(members.map((member) => [member, isPresent])))
  }

  function resetAttendance() {
    setAttendance(Object.fromEntries(members.map((member) => [member, false])))
  }

  function addMember(event) {
    event.preventDefault()
    const name = newMember.trim().replace(/\s+/g, ' ')
    if (!name || members.some((member) => member.toLowerCase() === name.toLowerCase())) return
    setMembers((current) => [...current, name])
    setAttendance((current) => ({ ...current, [name]: false }))
    setNewMember('')
  }

  return (
    <main className="attendance-app">
      <header className="app-header">
        <div className="brand-lockup"><span className="brand-mark" aria-hidden="true">▤</span><div><p className="eyebrow">Daily register</p><h1>Attendance Tracker</h1></div></div>
        <div className="date-chip"><span aria-hidden="true">◷</span> Today, 24 Sep 2026</div>
      </header>

      <section className="summary-grid" aria-label="Attendance summary">
        <article className="summary-card summary-present"><span className="summary-icon" aria-hidden="true">✓</span><div><p>Present</p><strong>{presentCount}</strong></div><span className="summary-trend">{members.length ? Math.round((presentCount / members.length) * 100) : 0}%</span></article>
        <article className="summary-card summary-absent"><span className="summary-icon" aria-hidden="true">×</span><div><p>Absent</p><strong>{absentCount}</strong></div><span className="summary-trend">{members.length ? Math.round((absentCount / members.length) * 100) : 0}%</span></article>
        <article className="summary-card summary-total"><span className="summary-icon" aria-hidden="true">♟</span><div><p>Total members</p><strong>{members.length}</strong></div><span className="summary-trend">Roster</span></article>
      </section>

      <section className="workspace-panel">
        <div className="toolbar"><div><p className="section-kicker">Live roster</p><h2>Mark today&apos;s attendance</h2></div><div className="bulk-actions"><button className="button button-present" type="button" onClick={() => setAllStatuses(true)}><span>✓</span> Mark all present</button><button className="button button-absent" type="button" onClick={() => setAllStatuses(false)}><span>×</span> Mark all absent</button><button className="button button-reset" type="button" onClick={resetAttendance}><span>↺</span> Reset</button></div></div>
        <div className="filters-row"><label className="search-field"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members..." aria-label="Search members" /></label><div className="filter-tabs" role="tablist" aria-label="Filter members">{['all', 'present', 'absent'].map((option) => <button key={option} className={filter === option ? 'active' : ''} type="button" onClick={() => setFilter(option)} role="tab" aria-selected={filter === option}>{option[0].toUpperCase() + option.slice(1)} <span>{option === 'all' ? members.length : option === 'present' ? presentCount : absentCount}</span></button>)}</div></div>
        <div className="member-grid">{filteredMembers.map((member) => { const isPresent = attendance[member]; return <article className={`member-card ${isPresent ? 'is-present' : 'is-absent'}`} key={member}><div className="member-heading"><span className="member-number">#{String(members.indexOf(member) + 1).padStart(2, '0')}</span><h3>{member}</h3><span className={`status-dot ${isPresent ? 'dot-present' : 'dot-absent'}`} /></div><div className="member-status"><span aria-hidden="true">{isPresent ? '✓' : '×'}</span>{isPresent ? 'Present' : 'Absent'}</div><button type="button" className="member-action" onClick={() => updateMemberStatus(member, !isPresent)}>{isPresent ? 'Mark absent' : 'Mark present'} <span aria-hidden="true">→</span></button></article> })}</div>
        {!filteredMembers.length && <div className="empty-state"><span>⌕</span><h3>No members found</h3><p>Try a different search or filter.</p></div>}
        <form className="add-member" onSubmit={addMember}><span className="add-icon" aria-hidden="true">+</span><input value={newMember} onChange={(event) => setNewMember(event.target.value)} placeholder="Add a new member" aria-label="New member name" /><button type="submit">Add member <span aria-hidden="true">↗</span></button></form>
      </section>
      <footer className="app-footer"><span>Attendance is saved in this session</span><span><i className="live-dot" /> {presentCount} of {members.length} members present</span></footer>
    </main>
  )
}

export default App
