import { useState } from "react"
import { Outlet } from "react-router-dom"
import PrivateRoute from "../components/PrivateRoute"

export default function AppLayout({ Sidebar, allowedRole }) {
  const [isOpen, setIsOpen] = useState(true)

  const guard = PrivateRoute({ allowedRole })
  if (guard) return guard

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f1f5f9",
        color: "#2c2c2c",
      }}
    >
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        style={{
          flexGrow: 1,
          marginLeft: isOpen ? "240px" : "72px",
          transition: "margin-left 0.35s cubic-bezier(0.22,1,0.36,1)",
          padding: "2rem",
          minHeight: "100vh",
          overflowY: "auto",
          backgroundColor: "#f1f5f9",
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}