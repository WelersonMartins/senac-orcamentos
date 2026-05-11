import Header from "../../components/Header";
import Navegacao from "../../components/Navegacao";
import Footer from "../../components/Footer";

export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-system-shell">
      <Header />
      <div className="app-system-body">
        <Navegacao />
        <main className="app-system-main">
          <div className="app-system-content">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
