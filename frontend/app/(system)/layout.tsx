import Header from "../../components/Header";
import Navegacao from "../../components/Navegacao";
import Footer from "../../components/Footer";

export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="d-flex">
        <Navegacao />
        <main
          className="flex-grow-1 p-3 p-md-4 bg-body-secondary"
          style={{ overflowY: "auto", height: "100vh" }}
        >
          <div className="rounded-4 bg-white shadow-sm p-3 p-md-4">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
