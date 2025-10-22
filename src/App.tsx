
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Training from "./pages/Training";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
// Admin pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import HeroAdmin from "./pages/admin/HeroAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import TrainingAdmin from "./pages/admin/TrainingAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import ContactAdmin from "./pages/admin/ContactAdmin";
import StaffAdmin from "./pages/admin/StaffAdmin";

const App = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}
  >
    <ScrollToTop />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/training" element={<Layout><Training /></Layout>} />
      <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/booking" element={<Layout><Booking /></Layout>} />
      <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
      <Route path="/terms-conditions" element={<Layout><TermsConditions /></Layout>} />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/admin/hero" element={<AdminLayout><HeroAdmin /></AdminLayout>} />
      <Route path="/admin/services" element={<AdminLayout><ServicesAdmin /></AdminLayout>} />
      <Route path="/admin/training" element={<AdminLayout><TrainingAdmin /></AdminLayout>} />
      <Route path="/admin/gallery" element={<AdminLayout><GalleryAdmin /></AdminLayout>} />
      <Route path="/admin/messages" element={<AdminLayout><ContactAdmin /></AdminLayout>} />
      <Route path="/admin/staff" element={<AdminLayout><StaffAdmin /></AdminLayout>} />
      
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  </BrowserRouter>
);

export default App;
