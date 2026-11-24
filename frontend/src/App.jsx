import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { PackageList } from './components/Packages/PackageList';
import { PackageDetail } from './components/Packages/PackageDetail';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { AdminLogin } from './components/Auth/AdminLogin';
import { BookingForm } from './components/Bookings/BookingForm';
import { BookingList } from './components/Bookings/BookingList';
import { BookingDetail } from './components/Bookings/BookingDetail';
import { Payment } from './components/Payment/Payment';
import { InquiryForm } from './components/Inquiry/InquiryForm';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { UserEnquiries } from './components/User/UserEnquiries';
import { Notifications } from './components/Notifications/Notifications';
import './index.css';

function AppContent() {
  const location = useLocation();
  const showHeader = !location.pathname.includes('/login') && !location.pathname.includes('/register');

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<PackageList showFilters={true} />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/booking-form" element={<BookingForm />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/contact" element={<InquiryForm />} />
        <Route path="/my-enquiries" element={<UserEnquiries />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
