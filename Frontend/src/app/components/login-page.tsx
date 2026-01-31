import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  ShieldCheck,
  KeyRound,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import exampleImage from "@/assets/login-preview.png"

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Preview Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-white">
        {/* center the image and size it to match the sign-in card */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="w-full max-w-[90%] lg:min-h-[720px] flex items-center">
            <ImageWithFallback
              src={exampleImage}
              alt="App Preview"
              className="w-full h-full object-cover object-center filter brightness-95 rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* stronger gradient to blend the image smoothly into the form area */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-white/90 pointer-events-none" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md lg:ml-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl"></div>
              <h1 className="text-2xl font-medium text-gray-900">
                Riviera Booking
              </h1>
            </div>
            <h2 className="text-3xl font-medium text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-base text-gray-600">
              Sign in to reserve your cafeteria seat
            </p>
          </div>

          {/* Login Form */}
            <Card className="p-6 rounded-3xl shadow-sm border-gray-100 mb-6 bg-white/95 backdrop-blur-sm lg:min-h-[480px]">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">
                    Remember me
                  </span>
                </label>
                <button className="text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <Button
                onClick={onLogin}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-base font-medium transition-all mt-2"
              >
                Sign in
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500">
              Or continue with
            </span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* SSO Options */}
          <div className="space-y-3">
            <Button
              onClick={onLogin}
              variant="outline"
              className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-base font-medium transition-all"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Continue with W3ID
            </Button>

            <Button
              onClick={onLogin}
              variant="outline"
              className="w-full h-12 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-base font-medium transition-all"
            >
              <KeyRound className="mr-2 h-5 w-5" />
              Sign in with Passkey
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account?{" "}
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Contact IT Support
            </button>
          </p>
        </div>
      </div>

      {/* (image column removed — preview displayed on the left) */}
    </div>
  );
}