import { useState, useEffect } from "react";
import Pagination from "../../components/pagination/Pagination";
import type { NotificationItem } from "../../lib/type/type";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkSingleNotificationAsReadMutation,
} from "../../api/notification/notificationApi";
import toast from "react-hot-toast";
import { errorMessage } from "../../lib/msg/errorMsg";
import { MdOutlineDeleteOutline } from "react-icons/md";
import echo from "../../lib/echo/echo";
import { useAdminProfileQuery } from "../../api/auth/authApi";
import ConfirmModal from "../../lib/alert/ConfirmModal";

export default function NotificationManagementPage() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // Modal tracking states
  const [deletePopUp, setDeletePopUp] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | number>("");

  // ================================================ Fetch API Hook ==================================================
  const { data } = useGetNotificationsQuery({
    page,
    perPage,
  });
  const [markSingleNotificationAsRead] = useMarkSingleNotificationAsReadMutation();
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification, { isLoading }] = useDeleteNotificationMutation();

  const notificationsList: NotificationItem[] = data?.data || [];

  const meta = {
    current_page: data?.meta?.current_page || 1,
    last_page: data?.meta?.last_page || 1,
    total: data?.meta?.total || 0,
  };

  // ========================================== Laravel Echo Real-time Listener ==========================================
  const { data: userData } = useAdminProfileQuery({});

  const userId = userData?.data?.id;
  useEffect(() => {
    if (!userId) return;

    const channelName = `App.Models.User.${userId}`;

    echo.private(channelName).notification((notification: any) => {
      if (notification.type === "new_order") {
        toast.success(notification.message || "New private alert received", {
          icon: "🎉",
        });
      } else if (notification.type === "refunded") {
        toast.success(notification.message || "New private alert received", {
          icon: "💳",
        });
      } else if (notification.type === "status_updated") {
        toast.success(notification.message || "New private alert received", {
          icon: "📦",
        });
      } else if (notification.type === "cancelled") {
        toast.error(notification.message || "New private alert received", {
          icon: "🚫",
        });
      } else {
        toast(notification.message || "New private alert received", {
          icon: "🔔",
        });
      }
    });

    return () => {
      echo.leave(channelName);
    };
  }, [userId]);

  // =========================================== Single Read Notification ===========================================================
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (notification.read_at) return;

    try {
      await markSingleNotificationAsRead(notification.id).unwrap();
      toast.success("Notification marked as read");
    } catch (error) {
      errorMessage(error);
    }
  };

  // ===================================== Read All Notification ===================================================
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead().unwrap();
      toast.success("Notification read successfully");
    } catch (error) {
      errorMessage(error);
    }
  };

  // ======================================= Delete Modal Handlers =================================================
  const deleteModalClose = () => {
    setDeletePopUp(false);
    setSelectedId("");
  };

  const openDeleteModal = (e: React.MouseEvent, id: number | string) => {
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering list item container clicks
    setSelectedId(id);
    setDeletePopUp(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    const toastId = toast.loading("Deleting notification...");
    try {
      await deleteNotification(selectedId).unwrap();
      toast.success("Notification deleted successfully", { id: toastId });
      deleteModalClose();
    } catch (error) {
      toast.error("Failed to delete notification", { id: toastId });
      errorMessage(error);
    }
  };

  const getNotificationBadgeStyle = (type: string) => {
    switch (type) {
      case "new_order":
        return {
          bg: "bg-emerald-50 border-emerald-100 hover:bg-emerald-100/50",
          iconBg: "bg-emerald-500 text-white",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          label: "New Order",
          icon: "🛍️",
        };
      case "cancelled":
        return {
          bg: "bg-rose-50 border-rose-100 hover:bg-rose-100/50",
          iconBg: "bg-rose-500 text-white",
          badge: "bg-rose-100 text-rose-800 border-rose-200",
          label: "Cancelled",
          icon: "❌",
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-100 hover:bg-gray-100/50",
          iconBg: "bg-gray-500 text-white",
          badge: "bg-gray-100 text-gray-800 border-gray-200",
          label: "System",
          icon: "🔔",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 rounded-2xl">
      <div className="mx-auto max-w-4xl">
        {/* Header Layout */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Notifications Portal
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Stay updated with incoming consumer activity, order logs, and system events.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="self-start sm:self-auto rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 cursor-pointer"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications Stack */}
        <div className="rounded-3xl bg-white p-2 shadow-sm border border-gray-100 overflow-hidden">
          {notificationsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-base font-semibold text-gray-900">
                All caught up!
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                No alerts or notifications found right now.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notificationsList.map((notification) => {
                const styles = getNotificationBadgeStyle(notification.data.type);
                const isUnread = !notification.read_at;

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-4 p-5 transition relative border-l-4 my-6 group ${
                      isUnread
                        ? "border-l-[#207F36] cursor-pointer"
                        : "border-l-transparent opacity-75"
                    } ${styles.bg}`}
                  >
                    {/* Status Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg shadow-sm ${styles.iconBg}`}
                    >
                      {styles.icon}
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 pr-12">
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-semibold border ${styles.badge}`}
                        >
                          {styles.label}
                        </span>
                        {notification.data.amount && (
                          <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                            ${notification.data.amount}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                          {new Date(notification.created_at).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <p
                        className={`text-sm ${isUnread ? "font-semibold text-gray-900" : "text-gray-500"}`}
                      >
                        {notification.data.message}
                      </p>

                      <div className="pt-1 flex items-center gap-4 text-xs text-gray-400">
                        <span>
                          Ref ID:{" "}
                          <strong className="font-mono text-gray-600">
                            {notification.data.order_number}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Actions Layout */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <button
                        onClick={(e) => openDeleteModal(e, notification.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 rounded-lg border border-transparent transition duration-150 cursor-pointer hover:bg-rose-50 z-10"
                        title="Delete notification"
                      >
                        <MdOutlineDeleteOutline className="w-5 h-5 text-gray-500 hover:text-rose-600" />
                      </button>

                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-[#207F36] transition duration-150 group-hover:scale-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={page}
            lastPage={meta.last_page}
            totalResults={meta.total}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </div>

        {/* DELETE MODAL CONTAINER */}
        <ConfirmModal
          open={deletePopUp}
          title="Are you sure you want to delete this notification?"
          description="Once deleted, this notification cannot be recovered."
          confirmText={isLoading ? "Deleting..." : "Delete"}
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={deleteModalClose}
          loading={isLoading}
        />
      </div>
    </div>
  );
}