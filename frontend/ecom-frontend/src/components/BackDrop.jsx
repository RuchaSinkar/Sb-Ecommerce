const BackDrop = ({ isNavbarOpen }) => {
  return (
    <div
      className={`fixed left-0 w-screen h-screen bg-slate-300 opacity-50 z-20 transition-all duration-200 ${
        isNavbarOpen ? "top-16" : "top-0"
      }`}
    />
  );
};

export default BackDrop;