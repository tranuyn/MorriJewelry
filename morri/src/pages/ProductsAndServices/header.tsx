import React from "react";
import PinDropIcon from "@mui/icons-material/PinDrop";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./style.css";
import { useAuth } from "../../services/useAuth";
const Header: React.FC = () => {
  const { isAuthenticated, user, validateAuthStatus } = useAuth();
  return (
    <div className="pheader">
      <div className="pcontainer">
        <button className="pbtn">
          <PinDropIcon sx={{ color: "#EFB26A", fontSize: 24 }} />
          <span className="pCuaHang">Cửa hàng</span>
        </button>

        <button className="pbtn">
          <SupportAgentIcon sx={{ color: "#EFB26A", fontSize: 24 }} />
          <span className="pCuaHang">Hotline: 0939899822</span>
        </button>
      </div>
      <div className="pcontainer">
        {user?.role === "CUSTOMER" && (
          <button className="pbtn">
            <ShoppingCartIcon sx={{ color: "#EFB26A", fontSize: 24 }} />
            <span className="pCuaHang">Giỏ hàng</span>
          </button>
        )}
      </div>
    </div>
  );
};
export default Header;
