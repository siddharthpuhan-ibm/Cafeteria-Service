import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  ShieldCheck,
  KeyRound,
  ArrowRight,
  X,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import rivieraImage from "@/assets/riviera-preview.png";
import { authAPI } from "@/services/api";

interface LoginPageProps {
  onLogin: () => void;
}

interface Manager {
  name: string;
  balance: number;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    // Fetch managers when modal opens
    if (showManagerModal) {
      authAPI.getManagers()
        .then(setManagers)
        .catch((error) => {
          console.error("Failed to fetch managers:", error);
        });
    }
  }, [showManagerModal]);

  const handleW3IDLogin = () => {
    // Show manager selection modal
    setShowManagerModal(true);
  };

  const handleManagerLogin = () => {
    if (!selectedManager) {
      alert("Please select a manager");
      return;
    }
    
    // If admin is selected but no employee ID is set, set default
    if (selectedManager === 'Admin' && !employeeId) {
      setEmployeeId('admin001');
    }
    
    if (!employeeId) {
      alert("Please select an employee ID");
      return;
    }
    
    // Redirect to backend with manager and employee ID
    const loginUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/auth/login?manager_name=${encodeURIComponent(selectedManager)}&employee_id=${encodeURIComponent(employeeId)}`;
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Preview Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-white">
        {/* center the image and size it to match the sign-in card */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="w-full max-w-[90%] lg:min-h-[720px] flex items-center">
            <ImageWithFallback
              src={rivieraImage}
              alt="Riviera IBM Cafeteria"
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
              onClick={handleW3IDLogin}
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

      {/* Manager Selection Modal */}
      {showManagerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 rounded-3xl shadow-lg max-w-md w-full mx-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-900">Select Manager & Employee ID</h2>
              <button
                onClick={() => setShowManagerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Select Manager
                </label>
                <select
                  value={selectedManager}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setSelectedManager(selectedValue);
                    // If admin is selected, set a default employee ID
                    if (selectedValue === 'Admin') {
                      setEmployeeId('admin001');
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="">-- Select Manager --</option>
                  {managers.map((manager) => (
                    <option key={manager.name} value={manager.name}>
                      {manager.name} ({manager.balance.toLocaleString()} Blu-Points)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-700 mb-2 block">
                  Employee ID
                </label>
                {selectedManager === 'Admin' ? (
                  <input
                    type="text"
                    value="admin001"
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 outline-none"
                  />
                ) : (
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">-- Select Employee ID --</option>
                    <option value="emp001">Employee 001</option>
                    <option value="emp002">Employee 002</option>
                    <option value="emp003">Employee 003</option>
                    <option value="emp004">Employee 004</option>
                    <option value="emp005">Employee 005</option>
                    <option value="emp006">Employee 006</option>
                    <option value="emp007">Employee 007</option>
                    <option value="emp008">Employee 008</option>
                    <option value="emp009">Employee 009</option>
                    <option value="emp010">Employee 010</option>
                  </select>
                )}
              </div>
              
              <Button
                onClick={handleManagerLogin}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-base font-medium transition-all"
              >
                Login
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}