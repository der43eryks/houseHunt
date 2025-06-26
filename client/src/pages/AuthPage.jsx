import React, { useState } from "react";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  const TabButton = ({ name, label }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`w-full text-center pb-2 font-semibold transition-colors duration-300
        ${ activeTab === name
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500"
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex mb-8">
          <TabButton name="login" label="Log In" />
          <TabButton name="signup" label="Sign Up" />
          </div>

        <div>
          {activeTab === "login" ? <LoginForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  );
};

const AuthInput = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2">{label}</label>
    <input
      {...props}
      className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const LoginForm = () => (
  <form className="space-y-6">
    <AuthInput
      label="Email"
          type="email"
          placeholder="you@example.com"
        />
    <AuthInput
      label="Password"
      type="password"
          placeholder="••••••••"
        />
    <div className="text-right -mt-2">
        <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
            Forgot password?
      </a>
    </div>
    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
    >
      Log In
    </button>
  </form>
);

const SignUpForm = () => (
  <form className="space-y-6">
    <AuthInput
        label="Full Name"
          type="text"
          placeholder="John Doe"
        />
    <AuthInput
      label="Email"
          type="email"
          placeholder="you@example.com"
        />
    <AuthInput
      label="Password"
      type="password"
          placeholder="••••••••"
        />
    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
    >
      Sign Up
    </button>
  </form>
);

export default AuthPage;
