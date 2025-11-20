import { AdminContext } from "./AdminContext";
import { useState, useEffect } from "react";
import LoadingOverlay from "../src/components/LoadingOverlay";

const AdminContextProvider = (props) => {
  const currency = "₫";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState({
    PAID: true,
    PENDING_PAYMENT: true,
    CANCELLED: true,
    PROCESSING: true,
    FAILED: true,
    REFUNDED: true,
  });

  // Effect for show loading
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 500); // show spinner after 0.5s
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const value = {
    currency,
    token,
    setToken,
    loading,
    setLoading,
    statusFilter,
    setStatusFilter,
  };

  return (
    <AdminContext.Provider value={value}>
      {showLoading && <LoadingOverlay />}
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
