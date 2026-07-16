import { useState } from "react";
import { useAllOrderQuery } from "../../api/order/orderApi";
import Pagination from "../../components/pagination/Pagination";
import StatusUpdateModal from "./StatusUpdateModal";
import OrderDetailsModal from "./OrderDetailsModal";
import type { Order } from "../../lib/type/type";
import RefaundModal from "./RefaundModal";

export default function OrderManagementPage() {
  const [searchId, setSearchId] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchFood, setSearchFood] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Order Status");

  // Pagination & rows configuration states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(30);

  // Helper to handle filter changes safely
  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setPage(1); // Reset back to first page when query parameters shift
  };

  // ================================================ Show All Order Api ==================================================
  const { data, isFetching } = useAllOrderQuery({
    statusFilter,
    searchId,
    searchCustomer,
    searchFood,
    page,
    perPage,
  });

  // Extracting data matching your exact API payload structure
  const ordersList = data?.data?.data || [];
  const meta = {
    current_page: data?.data?.current_page || 1,
    last_page: data?.data?.last_page || 1,
    total: data?.data?.total || 0,
  };

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [openRefundModal, setOpenRefundModal] = useState(false);
  const [selectedRefundId, setSelectedRefundId] = useState<number | null>(null);
  const [openViewDetails, setOpenViewDetails] = useState(false);

  const exportOrdersToCSV = () => {
    const headers = [
      "Order ID",
      "Customer",
      "Food Name",
      "Date",
      "Amount",
      "Status",
    ];

    const rows = ordersList.map((order: any) => [
      order.order_number || order.id,
      order.user?.name || "N/A",
      order.items?.[0]?.food?.name || "N/A",
      order.created_at || "N/A",
      order.total_amount || "0.00",
      order.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const resetFilters = () => {
    setSearchId("");
    setSearchCustomer("");
    setSearchFood("");
    setStatusFilter("All Order Status");
    setPage(1);
  };

  const openUpdateModal = (order: any) => {
    setUpdatingOrder(order);
    setNewStatus(order.status);
  };

  const openViewDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setOpenViewDetails(true);
  };

  const handleOpenRefundModal = (id: number) => {
    setSelectedRefundId(id);
    setOpenRefundModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4  rounded-2xl ">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="mt-2 text-gray-500">
              Manage all customer orders and track delivery status.
            </p>
          </div>

          <button
            onClick={exportOrdersToCSV}
            className="rounded-xl bg-[#207F36] cursor-pointer px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a6b2c]"
          >
            Export Orders
          </button>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-3xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={searchId}
              onChange={(e) => handleFilterChange(setSearchId, e.target.value)}
              placeholder="Search by order ID..."
              className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0 px-4 py-3"
            />

            <input
              value={searchCustomer}
              onChange={(e) =>
                handleFilterChange(setSearchCustomer, e.target.value)
              }
              placeholder="Search by customer..."
              className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0 px-4 py-3"
            />

            <input
              value={searchFood}
              onChange={(e) =>
                handleFilterChange(setSearchFood, e.target.value)
              }
              placeholder="Search by food..."
              className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0 px-4 py-3"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(setStatusFilter, e.target.value)
              }
              className="rounded-xl border border-[#207F36] hover:ring-0 focus:outline-0 focus:ring-0 px-4 py-3"
            >
              <option>All Order Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={resetFilters}
              className="rounded-xl border border-[#207F36] cursor-pointer hover:ring-0 focus:outline-0 focus:ring-0 px-5 py-3 text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Food</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Payment Status</th>
                  <th className="px-6 py-4 text-left">Order Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      Loading orders data...
                    </td>
                  </tr>
                ) : ordersList.length === 1 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      No orders found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  ordersList.map((order: Order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50/50">
                      <td className="px-6 py-5 font-semibold">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-5">{order.user?.name || "N/A"}</td>
                      <td className="px-6 py-5">
                        {order.items?.[0]?.food?.name || "N/A"}
                      </td>
                      <td className="px-6 py-5">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-5">${order.total_amount}</td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(order.status)}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right flex justify-end gap-2">
                        <button
                          onClick={() => {
                            openViewDetailsModal(order);
                          }}
                          className="rounded-xl cursor-pointer border border-[#207F36] hover:bg-gray-50 px-3 py-2 text-sm text-gray-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openUpdateModal(order)}
                          className="rounded-xl cursor-pointer bg-[#207F36] text-white hover:bg-[#1a6b2c] px-3 py-2 text-sm"
                        >
                          Update Status
                        </button>
                        {order?.payment_status !== "refunded" ? (
                          <button
                            onClick={() => handleOpenRefundModal(order.id)}
                            className="rounded-xl cursor-pointer bg-[#207F36] text-white hover:bg-[#1a6b2c] px-3 py-2 text-sm"
                          >
                            Refund
                          </button>
                        ) : (
                          <button
                            disabled
                            className="rounded-xl cursor-not-allowed bg-gray-500 text-white px-3 py-2 text-sm"
                          >
                            Already Refunded
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination UI Injection */}
        <div className="mt-4">
          <Pagination
            currentPage={page}
            lastPage={meta.last_page}
            totalResults={meta.total}
            perPage={perPage}
            isFetching={isFetching}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {openViewDetails && (
        <OrderDetailsModal
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      )}

      {/* STATUS UPDATE MODAL */}
      {updatingOrder && (
        <StatusUpdateModal
          setUpdatingOrder={setUpdatingOrder}
          updatingOrder={updatingOrder}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
        />
      )}

      {/* REFUND MODAL */}
      {openRefundModal && (
        <RefaundModal
          orderId={selectedRefundId}
          isOpen={openRefundModal}
          onClose={() => setOpenRefundModal(false)}
        />
      )}
    </div>
  );
}
