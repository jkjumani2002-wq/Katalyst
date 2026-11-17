const { useState, useEffect } = React;
const money = n => '$' + n.toLocaleString();

function App() {
  const [d, setD] = useState(null);
  useEffect(() => {  // Node API first; static data.json when hosted on GitHub Pages
    fetch('api/data').then(r => r.ok ? r.json() : Promise.reject())
      .catch(() => fetch('data.json').then(r => r.json())).then(setD);
  }, []);
  if (!d) return <p style={{ padding: '3rem' }}>Loading…</p>;
  return (<>
    <nav><b>The Katalyst</b>
      {['about', 'services', 'bake-freeze', 'team', 'contact'].map(s => <a key={s} href={'#' + s}>{s.replace('-', ' & ')}</a>)}
    </nav>
    <section className="hero">
      <h1>Six specialists. One plan. <em>Results you can measure.</em></h1>
      <p>We help businesses reach their goals with clear findings and a practical plan built from your own numbers, not guesswork.</p>
      <a className="btn" href="#contact">Talk to us</a><a className="btn alt" href="#bake-freeze">Read our Bake &amp; Freeze proposal</a>
    </section>
    <section id="about"><h2>Our story and goals</h2>
      <div className="grid">
        {[['2023', 'The year we were founded, with six members and one clear goal.'], ['6', 'Founders covering finance, people, stock, marketing, research and quality.'], ['2025', 'The year we went global.']]
          .map(([n, t]) => <div className="card stat" key={n}><b>{n}</b>{t}</div>)}
      </div>
      <p>Our goal is to help businesses achieve theirs. Early clients trusted us with their real numbers, and that trust helped us grow. Every client gets one joined-up plan, so one fix never breaks another.</p>
    </section>
    <section id="services"><h2>What we do</h2>
      <div className="grid">{d.services.map(([t, x]) => <div className="card" key={t}><h3>{t}</h3><p>{x}</p></div>)}</div>
    </section>
    <BakeFreeze d={d} />
    <section id="team"><h2>The team</h2>
      <div className="grid">{d.team.map(([n, r]) => <div className="card" key={n}>
        <div className="avatar">{n[0]}</div><h3>{n}</h3><p>{r}</p></div>)}</div>
    </section>
    <Contact />
    <footer>© 2026 The Katalyst · Business consulting</footer>
  </>);
}

function BakeFreeze({ d }) {
  const max = Math.max(...d.budget.map(b => b.amount));
  return (<section id="bake-freeze"><h2>Case study: Bake &amp; Freeze</h2>
    <p>A findings-and-plan review of a Houston appliance retailer: $1.35M yearly revenue, 5 locations, healthy unit margins ($200 to $300) but weak volume and 16 months of stock.</p>
    <div className="grid" style={{ margin: '1.5rem 0' }}>
      {[['-64%', 'Profit fell from a typical $60,000 to a $21,667 monthly average (April–June)'], ['4,895', 'Units in stock, with about 300 sold a month'], ['$24,620', 'Yearly savings target from small cost cuts']]
        .map(([n, t]) => <div className="card stat" key={n}><b>{n}</b>{t}</div>)}
    </div>
    <h3>Store performance</h3>
    <div className="wrap"><table><thead><tr><th>Store</th><th>Sales / month</th><th>Profit / month</th><th>Sales / sq ft</th></tr></thead>
      <tbody>{d.stores.map(s => <tr key={s.name}><td>{s.name}</td><td>{money(s.sales)}</td><td>{money(s.profit)}</td><td>${(s.sales / s.sqft).toFixed(2)}</td></tr>)}</tbody></table></div>
    <h3 style={{ marginTop: '2rem' }}>Where the $150,000 goes</h3>
    {d.budget.map(b => <div key={b.area} style={{ marginBottom: '.8rem' }}>{b.area} <b style={{ float: 'right' }}>{money(b.amount)}</b>
      <div className="bar" style={{ width: (b.amount / max * 100) + '%' }} /></div>)}
    <h3 style={{ marginTop: '2rem' }}>Roadmap</h3>
    {d.roadmap.map(([m, t]) => <div className="tl" key={m}><b>{m}</b> · {t}</div>)}
    <p><i>Targets, not promises: +25% unit sales and $40K monthly profit by month 6, $60K by month 12.</i></p>
  </section>);
}

function Contact() {
  const [f, setF] = useState({ name: '', email: '', message: '' }), [msg, setMsg] = useState('');
  const send = async e => {
    e.preventDefault(); setMsg('Sending…');
    try {
      const r = await fetch('api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      setMsg(r.ok ? 'Thank you! We will reply soon.' : (await r.json()).error || 'Something went wrong.');
      if (r.ok) setF({ name: '', email: '', message: '' });
    } catch { setMsg('The server is offline. Please try again later.'); }
  };
  const on = k => e => setF({ ...f, [k]: e.target.value });
  return (<section id="contact"><h2>Contact us</h2>
    <form onSubmit={send}>
      <input placeholder="Your name" value={f.name} onChange={on('name')} required />
      <input type="email" placeholder="Email" value={f.email} onChange={on('email')} required />
      <textarea rows="4" placeholder="How can we help?" value={f.message} onChange={on('message')} required />
      <button className="btn">Send message</button><span>{msg}</span>
    </form></section>);
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
