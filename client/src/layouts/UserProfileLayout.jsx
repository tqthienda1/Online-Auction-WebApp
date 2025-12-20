import Header from "../components/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-brand">
        <Header />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;
