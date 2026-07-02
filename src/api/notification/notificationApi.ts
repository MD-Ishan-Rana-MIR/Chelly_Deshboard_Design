import type { NotificationItem } from "../../lib/type/type";
import { baseApi } from "../../router/base-api/baseApi";
// Define structural interfaces matching your exact API pagination wrappers
interface PaginationMetaLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationMetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface NotificationApiResponse {
  data: NotificationItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
}

interface GetNotificationsArgs {
  page: number;
  perPage: number;
}
export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationApiResponse,
      GetNotificationsArgs
    >({
      query: ({ page = 1, perPage = 10 }) => ({
        url: "/notifications",
        method: "GET",
        params: {
          page,
          per_page: perPage,
        },
      }),
      providesTags: ["Notification"],
    }),
    markSingleNotificationAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/mark-as-read`,
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllNotificationsAsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/mark-all-as-read",
        method: "POST",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

// 3. Export the auto-generated query hook
export const {
  useGetNotificationsQuery,
  useMarkSingleNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation
} = notificationApi;
