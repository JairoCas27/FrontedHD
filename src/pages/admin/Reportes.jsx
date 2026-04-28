import { useState } from 'react'
import { FiBarChart2, FiDownload, FiCalendar, FiPieChart } from "react-icons/fi"
import { Card, Row, Col, Button, Form, Table, Badge } from 'react-bootstrap'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Datos financieros en Soles Peruanos
const datosIngresos = [
  { mes: 'Ene', ingresos: 12500, egresos: 8900 },
  { mes: 'Feb', ingresos: 13200, egresos: 9100 },
  { mes: 'Mar', ingresos: 14100, egresos: 9500 },
  { mes: 'Abr', ingresos: 13800, egresos: 9300 },
  { mes: 'May', ingresos: 14500, egresos: 9800 },
  { mes: 'Jun', ingresos: 15200, egresos: 10100 },
]

// Datos para el gráfico de pastel
const datosAccesos = [
  { tipo: 'Residentes', cantidad: 1250, descripcion: 'Propietarios e inquilinos' },
  { tipo: 'Visitas', cantidad: 450, descripcion: 'Invitados de residentes' },
  { tipo: 'Proveedores', cantidad: 180, descripcion: 'Delivery, servicios, repartos' },
]

// Datos para el gráfico de barras de ocupación de estacionamientos
const datosEstacionamientos = [
  { estado: 'Ocupados', cantidad: 267, explicacion: 'Plazas con vehículo estacionado', color: '#dc3545' },
  { estado: 'Disponibles', cantidad: 45, explicacion: 'Plazas libres para usar', color: '#20c997' },
  { estado: 'Mantención', cantidad: 30, explicacion: 'Plazas en reparación o limpieza', color: '#ffc107' },
]

// Colores para el gráfico de pastel
const COLORS = ['#0d6efd', '#20c997', '#ffc107']

const totalPlazas = datosEstacionamientos.reduce((sum, item) => sum + item.cantidad, 0)
const porcentajeOcupacion = Math.round((datosEstacionamientos[0].cantidad / totalPlazas) * 100)

export default function Reportes() {
const [reporteSeleccionado, setReporteSeleccionado] = useState('accesos')

  const handleExportar = () => {
    alert('Función de exportación en desarrollo')
  }

  // Formatear moneda a Soles Peruanos
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

}