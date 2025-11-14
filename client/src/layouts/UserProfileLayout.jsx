import Header from "../components/Header";

const MainLayout = ({ children }) => {
  return (
    <div>
      <div className="border-b border-brand">
        <Header />
      </div>
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
