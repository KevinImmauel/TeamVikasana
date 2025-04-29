export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="">
        {children}
      </div>
      <footer className="bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Centralized Beat Management System
          </p>
        </div>
      </footer>
    </div>
  );
}