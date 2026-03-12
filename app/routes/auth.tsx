import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "Quiddity | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background neon glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#a855f7_0%,_transparent_70%)] opacity-20 pointer-events-none"></div>
      
      <div className="gradient-border relative z-10 shadow-[0_0_50px_#a855f7]">
        <section className="flex flex-col gap-8 bg-[#0a0a0f] rounded-2xl p-10 border border-[#a855f7]/30">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-gradient text-6xl font-bold">Welcome</h1>
            <h2 className="text-gray-300 text-xl">Log In to Continue Your Job Journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="primary-button w-full animate-pulse">
                <span className="relative z-10">Signing you in...</span>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="primary-button w-full"
                    onClick={auth.signOut}
                  >
                    <span className="relative z-10">Log Out</span>
                  </button>
                ) : (
                  <button
                    className="primary-button w-full"
                    onClick={auth.signIn}
                  >
                    <span className="relative z-10">Log In</span>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;