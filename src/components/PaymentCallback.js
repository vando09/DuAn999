import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentCallback = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const successMessage = queryParams.get('message');
    const errorMessage = queryParams.get('error');
    
    if (successMessage) {
      setMessage(decodeURIComponent(successMessage));
    }

    if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    }
  }, [location]);

  return (
    <div className="payment-callback">
      {message ? (
        <div className="alert alert-success">
          <h3>Thanh toán thành công</h3>
          <p>{message}</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <h3>Thanh toán thất bại</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="alert alert-info">
          <p>Đang kiểm tra thông tin thanh toán...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentCallback;
