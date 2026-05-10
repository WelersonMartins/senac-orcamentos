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
          className="flex-grow-1 p-4"
          style={{ overflowY: "auto", height: "100vh" }}
        >
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
