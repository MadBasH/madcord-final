const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-full flex items-center justify-center"
      style={{
        background: "url('/background.gif') center center fixed no-repeat",
        backgroundSize: "cover",
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;