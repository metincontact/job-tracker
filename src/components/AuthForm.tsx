import { useState } from "react";
import { supabase } from "../supabase";
import { Briefcase, Mail, Lock, Loader2 } from "lucide-react";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none tracking-tight">
                Job Tracker
              </h1>
              <p className="text-white/30 text-xs mt-0.5">
                {isLogin ? "Sign in to continue" : "Create your account"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all duration-200 text-white placeholder:text-white/20"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all duration-200 text-white placeholder:text-white/20"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-rose-400/80 text-xs bg-rose-500/[0.07] border border-rose-500/15 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-sm transition-all duration-200 mt-1 shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Please wait…" : isLogin ? "Sign In" : "Sign Up"}
            </button>

            {/* Toggle */}
            <div className="border-t border-white/[0.06] mt-1 pt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-white/30 hover:text-white/60 text-xs transition-colors duration-200"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </button>
            </div>

          </form>
        </div>

        {/* Footer hint */}
        <p className="text-center text-white/10 text-xs mt-6">
          Track every application. Land the role.
        </p>

      </div>
    </div>
  );
}

export default AuthForm;
