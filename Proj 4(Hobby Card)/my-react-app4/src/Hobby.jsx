import { useMemo, useState } from 'react'
import './Hobby.css'

const hobbies = [
	{
		id: 1,
		title: 'Photography',
		category: 'Arts & Media',
		level: 'Beginner',
		icon: 'camera',
		description: 'Capture light, movement, and the small stories hiding in plain sight.',
		image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85',
		accent: '#ef8354',
	},
	{
		id: 2,
		title: 'Playing Guitar',
		category: 'Music',
		level: 'Intermediate',
		icon: 'music',
		description: 'Find your rhythm, learn favourite songs, and make some noise together.',
		image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=900&q=85',
		accent: '#e1ad01',
	},
	{
		id: 3,
		title: 'Painting',
		category: 'Visual Arts',
		level: 'Beginner',
		icon: 'palette',
		description: 'Experiment with colour and texture until a blank canvas feels alive.',
		image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85',
		accent: '#4ea699',
	},
	{
		id: 7,
		title: 'Music',
		category: 'Music',
		level: 'All levels',
		icon: 'music',
		description: 'Share playlists, discover new artists, and let a good song change the day.',
		image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85',
		accent: '#d48b5c',
	},
	{
		id: 8,
		title: 'Gaming',
		category: 'Gaming & Esports',
		level: 'All levels',
		icon: 'game',
		description: 'Play competitively, team up with friends, and find your next favourite world.',
		image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85',
		accent: '#8064c9',
	},
	{
		id: 9,
		title: 'Football',
		category: 'Sports & Fitness',
		level: 'All levels',
		icon: 'football',
		description: 'Get outside, sharpen your footwork, and enjoy the beautiful game together.',
		image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=85',
		accent: '#3c8a63',
	},
	{
		id: 10,
		title: 'Design',
		category: 'Creative Practice',
		level: 'Beginner',
		icon: 'design',
		description: 'Shape ideas into thoughtful visuals, interfaces, and things people love to use.',
		image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=85',
		accent: '#c85c78',
	},
	{
		id: 4,
		title: 'Urban Gardening',
		category: 'Outdoors',
		level: 'Beginner',
		icon: 'leaf',
		description: 'Grow something green, even when your only garden is a windowsill.',
		image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=85',
		accent: '#6c9a8b',
	},
	{
		id: 5,
		title: 'Street Dance',
		category: 'Sports & Fitness',
		level: 'Intermediate',
		icon: 'spark',
		description: 'Build confidence, coordination, and community one beat at a time.',
		image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=85',
		accent: '#c8553d',
	},
	{
		id: 6,
		title: 'Game Design',
		category: 'Gaming & Esports',
		level: 'Advanced',
		icon: 'game',
		description: 'Turn your wildest ideas into playable worlds and unforgettable quests.',
		image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=85',
		accent: '#7b61ff',
	},
]

const categories = ['All interests', ...new Set(hobbies.map((hobby) => hobby.category))]

function Hobby() {
	const [activeCategory, setActiveCategory] = useState('All interests')
	const [query, setQuery] = useState('')
	const [favorites, setFavorites] = useState([])

	const visibleHobbies = useMemo(() => hobbies.filter((hobby) => {
		const matchesCategory = activeCategory === 'All interests' || hobby.category === activeCategory
		const searchText = `${hobby.title} ${hobby.category} ${hobby.description}`.toLowerCase()
		return matchesCategory && searchText.includes(query.toLowerCase())
	}), [activeCategory, query])

	const toggleFavorite = (id) => {
		setFavorites((current) => current.includes(id)
			? current.filter((favoriteId) => favoriteId !== id)
			: [...current, id])
	}

	return (
		<main className="hobby-page">
			<nav className="topbar" aria-label="Main navigation">
				<a className="brand" href="#top" aria-label="Hobby Hub home">
					<span className="brand-mark">H</span>
					<span>Hobby<span className="brand-accent">Hub</span></span>
				</a>
				<div className="nav-links">
					<a className="active" href="#explore">Explore</a>
					<a href="#community">Community</a>
					<a href="#about">About us</a>
				</div>
				<button className="profile-button" type="button" aria-label="Open profile menu">
					<span className="avatar">AM</span>
					<span className="profile-name">Alex Morgan</span>
					<span aria-hidden="true">⌄</span>
				</button>
			</nav>

			<section className="intro" id="top">
				<div className="eyebrow"><span className="eyebrow-line" /> STUDENT LIFE / 2024 <span className="eyebrow-line" /></div>
				<h1>Make room for<br /><em>what moves you.</em></h1>
				<p>Explore the interests, talents, and creative energy<br className="desktop-only" /> that make our student community one of a kind.</p>
				<a className="scroll-cue" href="#explore">Scroll to explore <span>↓</span></a>
			</section>

			<section className="explore-section" id="explore">
				<div className="section-heading">
					<div>
						<p className="section-kicker">DISCOVER YOUR NEXT OBSESSION</p>
						<h2>Find your people.<br /><span>Follow your curiosity.</span></h2>
					</div>
					<div className="heading-side"><span className="big-number">{String(visibleHobbies.length).padStart(2, '0')}</span><span>interests<br />to explore</span></div>
				</div>

				<div className="toolbar">
					<div className="filters" role="tablist" aria-label="Filter hobbies">
						{categories.map((category) => (
							<button className={activeCategory === category ? 'filter active' : 'filter'} key={category} type="button" onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>
								{category}
							</button>
						))}
					</div>
					<label className="search-box">
						<span aria-hidden="true">⌕</span>
						<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search interests" aria-label="Search interests" />
					</label>
				</div>

				<div className="hobby-grid">
					{visibleHobbies.map((hobby, index) => (
						<article className={`hobby-card ${index === 0 ? 'featured' : ''}`} key={hobby.id} style={{ '--card-accent': hobby.accent }}>
							<div className="card-image-wrap">
								<img src={hobby.image} alt={`${hobby.title} hobby`} className="card-image" />
								<span className="card-index">0{index + 1}</span>
								<button className={favorites.includes(hobby.id) ? 'favorite saved' : 'favorite'} type="button" onClick={() => toggleFavorite(hobby.id)} aria-label={`${favorites.includes(hobby.id) ? 'Remove' : 'Add'} ${hobby.title} ${favorites.includes(hobby.id) ? 'from' : 'to'} favorites`}>
									{favorites.includes(hobby.id) ? '♥' : '♡'}
								</button>
							</div>
							<div className="card-content">
								<div className="card-meta"><span className="category-icon" aria-hidden="true">{hobby.icon === 'camera' ? '◉' : hobby.icon === 'music' ? '♫' : hobby.icon === 'palette' ? '◌' : hobby.icon === 'leaf' ? '⌁' : hobby.icon === 'spark' ? '✦' : hobby.icon === 'football' ? '⚽' : hobby.icon === 'design' ? '✎' : '▣'}</span>{hobby.category}<span className="dot" />{hobby.level}</div>
								<h3>{hobby.title}</h3>
								<p>{hobby.description}</p>
								<button className="explore-link" type="button">Explore interest <span>↗</span></button>
							</div>
						</article>
					))}
				</div>
				{visibleHobbies.length === 0 && <p className="empty-state">No interests match that search yet. Try a different word.</p>}
			</section>

			<footer id="community"><span>HOBBY<span className="brand-accent">HUB</span></span><span>Made for curious minds · {favorites.length} saved</span></footer>
		</main>
	)
}

export default Hobby
