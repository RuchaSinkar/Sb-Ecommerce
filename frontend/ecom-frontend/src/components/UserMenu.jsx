import { Avatar, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { BiUser } from "react-icons/bi";
import { FaShoppingCart, FaUserShield } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import BackDrop from "./BackDrop";
import { logOutUser } from "../store/actions";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const isSeller = user?.roles?.includes("ROLE_SELLER");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOutHandler = () => {
    handleClose();
    dispatch(logOutUser(navigate));
  };

  return (
    <div className="relative z-30">
      
      {/* Avatar Button */}
      <div
        className="sm:border sm:border-slate-400 flex items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-slate-700"
        onClick={handleClick}
      >
        <Avatar alt={user?.username || "User"} src="" />
      </div>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          sx: { width: 160 },
        }}
      >

        {/* Profile */}
        <Link to="/profile">
          <MenuItem onClick={handleClose} className="flex gap-2">
            <BiUser className="text-xl" />
            <span className="font-bold text-[16px] mt-1">
              {user?.username}
            </span>
          </MenuItem>
        </Link>

        {/* Orders */}
        <Link to="/profile/orders">
          <MenuItem onClick={handleClose} className="flex gap-2">
            <FaShoppingCart className="text-xl" />
            <span className="font-semibold">Orders</span>
          </MenuItem>
        </Link>

        {/* Admin / Seller Panel */}
        {(isAdmin || isSeller) && (
          <Link to={isAdmin ? "/admin" : "/admin/orders"}>
            <MenuItem onClick={handleClose} className="flex gap-2">
              <FaUserShield className="text-xl" />
              <span className="font-semibold">
                {isAdmin ? "Admin Panel" : "Seller Panel"}
              </span>
            </MenuItem>
          </Link>
        )}

        {/* Logout */}
        <MenuItem onClick={logOutHandler} className="flex gap-2">
          <div className="font-semibold w-full flex gap-2 items-center bg-button-gradient px-4 py-1 text-white rounded-xs">
            <IoExitOutline className="text-xl" />
            <span className="font-bold text-[16px] mt-1">Logout</span>
          </div>
        </MenuItem>

      </Menu>

      {/* Backdrop */}
      {open && <BackDrop isNavbarOpen={true} />}
    </div>
  );
};

export default UserMenu;