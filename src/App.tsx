
import { createBrowserRouter, RouterProvider, Navigate } from "react-router"
import MainLayout from "./layouts/MainLayout"
import Reports from "./Page/ReportPage/MainReportPage"
import QRGenerator from "./Page/QRPage/MainQrPage"
import MainRecipientsPage from "./Page/RecipientsPage/MainRecipientsPage"
import Pruebasdeshadcn from "./pruebasdeshadcn"
// Vistas temporales (puedes reemplazar por tus componentes reales)


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Pruebasdeshadcn/> },
      { path: "reports", element: <Reports /> },
      { path: "email-settings", element: <MainRecipientsPage/> },
      { path: "generate-qr", element: <QRGenerator/> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
