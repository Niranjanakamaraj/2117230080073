import PriorityInbox from '../components/PriorityInbox';

export default function Home() {
  return (
    <main className="main-container">
      <header className="app-header">
        <h1>Campus Notifications Platform</h1>
      </header>
      <section className="dashboard-content">
        <PriorityInbox />
      </section>
    </main>
  );
}
