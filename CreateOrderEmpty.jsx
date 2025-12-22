import React, { useState, useEffect } from "react";
import CustomerOrderList from "./CustomerOrderList";
import { Link } from "react-router-dom";
import { useWidgetContext } from "../../Widgets/widgetContext";
import axios from "axios";

const CreateOrderEmpty = () => {
  const [showModal, setShowModal] = useState(false);

  const API = "http://localhost:5001/api/orders";

  const [editingId, setEditingId] = useState(null);
  const { orders, setOrders } = useWidgetContext();

  useEffect(() => {
    console.log("🟢 CREATE ORDER | CONTEXT ORDERS UPDATED:", orders);
  }, [orders]);

  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postal: "",
    country: "",
    product: "",
    quantity: 1,
    unitPrice: "",
    total: "$0.00",
    status: "Pending",
    createdBy: "Mr. Michael Harris",
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Auto-calculate total
  useEffect(() => {
    const qty = Number(formData.quantity) || 0;
    const price = Number(formData.unitPrice) || 0;
    const total = qty * price;
    setFormData((prev) => ({
      ...prev,
      total: `$${total.toFixed(2)}`,
    }));
  }, [formData.quantity, formData.unitPrice]);

  useEffect(() => {
    axios
      .get(API)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.error("Fetch orders failed", err));
  }, []);

  const handleOpenModal = (id = null) => {
    setEditingId(id);

    if (id) {
      const order = orders.find((o) => o._id === id);
      if (!order) return;

      setFormData({
        ...initialForm,
        ...order,
        product: order.chooseProduct || "",
        unitPrice: order.unitPrice || "",
        quantity: order.quantity || 1,
        total: order.totalAmount
          ? `$${Number(order.totalAmount).toFixed(2)}`
          : "$0.00",
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setErrors({});
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      setFormData((prev) => ({
        ...prev,
        quantity: value === "" ? "" : Math.max(0, Number(value)),
      }));
    } else if (name === "unitPrice") {
      const cleaned = value.replace(/[^0-9.]/g, "");
      setFormData((prev) => ({
        ...prev,
        unitPrice: cleaned,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const validateForm = () => {
    let newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "street",
      "city",
      "state",
      "postal",
      "product",
      "unitPrice",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "Please fill the field";
    });

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const totalAmount = Number(formData.quantity) * Number(formData.unitPrice);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postal: formData.postal,
      country: formData.country,
      chooseProduct: formData.product,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      totalAmount,
      status: formData.status,
      createdBy: formData.createdBy,
    };

    try {
      if (editingId) {
        // UPDATE
        const res = await axios.put(`${API}/update/${editingId}`, payload);

        setOrders((prev) =>
          prev.map((o) => (o._id === editingId ? res.data : o))
        );
      } else {
        // CREATE
        const res = await axios.post(`${API}/create`, payload);
        setOrders((prev) => [res.data.order, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error("Order save failed", err);
    }
  };

  useEffect(() => {
    console.log("CREATE ORDER - CONTEXT ORDERS:", orders);
  }, [orders]);

  return (
    <div className="min-h-screen p-4">
      <div className="mb-6 p-4">
        <h1 className="text-2xl font-bold">Customer Orders</h1>
        <p className="text-gray-500">
          View and manage customer orders and details
        </p>

        <div className="flex gap-10 mt-6 border-b pb-2">
          <Link to="/" className="text-gray-600 font-semibold cursor-pointer">
            Dashboard
          </Link>
          <Link
            to="/create-order"
            className="text-green-600 border-b-2 border-green-500 pb-2 cursor-pointer"
          >
            Table
          </Link>
        </div>
      </div>

      <div className="p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-gray-500 font-medium">No Orders Yet</p>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => handleOpenModal(null)}
            >
              Create order
            </button>
          </div>
        ) : (
          <CustomerOrderList
            orders={orders}
            openModal={handleOpenModal}
            handleDelete={handleDelete}
          />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-[95%] md:w-[75%] lg:w-[55%] rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh] border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editingId !== null ? "Edit Order" : "Create Order"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-red-500"
                >
                  ✖
                </button>
              </div>
              {/* Form remains the same */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      First name <span className="text-red-600">*</span>
                    </label>
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Email ID */}
                  <div className="relative w-full">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      Email ID <span className="text-red-600">*</span>
                    </label>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      Last name <span className="text-red-600">*</span>
                    </label>
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="relative w-full">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      Phone number <span className="text-red-600">*</span>
                    </label>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Street (span full width) */}
                  <div className="relative w-full sm:col-span-2">
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      Street Address <span className="text-red-600">*</span>
                    </label>
                    {errors.street && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      City <span className="text-red-600">*</span>
                    </label>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      State / Province <span className="text-red-600">*</span>
                    </label>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  {/* Postal */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      name="postal"
                      value={formData.postal}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      Postal code <span className="text-red-600">*</span>
                    </label>
                    {errors.postal && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.postal}
                      </p>
                    )}
                  </div>

                  {/* Country (select) */}
                  <div className="relative w-full">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 bg-white text-gray-900 border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-600 peer"
                    >
                      <option value="" disabled hidden>
                        Select Country
                      </option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                    <label className="absolute left-3 top-3 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-600">
                      Country <span className="text-red-600">*</span>
                    </label>
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* ================== ORDER INFORMATION ================== */}
                <h3 className="text-sm font-semibold mb-3 mt-6 text-gray-700">
                  Order Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product Select (span full width) */}
                  <div className="relative w-full sm:col-span-2">
                    <select
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="peer border border-gray-300 rounded-md w-full px-3 py-3 bg-white focus:border-blue-500 outline-none"
                    >
                      <option value="">Choose product</option>
                      <option value="Fiber Internet 300 Mbps">
                        Fiber Internet 300 Mbps
                      </option>
                      <option value="Fiber Internet 500 Mbps">
                        Fiber Internet 500 Mbps
                      </option>
                      <option value="Fiber Internet 1 Gbps">
                        Fiber Internet 1 Gbps
                      </option>
                    </select>
                    <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-blue-600">
                      Choose product *
                    </label>
                    {errors.product && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.product}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="relative w-full">
                    <input
                      type="number"
                      name="quantity"
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder=" "
                      className="block px-3 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 top-3 px-1 text-gray-500 transition-all duration-200 pointer-events-none bg-white peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-blue-600">
                      Quantity <span className="text-red-600">*</span>
                    </label>
                  </div>

                  {/* Unit Price */}
                  <div className="relative w-full">
                    <span className="absolute left-3 top-3 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="block px-6 py-3 w-full text-gray-900 bg-white border border-gray-300 rounded-md
               focus:outline-none focus:border-blue-500 peer"
                    />
                    <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-blue-600">
                      Unit price *
                    </label>
                    {errors.unitPrice && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.unitPrice}
                      </p>
                    )}
                  </div>
                  {/* Total amountF */}
                  <div className="relative w-full">
                    <span className="absolute left-3 top-3 text-gray-500">
                      $
                    </span>
                    <input
                      type="text"
                      name="total"
                      value={formData.total.replace("$", "")}
                      readOnly
                      className="block px-6 py-3 w-full bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                    />
                    <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-gray-500">
                      Total Amount
                    </label>
                  </div>

                  {/* Status */}
                  <div className="relative w-full">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="peer border border-gray-300 rounded-md w-full px-3 py-3 bg-white focus:border-blue-500 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-blue-600">
                      Status *
                    </label>
                  </div>

                  {/* Created By */}
                  <div className="relative w-full sm:col-span-2">
                    <select
                      name="createdBy"
                      value={formData.createdBy}
                      onChange={handleChange}
                      className="peer border border-gray-300 rounded-md w-full px-3 py-3 bg-white outline-none focus:border-blue-500"
                    >
                      <option value="Mr. Michael Harris">
                        Mr. Michael Harris
                      </option>
                      <option value="Mr. Ryan Cooper">Mr. Ryan Cooper</option>
                      <option value="Jordan Ray">Jordan Ray</option>
                    </select>
                    <label className="absolute left-3 -top-2 text-xs bg-white px-1 text-blue-600">
                      Created by *
                    </label>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                  >
                    {editingId !== null ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateOrderEmpty;
