import { useState } from "react";
import { LoginPage } from "@/app/components/login-page";
import { SeatSelectionPage, BookingDetails } from "@/app/components/seat-selection-page";
import { BookingSuccessPage } from "@/app/components/booking-success-page";

type Screen = "login" | "seat-selection" | "success";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const handleLogin = () => {
    setCurrentScreen("seat-selection");
  };

  const handleConfirmBooking = (details: BookingDetails) => {
    setBookingDetails(details);
    setCurrentScreen("success");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("seat-selection");
    setBookingDetails(null);
  };

  const handleLogout = () => {
    setCurrentScreen("login");
    setBookingDetails(null);
  };

  return (
    <div className="w-full min-h-screen">
      {currentScreen === "login" && <LoginPage onLogin={handleLogin} />}
      
      {currentScreen === "seat-selection" && (
        <SeatSelectionPage
          onConfirmBooking={handleConfirmBooking}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === "success" && bookingDetails && (
        <BookingSuccessPage
          bookingDetails={bookingDetails}
          onBackToDashboard={handleBackToDashboard}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
