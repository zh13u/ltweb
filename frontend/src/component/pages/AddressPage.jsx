import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../style/address.css";

const AddressPage = () => {
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/edit-address") {
      fetchUserInfo();
    }
  }, [location.pathname]);

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.getLoggedInUserInfo();
      if (response.user.address) {
        setAddress(response.user.address);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "unable to fetch user information"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.saveAddress(address);
      navigate("/profile");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save/update address"
      );
    }
  };

  return (
    <div className="address-page">
      <h2>
        {location.pathname === "/edit-address" ? "Edit Address" : "Add Address"}
      </h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handSubmit}>
        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            id="street"
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            name="state"
            value={address.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">Zip Code</label>
          <input
            id="zipCode"
            type="text"
            name="zipCode"
            value={address.zipCode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            type="text"
            name="country"
            value={address.country}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {location.pathname === "/edit-address"
            ? "Update Address"
            : "Save Address"}
        </button>
      </form>
    </div>
  );
};

export default AddressPage;
