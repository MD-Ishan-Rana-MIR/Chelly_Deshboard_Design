import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./../layout/MainLayout";
import LoginPage from "../authentication/LoginPage";
import EmailVerify from "../authentication/EmailVerify";
import OtpVerify from "../authentication/OtpVerify";
import ChangePassword from "../authentication/ChangePassword";
import UserManagementPage from "../page/user-management/UserManagementPage";

import PersonalInformation from "./../page/settings/PersonalInformation";
import ContactUs from "../page/settings/ContactUs";
import FAQs from "./../page/settings/FAQs";
import HomePage from "../page/home/HomePage";
import OrderManagement from "../page/order-management/OrderManagement";
import FoodManagement from "../page/food-management/FoodManagement";
import BlogManagement from "../page/blog-management/BlogManagement";
import TermCondiction from "../page/settings/TermCondiction";
import PrivacyPolicy from "../page/settings/PrivacyPolicy";
import PaymentGuidePage from "../page/settings/PaymentGuide";
import Notification from "../page/notification/Notification";
import NotFound from "./../components/ui/NotFoun";
import FoodUpload from "../page/food-management/FoodUpload";

export const router = createBrowserRouter([
  {
    path: "*",
    element: React.createElement(NotFound),
  },
  {
    path: "/",
    element: React.createElement(LoginPage),
  },
  {
    path: "/email-verify",
    element: React.createElement(EmailVerify),
  },
  {
    path: "/otp-verify",
    element: React.createElement(OtpVerify),
  },
  {
    path: "/change-password",
    element: React.createElement(ChangePassword),
  },
  {
    path: "/admin-dashboard",
    element: React.createElement(MainLayout),
    children: [
      {
        path: "",
        element: React.createElement(HomePage),
      },
      {
        path: "user-management",
        element: React.createElement(UserManagementPage),
      },
      {
        path: "order-management",
        element: React.createElement(OrderManagement),
      },
      {
        path: "food-management",
        element: React.createElement(FoodManagement),
      },
      {
        path: "food-upload",
        element: React.createElement(FoodUpload),
      },
      {
        path: "food-edit/:id",
        element: React.createElement(React.lazy(() => import('../page/food-management/FoodEdit'))),
      },
      {
        path: "settings/profile",
        element: React.createElement(PersonalInformation),
      },
      {
        path: "settings/contact",
        element: React.createElement(ContactUs),
      },
      {
        path: "settings/terms",
        element: React.createElement(TermCondiction),
      },
      {
        path: "settings/privacy",
        element: React.createElement(PrivacyPolicy),
      },
      {
        path: "settings/notification",
        element: React.createElement(Notification),
      },
      {
        path: "settings/faq",
        element: React.createElement(FAQs),
      },
      {
        path: "settings/payment",
        element: React.createElement(PaymentGuidePage),
      },
      {
        path: "blog-management",
        element: React.createElement(BlogManagement),
      },
      {
        path: "*",
        element: React.createElement(NotFound),
      },
    ],
  },
]);
