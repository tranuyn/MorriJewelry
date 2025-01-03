import React from "react";
import { Navigate, Route } from "react-router-dom";
import AdminLayout from "../component/Layout/AdminLayout";
import { ROLES } from "../constants/roles";
import HomePage from "../pages/HomePage/homePage";
import ProductsAndService from "../pages/ProductsAndServices/productsAndServicePage";
import RepurchasePage from "../pages/RepurchasePage/RepurchasePage";

import Unauthorization from "../pages/Unauthorization/Unauthorization";
import { ProtectedRoute } from "./ProtectedRoute"; 
import EnterInventory from "../pages/EnterInventory/EnterInventory";

export const InventoryStaffRoutes = () => {
  return (
    <Route
      element={
        <ProtectedRoute allowedRoles={[ROLES.INVENTORY_STAFF]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/home" element={<HomePage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/staff" element={<StaffPage />} />
      <Route path="/settings" element={<SettingPage />} />

      <Route path="/products" element={<ProductsAndService />} />
      <Route path="/products/detail/:id" element={<ProductDetail />} />
      <Route path="/enter-inventory" element={<EnterInventory />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/unauthorized" element={<Unauthorization />} />
      <Route path="/repurchase" element={<RepurchasePage />} />

      <Route path="*" element={<Navigate to="/unauthorized" />} />
    </Route>
  );
};
