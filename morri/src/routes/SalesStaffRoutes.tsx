import React, { useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import { ROLES } from "../constants/roles";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminLayout from "../component/Layout/AdminLayout";
import HomePage from "../pages/HomePage/homePage";
import ProductsAndService from "../pages/ProductsAndServices/productsAndServicePage";
import Unauthorization from "../pages/Unauthorization/Unauthorization";
import OrdersPage from "../pages/OrdersPage/ordersPage";
import AttendancePage from "../pages/AttendancePage/AttendancePage";
import StaffPage from "../pages/StaffPage/StaffPage";
import SettingPage from "../pages/SettingPage/SettingPage";
import CheckOut from "../pages/CheckOut/CheckOut";
import CheckOutSuccess from "../pages/CheckOut/CheckOutSuccess";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import CustomerManagementPage from "../pages/admin/CustomerMangementPage/CustomerManagementPage";
import EmployeeHomePage from "../pages/HomePage/EmployeeHomePage";
import { useAuth } from "../services/useAuth";
import RoutingHomePage from "../pages/HomePage/RoutingHomePage";

export const SalesStaffRoutes = () => {
  return (
    <Route
      element={
        <ProtectedRoute allowedRoles={[ROLES.SALE_STAFF]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/home" element={<RoutingHomePage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/settings" element={<SettingPage />} />
      <Route path="/products/detail/:id" element={<ProductDetail />} />
      <Route path="/products" element={<ProductsAndService />} />
      <Route path="/attendance" element={<AttendancePage />} />

      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/products/checkout" element={<CheckOut />} />
      <Route path="/products/checkout/:orderId" element={<CheckOutSuccess />} />
      <Route path="/unauthorized" element={<Unauthorization />} />
      <Route path="*" element={<Navigate to="/unauthorized" />} />
      {/* <Route path="/admin/customer" element={<CustomerManagementPage />} /> */}
    </Route>
  );
};
