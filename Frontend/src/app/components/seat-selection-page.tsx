// import { useState } from "react";
// import { Button } from "@/app/components/ui/button";
// import { Card } from "@/app/components/ui/card";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   Clock,
//   User,
// } from "lucide-react";

// interface SeatSelectionPageProps {
//   onConfirmBooking: (bookingDetails: BookingDetails) => void;
//   onLogout: () => void;
// }

// export interface BookingDetails {
//   seats: number[];
//   timeSlot: string;
//   quantity: number;
//   totalCost: number;
//   date: string;
// }

// type SeatStatus = "available" | "booked" | "selected";

// interface Seat {
//   id: number;
//   status: SeatStatus;
//   tableNumber: number;
// }

// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];
// const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// export function SeatSelectionPage({
//   onConfirmBooking,
//   onLogout,
// }: SeatSelectionPageProps) {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState<Date | null>(
//     null,
//   );
//   const [selectedHour, setSelectedHour] = useState("12");
//   const [selectedMinute, setSelectedMinute] = useState("00");
//   const [selectedPeriod, setSelectedPeriod] = useState<
//     "AM" | "PM"
//   >("PM");

//   // Initialize seats in a simple grid (10 rows x 10 columns = 100 seats)
//   const [seats, setSeats] = useState<Seat[]>(() => {
//     const allSeats: Seat[] = [];
//     let seatId = 1;

//     // 20 tables, 5 seats per table
//     for (let table = 1; table <= 20; table++) {
//       for (let seat = 1; seat <= 5; seat++) {
//         allSeats.push({
//           id: seatId,
//           status: Math.random() > 0.7 ? "booked" : "available",
//           tableNumber: table,
//         });
//         seatId++;
//       }
//     }

//     return allSeats;
//   });

//   const selectedSeats = seats.filter(
//     (s) => s.status === "selected",
//   );

//   const handleSeatClick = (seatId: number) => {
//     setSeats((prevSeats) =>
//       prevSeats.map((seat) => {
//         if (seat.id === seatId && seat.status !== "booked") {
//           return {
//             ...seat,
//             status:
//               seat.status === "selected"
//                 ? "available"
//                 : "selected",
//           };
//         }
//         return seat;
//       }),
//     );
//   };

//   const getDaysInMonth = (date: Date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     return { daysInMonth, startingDayOfWeek };
//   };

//   const { daysInMonth, startingDayOfWeek } =
//     getDaysInMonth(currentDate);

//   const handlePrevMonth = () => {
//     setCurrentDate(
//       new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth() - 1,
//         1,
//       ),
//     );
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(
//       new Date(
//         currentDate.getFullYear(),
//         currentDate.getMonth() + 1,
//         1,
//       ),
//     );
//   };

//   const handleDateClick = (day: number) => {
//     const date = new Date(
//       currentDate.getFullYear(),
//       currentDate.getMonth(),
//       day,
//     );
//     setSelectedDate(date);
//   };

//   const isDateSelected = (day: number) => {
//     if (!selectedDate) return false;
//     return (
//       selectedDate.getDate() === day &&
//       selectedDate.getMonth() === currentDate.getMonth() &&
//       selectedDate.getFullYear() === currentDate.getFullYear()
//     );
//   };

//   const handleConfirm = () => {
//     if (selectedSeats.length === 0 || !selectedDate) return;

//     const dateStr = selectedDate.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });

//     onConfirmBooking({
//       seats: selectedSeats.map((s) => s.id),
//       timeSlot: `${selectedHour}:${selectedMinute} ${selectedPeriod}`,
//       quantity: selectedSeats.length,
//       totalCost: selectedSeats.length,
//       date: dateStr,
//     });
//   };

//   // Group seats by table
//   const tables = Array.from({ length: 20 }, (_, i) => {
//     const tableNumber = i + 1;
//     return seats.filter((s) => s.tableNumber === tableNumber);
//   });

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
//             <h1 className="text-xl font-medium text-gray-900">
//               Riviera Booking
//             </h1>
//           </div>
//           <Button
//             onClick={onLogout}
//             variant="ghost"
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <User className="mr-2 h-4 w-4" />
//             Logout
//           </Button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Left Column - Date & Time Selection */}
//           <div className="space-y-6">
//             {/* Booking Table Card */}
//             <Card className="p-6 rounded-3xl shadow-sm border-gray-100">
//               <h2 className="text-lg font-medium text-gray-900 mb-6">
//                 Booking table
//               </h2>

//               {/* Date Section */}
//               <div className="mb-6">
//                 <label className="text-sm text-gray-600 mb-3 block">
//                   Date
//                 </label>

//                 {/* Month Navigation */}
//                 <div className="flex items-center justify-between mb-4">
//                   <button
//                     onClick={handlePrevMonth}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ChevronLeft className="h-5 w-5 text-gray-600" />
//                   </button>
//                   <span className="text-base font-medium text-gray-900">
//                     {MONTHS[currentDate.getMonth()]}{" "}
//                     {currentDate.getFullYear()}
//                   </span>
//                   <button
//                     onClick={handleNextMonth}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   >
//                     <ChevronRight className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </div>

//                 {/* Calendar Grid */}
//                 <div className="grid grid-cols-7 gap-2">
//                   {/* Day Headers */}
//                   {DAYS.map((day) => (
//                     <div
//                       key={day}
//                       className="text-center text-xs text-gray-500 pb-2"
//                     >
//                       {day}
//                     </div>
//                   ))}

//                   {/* Empty cells for days before month starts */}
//                   {Array.from({
//                     length: startingDayOfWeek,
//                   }).map((_, i) => (
//                     <div
//                       key={`empty-${i}`}
//                       className="aspect-square"
//                     ></div>
//                   ))}

//                   {/* Days of the month */}
//                   {Array.from({ length: daysInMonth }).map(
//                     (_, i) => {
//                       const day = i + 1;
//                       const selected = isDateSelected(day);
//                       return (
//                         <button
//                           key={day}
//                           onClick={() => handleDateClick(day)}
//                           className={`aspect-square rounded-xl text-sm font-medium transition-all ${
//                             selected
//                               ? "bg-blue-600 text-white shadow-md"
//                               : "text-gray-700 hover:bg-gray-100"
//                           }`}
//                         >
//                           {day}
//                         </button>
//                       );
//                     },
//                   )}
//                 </div>
//               </div>

//               {/* Time Section */}
//               <div>
//                 <label className="text-sm text-gray-600 mb-3 block">
//                   Enter time
//                 </label>
//                 <div className="flex items-center gap-3">
//                   <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
//                     <input
//                       type="text"
//                       value={selectedHour}
//                       onChange={(e) => {
//                         const val = e.target.value.replace(
//                           /\D/g,
//                           "",
//                         );
//                         if (
//                           val === "" ||
//                           (parseInt(val) >= 1 &&
//                             parseInt(val) <= 12)
//                         ) {
//                           setSelectedHour(val);
//                         }
//                       }}
//                       className="w-12 bg-transparent text-center text-2xl font-medium text-gray-900 outline-none"
//                       maxLength={2}
//                     />
//                     <span className="text-2xl text-gray-400">
//                       :
//                     </span>
//                     <input
//                       type="text"
//                       value={selectedMinute}
//                       onChange={(e) => {
//                         const val = e.target.value.replace(
//                           /\D/g,
//                           "",
//                         );
//                         if (
//                           val === "" ||
//                           (parseInt(val) >= 0 &&
//                             parseInt(val) <= 59)
//                         ) {
//                           setSelectedMinute(
//                             val.padStart(2, "0"),
//                           );
//                         }
//                       }}
//                       className="w-12 bg-transparent text-center text-2xl font-medium text-gray-900 outline-none"
//                       maxLength={2}
//                     />
//                   </div>
//                   <div className="flex gap-1 bg-gray-50 rounded-xl p-1">
//                     <button
//                       onClick={() => setSelectedPeriod("AM")}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                         selectedPeriod === "AM"
//                           ? "bg-blue-600 text-white shadow-sm"
//                           : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       AM
//                     </button>
//                     <button
//                       onClick={() => setSelectedPeriod("PM")}
//                       className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                         selectedPeriod === "PM"
//                           ? "bg-blue-600 text-white shadow-sm"
//                           : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       PM
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Confirm Button */}
//               <Button
//                 onClick={handleConfirm}
//                 disabled={
//                   selectedSeats.length === 0 || !selectedDate
//                 }
//                 className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 Proceed ({selectedSeats.length}{" "}
//                 {selectedSeats.length === 1 ? "seat" : "seats"})
//               </Button>
//             </Card>

//             {/* Selected Date & Time Display */}
//             {selectedDate && (
//               <Card className="p-5 rounded-2xl shadow-sm border-gray-100 bg-blue-50">
//                 <div className="flex items-start gap-4">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <Calendar className="h-5 w-5 text-blue-600" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-600 mb-1">
//                       Selected booking
//                     </p>
//                     <p className="text-base font-medium text-gray-900">
//                       {selectedDate.toLocaleDateString(
//                         "en-US",
//                         {
//                           weekday: "long",
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         },
//                       )}
//                     </p>
//                     <p className="text-sm text-gray-600 mt-1">
//                       <Clock className="inline h-3.5 w-3.5 mr-1" />
//                       {selectedHour}:{selectedMinute}{" "}
//                       {selectedPeriod}
//                     </p>
//                   </div>
//                 </div>
//               </Card>
//             )}
//           </div>

//           {/* Right Column - Table Selection */}
//           <div>
//             <Card className="p-6 rounded-3xl shadow-sm border-gray-100">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">
//                 Choose table
//               </h2>
//               <p className="text-sm text-gray-600 mb-6">
//                 Select your preferred seats
//               </p>

//               {/* Legend */}
//               <div className="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200"></div>
//                   <span className="text-xs text-gray-600">
//                     Available
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
//                   <span className="text-xs text-gray-600">
//                     Booked
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-lg bg-blue-600"></div>
//                   <span className="text-xs text-gray-600">
//                     Selected
//                   </span>
//                 </div>
//               </div>

//               {/* Tables Grid - 4 columns x 5 rows */}
//               <div className="grid grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
//                 {tables.map((tableSeats, tableIndex) => {
//                   const tableNumber = tableIndex + 1;
//                   const hasSelectedSeat = tableSeats.some(
//                     (s) => s.status === "selected",
//                   );

//                   return (
//                     <div
//                       key={tableNumber}
//                       className={`p-3 rounded-2xl border-2 transition-all ${
//                         hasSelectedSeat
//                           ? "border-blue-600 bg-blue-50"
//                           : "border-gray-100 bg-white hover:border-gray-200"
//                       }`}
//                     >
//                       <div className="text-xs font-medium text-gray-500 mb-2 text-center">
//                         Table {tableNumber}
//                       </div>
//                       <div className="grid grid-cols-2 gap-1.5">
//                         {tableSeats.map((seat) => (
//                           <button
//                             key={seat.id}
//                             onClick={() =>
//                               handleSeatClick(seat.id)
//                             }
//                             disabled={seat.status === "booked"}
//                             className={`aspect-square rounded-lg text-xs font-medium transition-all ${
//                               seat.status === "selected"
//                                 ? "bg-blue-600 text-white shadow-md scale-105"
//                                 : seat.status === "booked"
//                                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                                   : "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
//                             }`}
//                           >
//                             {seat.id}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { Button } from "@/app/components/ui/button";
// import { Card } from "@/app/components/ui/card";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Calendar,
//   Clock,
//   User,
// } from "lucide-react";

// interface SeatSelectionPageProps {
//   onConfirmBooking: (bookingDetails: BookingDetails) => void;
//   onLogout: () => void;
// }

// export interface BookingDetails {
//   seats: number[];
//   timeSlot: string;
//   quantity: number;
//   totalCost: number;
//   date: string;
// }

// type SeatStatus = "available" | "booked" | "selected";

// interface Seat {
//   id: number;
//   status: SeatStatus;
//   tableNumber: number;
// }

// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// /* 🔥 Generate 30-minute start–end slots */
// const generateTimeSlots = (
//   startHour = 9,
//   endHour = 21,
// ): string[] => {
//   const slots: string[] = [];

//   for (let h = startHour; h < endHour; h++) {
//     for (let m of [0, 30]) {
//       const start = new Date();
//       start.setHours(h, m, 0, 0);

//       const end = new Date(start);
//       end.setMinutes(start.getMinutes() + 30);

//       const format = (d: Date) =>
//         d.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         });

//       slots.push(`${format(start)} – ${format(end)}`);
//     }
//   }
//   return slots;
// };

// export function SeatSelectionPage({
//   onConfirmBooking,
//   onLogout,
// }: SeatSelectionPageProps) {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState<Date | null>(
//     null,
//   );
//   const [selectedTimeSlot, setSelectedTimeSlot] = useState<
//     string | null
//   >(null);

//   const TIME_SLOTS = generateTimeSlots();

//   const [seats, setSeats] = useState<Seat[]>(() => {
//     const data: Seat[] = [];
//     let id = 1;

//     for (let table = 1; table <= 20; table++) {
//       for (let seat = 1; seat <= 5; seat++) {
//         data.push({
//           id,
//           tableNumber: table,
//           status: Math.random() > 0.7 ? "booked" : "available",
//         });
//         id++;
//       }
//     }
//     return data;
//   });

//   const selectedSeats = seats.filter(
//     (s) => s.status === "selected",
//   );

//   const handleSeatClick = (id: number) => {
//     setSeats((prev) =>
//       prev.map((seat) =>
//         seat.id === id && seat.status !== "booked"
//           ? {
//               ...seat,
//               status:
//                 seat.status === "selected"
//                   ? "available"
//                   : "selected",
//             }
//           : seat,
//       ),
//     );
//   };

//   const getDaysInMonth = (date: Date) => ({
//     daysInMonth: new Date(
//       date.getFullYear(),
//       date.getMonth() + 1,
//       0,
//     ).getDate(),
//     startingDayOfWeek: new Date(
//       date.getFullYear(),
//       date.getMonth(),
//       1,
//     ).getDay(),
//   });

//   const { daysInMonth, startingDayOfWeek } =
//     getDaysInMonth(currentDate);

//   const handleConfirm = () => {
//     if (
//       !selectedDate ||
//       !selectedTimeSlot ||
//       selectedSeats.length === 0
//     )
//       return;

//     onConfirmBooking({
//       seats: selectedSeats.map((s) => s.id),
//       quantity: selectedSeats.length,
//       totalCost: selectedSeats.length,
//       date: selectedDate.toDateString(),
//       timeSlot: selectedTimeSlot,
//     });
//   };

//   const allTables = Array.from({ length: 20 }, (_, i) =>
//     seats.filter((s) => s.tableNumber === i + 1),
//   );

//   const groundFloorTables = allTables.slice(0, 10);
//   const firstFloorTables = allTables.slice(10);

//   const renderFloor = (title: string, tables: Seat[][]) => (
//     <div className="mb-10">
//       <h3 className="text-base font-semibold text-gray-700 mb-4">
//         {title}
//       </h3>

//       <div className="grid grid-cols-2 gap-6">
//         {tables.map((tableSeats) => {
//           const tableNo = tableSeats[0]?.tableNumber;
//           const active = tableSeats.some(
//             (s) => s.status === "selected",
//           );

//           return (
//             <div
//               key={tableNo}
//               className={`p-4 rounded-2xl border-2 ${
//                 active
//                   ? "border-blue-600 bg-blue-50"
//                   : "border-gray-100 bg-white"
//               }`}
//             >
//               <p className="text-xs text-gray-500 text-center mb-3">
//                 Table {tableNo}
//               </p>

//               <div className="grid grid-cols-3 gap-2">
//                 {tableSeats.map((seat) => (
//                   <button
//                     key={seat.id}
//                     onClick={() => handleSeatClick(seat.id)}
//                     disabled={seat.status === "booked"}
//                     className={`h-10 rounded-lg text-xs font-medium ${
//                       seat.status === "selected"
//                         ? "bg-blue-600 text-white"
//                         : seat.status === "booked"
//                           ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           : "bg-blue-100 text-blue-700 hover:bg-blue-200"
//                     }`}
//                   >
//                     {seat.id}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Header */}
//       <header className="border-b px-6 py-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <h1 className="text-xl font-medium">
//             Riviera Booking
//           </h1>
//           <Button variant="ghost" onClick={onLogout}>
//             <User className="mr-2 h-4 w-4" /> Logout
//           </Button>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
//         {/* LEFT */}
//         <Card className="p-6 rounded-3xl">
//           <h2 className="mb-6 text-lg font-medium">
//             Booking table
//           </h2>

//           {/* Calendar */}
//           <div className="mb-6">
//             <div className="flex justify-between mb-3">
//               <ChevronLeft
//                 className="cursor-pointer"
//                 onClick={() =>
//                   setCurrentDate(
//                     new Date(
//                       currentDate.getFullYear(),
//                       currentDate.getMonth() - 1,
//                       1,
//                     ),
//                   )
//                 }
//               />
//               <span>
//                 {MONTHS[currentDate.getMonth()]}{" "}
//                 {currentDate.getFullYear()}
//               </span>
//               <ChevronRight
//                 className="cursor-pointer"
//                 onClick={() =>
//                   setCurrentDate(
//                     new Date(
//                       currentDate.getFullYear(),
//                       currentDate.getMonth() + 1,
//                       1,
//                     ),
//                   )
//                 }
//               />
//             </div>

//             <div className="grid grid-cols-7 gap-2">
//               {DAYS.map((d) => (
//                 <div
//                   key={d}
//                   className="text-xs text-center text-gray-500"
//                 >
//                   {d}
//                 </div>
//               ))}

//               {Array.from({ length: startingDayOfWeek }).map(
//                 (_, i) => (
//                   <div key={i} />
//                 ),
//               )}

//               {Array.from({ length: daysInMonth }).map(
//                 (_, i) => {
//                   const day = i + 1;
//                   const active =
//                     selectedDate?.getDate() === day &&
//                     selectedDate?.getMonth() ===
//                       currentDate.getMonth();

//                   return (
//                     <button
//                       key={day}
//                       onClick={() =>
//                         setSelectedDate(
//                           new Date(
//                             currentDate.getFullYear(),
//                             currentDate.getMonth(),
//                             day,
//                           ),
//                         )
//                       }
//                       className={`aspect-square rounded-xl ${
//                         active
//                           ? "bg-blue-600 text-white"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       {day}
//                     </button>
//                   );
//                 },
//               )}
//             </div>
//           </div>

//           {/* TIME SLOTS */}
//           <label className="block mb-3 text-sm font-medium">
//             Select time slot
//           </label>

//           <div className="grid grid-cols-2 gap-3 mb-6 max-h-60 overflow-y-auto">
//             {TIME_SLOTS.map((slot) => (
//               <button
//                 key={slot}
//                 onClick={() => setSelectedTimeSlot(slot)}
//                 className={`px-4 py-3 rounded-xl text-sm font-medium ${
//                   selectedTimeSlot === slot
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {slot}
//               </button>
//             ))}
//           </div>

//           <Button
//             onClick={handleConfirm}
//             disabled={
//               !selectedDate ||
//               !selectedTimeSlot ||
//               selectedSeats.length === 0
//             }
//             className="w-full"
//           >
//             Proceed ({selectedSeats.length} seats)
//           </Button>
//         </Card>

//         {/* RIGHT */}
//         <Card className="p-6 rounded-3xl overflow-y-auto max-h-[750px]">
//           <h2 className="text-lg font-medium mb-2">
//             Choose table
//           </h2>
//           <p className="text-sm text-gray-600 mb-6">
//             Two-storey cafeteria layout
//           </p>

//           {renderFloor("Ground Floor", groundFloorTables)}
//           {renderFloor("First Floor", firstFloorTables)}
//         </Card>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

/* ---------------- TYPES ---------------- */

interface SeatSelectionPageProps {
  onConfirmBooking: (bookingDetails: BookingDetails) => void;
  onLogout: () => void;
}

export interface BookingDetails {
  seats: number[];
  timeSlot: string;
  quantity: number;
  totalCost: number;
  date: string;
}

type SeatStatus = "available" | "booked" | "selected";

interface Seat {
  id: number;
  status: SeatStatus;
  tableNumber: number;
}

/* ---------------- CONSTANTS ---------------- */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Realistic table configuration:
 * tableNumber → number of seats
 */
const TABLE_CONFIG: Record<number, number> = {
  1: 2,
  2: 4,
  3: 6,
  4: 4,
  5: 2,
  6: 6,
  7: 4,
  8: 2,
  9: 4,
  10: 6,
  11: 2,
  12: 4,
  13: 6,
  14: 4,
  15: 2,
  16: 6,
  17: 4,
  18: 2,
  19: 4,
  20: 6,
};

/* ---------------- COMPONENT ---------------- */

export function SeatSelectionPage({
  onConfirmBooking,
  onLogout,
}: SeatSelectionPageProps) {
  /* ---------- DATE ---------- */
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    null,
  );

  /* ---------- TIME (USER INPUT) ---------- */
  const [startTime, setStartTime] = useState<string | null>(
    null,
  );
  const [endTime, setEndTime] = useState<string | null>(null);

  const isTimeValid =
    startTime &&
    endTime &&
    new Date(`1970-01-01T${endTime}`) >
      new Date(`1970-01-01T${startTime}`);

  /* ---------- SEATS ---------- */
  const [seats, setSeats] = useState<Seat[]>(() => {
    const data: Seat[] = [];
    let id = 1;

    Object.entries(TABLE_CONFIG).forEach(
      ([tableNo, seatCount]) => {
        for (let i = 0; i < seatCount; i++) {
          data.push({
            id,
            tableNumber: Number(tableNo),
            status:
              Math.random() > 0.75 ? "booked" : "available",
          });
          id++;
        }
      },
    );

    return data;
  });

  const selectedSeats = seats.filter(
    (s) => s.status === "selected",
  );

  const handleSeatClick = (id: number) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === id && seat.status !== "booked"
          ? {
              ...seat,
              status:
                seat.status === "selected"
                  ? "available"
                  : "selected",
            }
          : seat,
      ),
    );
  };

  /* ---------- CALENDAR ---------- */
  const getDaysInMonth = (date: Date) => ({
    daysInMonth: new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate(),
    startingDayOfWeek: new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    ).getDay(),
  });

  const { daysInMonth, startingDayOfWeek } =
    getDaysInMonth(currentDate);

  /* ---------- CONFIRM ---------- */
  const handleConfirm = () => {
    if (
      !selectedDate ||
      !isTimeValid ||
      selectedSeats.length === 0
    )
      return;

    onConfirmBooking({
      seats: selectedSeats.map((s) => s.id),
      quantity: selectedSeats.length,
      totalCost: selectedSeats.length,
      date: selectedDate.toDateString(),
      timeSlot: `${startTime} – ${endTime}`,
    });
  };

  /* ---------- TABLE GROUPING ---------- */
  const allTables = Array.from({ length: 20 }, (_, i) =>
    seats.filter((s) => s.tableNumber === i + 1),
  );

  const groundFloorTables = allTables.slice(0, 10);
  const firstFloorTables = allTables.slice(10);

  /* ---------- RENDER FLOOR ---------- */
  const renderFloor = (title: string, tables: Seat[][]) => (
    <div className="mb-10">
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {tables.map((tableSeats) => {
          const tableNo = tableSeats[0]?.tableNumber;
          const active = tableSeats.some(
            (s) => s.status === "selected",
          );

          return (
            <div
              key={tableNo}
              className={`p-4 rounded-2xl border-2 ${
                active
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <p className="text-xs text-gray-500 text-center mb-2">
                Table {tableNo} · {tableSeats.length} seats
              </p>

              <div
                className={`grid gap-2 ${
                  tableSeats.length <= 2
                    ? "grid-cols-2"
                    : tableSeats.length <= 4
                      ? "grid-cols-2"
                      : "grid-cols-3"
                }`}
              >
                {tableSeats.map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat.id)}
                    disabled={seat.status === "booked"}
                    className={`h-10 rounded-lg text-xs font-medium ${
                      seat.status === "selected"
                        ? "bg-blue-600 text-white"
                        : seat.status === "booked"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    Seat
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-medium">
            Riviera Booking
          </h1>
          <Button variant="ghost" onClick={onLogout}>
            <User className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
        {/* LEFT */}
        <Card className="p-6 rounded-3xl">
          <h2 className="mb-6 text-lg font-medium">
            Booking details
          </h2>

          {/* Calendar */}
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <ChevronLeft
                className="cursor-pointer"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
              />
              <span>
                {MONTHS[currentDate.getMonth()]}{" "}
                {currentDate.getFullYear()}
              </span>
              <ChevronRight
                className="cursor-pointer"
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
              />
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-xs text-center text-gray-500"
                >
                  {d}
                </div>
              ))}

              {Array.from({ length: startingDayOfWeek }).map(
                (_, i) => (
                  <div key={i} />
                ),
              )}

              {Array.from({ length: daysInMonth }).map(
                (_, i) => {
                  const day = i + 1;
                  const active =
                    selectedDate?.getDate() === day &&
                    selectedDate?.getMonth() ===
                      currentDate.getMonth();

                  return (
                    <button
                      key={day}
                      onClick={() =>
                        setSelectedDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth(),
                            day,
                          ),
                        )
                      }
                      className={`aspect-square rounded-xl ${
                        active
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Time Input */}
          <label className="block mb-2 text-sm font-medium">
            Select time (30-min intervals)
          </label>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <input
              type="time"
              step={1800}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border px-4 py-3"
            />
            <input
              type="time"
              step={1800}
              disabled={!startTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-xl border px-4 py-3"
            />
          </div>

          <Button
            onClick={handleConfirm}
            disabled={
              !selectedDate ||
              !isTimeValid ||
              selectedSeats.length === 0
            }
            className="w-full"
          >
            Proceed ({selectedSeats.length} seats)
          </Button>
        </Card>

        {/* RIGHT */}
        <Card className="p-6 rounded-3xl overflow-y-auto max-h-[750px]">
          <h2 className="text-lg font-medium mb-2">
            Choose table
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Two-storey cafeteria layout
          </p>

          {renderFloor("Ground Floor", groundFloorTables)}
          {renderFloor("First Floor", firstFloorTables)}
        </Card>
      </div>
    </div>
  );
}