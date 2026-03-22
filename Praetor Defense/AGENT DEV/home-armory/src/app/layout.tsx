import "./globals.css";

export const metadata = {
  title: "Home Armory System",
  description: "Locally hosted armory and inventory tracker.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 0', marginBottom: '20px', background: 'var(--surface-color)' }}>
          <div className="container" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <strong style={{ color: 'var(--accent-color)', fontSize: '1.2rem', letterSpacing: '1px' }}>PRÆTOR ARMORY</strong>
            <a href="/">Dashboard</a>
            <a href="/nfa">NFA Tracker</a>
            <a href="/firearms">Firearms</a>
            <a href="/ammo">Ammunition</a>
            <a href="/accessories">Accessories</a>
            <a href="/trips">Range Trips</a>
            <a href="/maintenance">Maintenance</a>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
