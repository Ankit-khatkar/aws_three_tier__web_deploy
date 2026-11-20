import './App.css'

const stack = [
  { icon: '⚛️', layer: 'Presentation Tier', title: 'React + Nginx', desc: 'A React single-page app built with Vite and served by Nginx, which also proxies /api calls to the backend.' },
  { icon: '🟢', layer: 'Application Tier', title: 'Node.js API', desc: 'A REST API running on Node.js in private subnets. It handles the business logic and is never exposed to the internet directly.' },
  { icon: '🗄️', layer: 'Data Tier', title: 'Amazon RDS', desc: 'A managed relational database in isolated DB subnets, with Multi-AZ failover and automated backups.' },
  { icon: '🌐', layer: 'Networking', title: 'VPC & Subnets', desc: 'A custom VPC spread across two Availability Zones, with public, private app and private DB subnets, plus IGW and NAT routing.' },
  { icon: '⚖️', layer: 'Load Balancing', title: 'Application LB', desc: 'An internet-facing ALB spreads traffic across healthy EC2 instances, with health checks and listener rules.' },
  { icon: '🖥️', layer: 'Compute', title: 'Amazon EC2', desc: 'EC2 instances in Auto Scaling Groups add capacity under load and replace instances that fail.' },
]

const learn = [
  { title: 'VPC', desc: 'Design CIDR ranges, subnets, route tables, Internet and NAT gateways.' },
  { title: 'EC2', desc: 'Launch templates, AMIs, user-data bootstrapping and instance roles.' },
  { title: 'RDS', desc: 'Subnet groups, Multi-AZ, parameter groups and secure connectivity.' },
  { title: 'ALB', desc: 'Target groups, listeners, health checks and path-based routing.' },
  { title: 'Auto Scaling', desc: 'Scaling policies, desired capacity and self-healing fleets.' },
  { title: 'Security Groups', desc: 'Least-privilege rules chained tier to tier: ALB → App → DB.' },
]

const flow = [
  ['User request', 'A browser sends an HTTPS request to the ALB DNS name.'],
  ['ALB routing', 'The ALB forwards the request to a healthy frontend EC2 instance in a public subnet.'],
  ['Nginx proxy', 'Nginx serves the React build and proxies /api to the Node.js tier.'],
  ['Business logic', 'The Node.js API, running in a private subnet, processes the request.'],
  ['Data access', 'The API reads and writes data in RDS through a locked-down security group.'],
]

function App() {
  return (
    <div className="page">
      <header className="nav">
        <a href="#top" className="brand"><span className="logo">3T</span> CloudTier</a>
        <nav>
          <a href="#architecture">Architecture</a>
          <a href="#stack">Tech Stack</a>
          <a href="#flow">Flow</a>
          <a href="#learn">Learn</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="glow" aria-hidden="true" />
        <span className="pill">☁️ AWS Cloud Project</span>
        <h1>A three-tier web app <span className="grad">deployed on AWS</span></h1>
        <p className="lead">
          A production-style deployment of a React frontend, a Node.js backend and an Amazon RDS database.
          The tiers run in a custom VPC behind an Application Load Balancer, with EC2 Auto Scaling.
        </p>
        <div className="cta">
          <a href="#architecture" className="btn primary">View Architecture</a>
          <a href="#learn" className="btn ghost">What You'll Learn</a>
        </div>
        <div className="stats">
          <div><b>3</b><span>Tiers</span></div>
          <div><b>2</b><span>Availability Zones</span></div>
          <div><b>6</b><span>Subnets</span></div>
          <div><b>6</b><span>Core AWS services</span></div>
        </div>
      </section>

      <section id="architecture" className="section">
        <h2>Architecture</h2>
        <p className="sub">How the tiers are layered and isolated inside the VPC.</p>
        <div className="arch">
          <div className="node internet">🌍 Internet / Users</div>
          <div className="arrow">↓</div>
          <div className="vpc">
            <span className="tag">VPC · 10.0.0.0/16</span>
            <div className="node alb">⚖️ Application Load Balancer</div>
            <div className="arrow">↓</div>
            <div className="tier public">
              <span className="tag">Public subnets · AZ-a / AZ-b</span>
              <div className="row"><div className="node">⚛️ EC2 · React + Nginx</div><div className="node">⚛️ EC2 · React + Nginx</div></div>
              <small>Auto Scaling Group</small>
            </div>
            <div className="arrow">↓</div>
            <div className="tier private">
              <span className="tag">Private app subnets</span>
              <div className="row"><div className="node">🟢 EC2 · Node.js API</div><div className="node">🟢 EC2 · Node.js API</div></div>
              <small>Auto Scaling Group · outbound via NAT Gateway</small>
            </div>
            <div className="arrow">↓</div>
            <div className="tier db">
              <span className="tag">Private DB subnets</span>
              <div className="row"><div className="node">🗄️ RDS Primary</div><div className="node dashed">🗄️ RDS Standby</div></div>
              <small>Multi-AZ replication</small>
            </div>
          </div>
        </div>
      </section>

      <section id="stack" className="section">
        <h2>Tech stack</h2>
        <p className="sub">Each layer has a single job and scales on its own.</p>
        <div className="grid">
          {stack.map((s) => (
            <article key={s.title} className="card">
              <div className="icon">{s.icon}</div>
              <span className="layer">{s.layer}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="flow" className="section">
        <h2>Request flow</h2>
        <p className="sub">The path a single request takes, from the browser to the database.</p>
        <ol className="flow">
          {flow.map(([t, d], i) => (
            <li key={t}><span className="num">{i + 1}</span><div><h4>{t}</h4><p>{d}</p></div></li>
          ))}
        </ol>
      </section>

      <section id="learn" className="section">
        <h2>What you'll learn</h2>
        <p className="sub">Hands-on practice with the core AWS building blocks.</p>
        <div className="grid learn">
          {learn.map((l) => (
            <div key={l.title} className="learn-card">
              <span className="check">✓</span>
              <div><h3>{l.title}</h3><p>{l.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Built with React · Node.js · Amazon RDS · deployed on AWS EC2 behind an ALB</p>
        <p className="muted">© {new Date().getFullYear()} CloudTier, an AWS three-tier deployment project</p>
      </footer>
    </div>
  )
}

export default App
