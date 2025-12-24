import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

const CustomerOrderList = ({ orders, openModal, handleDelete }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const [search, setSearch] = useState("");
  const filteredOrders = orders.filter((o) => {
    const value = search.toLowerCase();
    return (
      (o.firstName || "").toLowerCase().includes(value) ||
      (o.lastName || "").toLowerCase().includes(value) ||
      (o.email || "").toLowerCase().includes(value) ||
      (o.phone || "").toLowerCase().includes(value) ||
      (o.customerId || "").toLowerCase().includes(value) ||
      (o.orderId || "").toLowerCase().includes(value)
    );
  });

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-64"
        />

        <button
          onClick={() => openModal(null)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Create Order
        </button>
      </div>

      {/*Horizontal scroll wrapper */}
      <div className="border rounded-lg shadow-sm bg-white">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="min-w-max border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-3 py-2 border">S.no</th>
                <th className="px-3 py-2 border">Customer ID</th>
                <th className="px-3 py-2 border">Customer Name</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">Phone</th>
                <th className="px-3 py-2 border">Address</th>
                <th className="px-3 py-2 border">Order ID</th>
                <th className="px-3 py-2 border">Order Date</th>
                <th className="px-3 py-2 border">Product</th>
                <th className="px-3 py-2 border">Quantity</th>
                <th className="px-3 py-2 border">Total amount</th>
                <th className="px-3 py-2 border">Unit price</th>
                <th className="px-3 py-2 border">Status</th>
                <th className="px-3 py-2 border">Created by</th>
                <th className="px-3 py-2 border text-center bg-gray-100 sticky right-0 z-20">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-4 text-gray-500 border"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="text-sm text-gray-700 relative"
                  >
                    <td className="border px-3 py-2">{index + 1}</td>
                    <td className="border px-3 py-2">{order.customerId}</td>
                    <td className="border px-3 py-2">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="border px-3 py-2">{order.email}</td>
                    <td className="border px-3 py-2">{order.phone}</td>
                    <td className="border px-3 py-2">{order.fullAddress}</td>
                    <td className="border px-3 py-2">{order.orderId}</td>
                    <td className="border px-3 py-2">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>

                    {/* Product */}
                    <td className="border px-3 py-2">{order.chooseProduct}</td>

                    {/* Quantity */}
                    <td className="border px-3 py-2 text-center">
                      {order.quantity}
                    </td>

                    {/* Total amount */}
                    <td className="border px-3 py-2">{order.totalAmount}</td>

                    {/* Unit price */}
                    <td className="border px-3 py-2">{order.unitPrice}</td>

                    {/* Status */}
                    <td className="border px-3 py-2">{order.status}</td>

                    {/* Created by */}
                    <td className="border px-3 py-2">{order.createdBy}</td>

                    {/*Actions column */}
                    <td className="border px-3 py-2 text-center relative bg-white sticky right-0 z-10">
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === index ? null : index)
                        }
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <MoreVertical size={20} className="text-gray-600" />
                      </button>

                      {openMenu === index && (
                        <div className="absolute right-6 mt-1 w-36 bg-white border shadow-md rounded z-30 pointer-events-auto">
                          <button
                            onClick={() => {
                              openModal(order._id);
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              handleDelete(order._id);
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderList;

