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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
            Reportes
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Métricas y exportación de datos
          </p>
        </div>
        <Button variant="success" onClick={handleExportar}>
          <FiDownload className="me-2" /> Exportar
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Button
            variant={reporteSeleccionado === 'accesos' ? 'primary' : 'outline-primary'}
            className="w-100 py-3"
            onClick={() => setReporteSeleccionado('accesos')}
          >
            <FiBarChart2 size={20} className="mb-2 d-block mx-auto" />
            Reporte de Accesos
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant={reporteSeleccionado === 'financiero' ? 'primary' : 'outline-primary'}
            className="w-100 py-3"
            onClick={() => setReporteSeleccionado('financiero')}
          >
            <FiPieChart size={20} className="mb-2 d-block mx-auto" />
            Reporte Financiero (S/)
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant={reporteSeleccionado === 'estacionamientos' ? 'primary' : 'outline-primary'}
            className="w-100 py-3"
            onClick={() => setReporteSeleccionado('estacionamientos')}
          >
            <FiBarChart2 size={20} className="mb-2 d-block mx-auto" />
            Reporte Estacionamientos
          </Button>
        </Col>
      </Row>

      {/* Reporte de Accesos */}
      {reporteSeleccionado === 'accesos' && (
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Reporte de Accesos por Tipo de Persona</h6>
              <Form.Group className="d-flex gap-2">
                <Form.Control type="date" size="sm" style={{ width: '130px' }} />
                <Form.Control type="date" size="sm" style={{ width: '130px' }} />
              </Form.Group>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={8}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { dia: 'Lun', residentes: 145, visitas: 32, proveedores: 12 },
                    { dia: 'Mar', residentes: 178, visitas: 45, proveedores: 15 },
                    { dia: 'Mié', residentes: 210, visitas: 38, proveedores: 18 },
                    { dia: 'Jue', residentes: 192, visitas: 41, proveedores: 14 },
                    { dia: 'Vie', residentes: 225, visitas: 58, proveedores: 22 },
                    { dia: 'Sáb', residentes: 180, visitas: 72, proveedores: 10 },
                    { dia: 'Dom', residentes: 95, visitas: 48, proveedores: 5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="residentes" fill="#0d6efd" name="Residentes" />
                    <Bar dataKey="visitas" fill="#20c997" name="Visitas" />
                    <Bar dataKey="proveedores" fill="#ffc107" name="Proveedores" />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
              <Col md={4}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={datosAccesos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                    >
                      {datosAccesos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} accesos`, 'Cantidad']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Distribución total de accesos en el mes
                  </small>
                </div>
              </Col>
            </Row>
            <div className="mt-3 p-2 bg-light rounded">
              <small className="text-muted">
                <strong>¿Qué significa?</strong> El gráfico muestra la cantidad de accesos registrados,
                clasificados por tipo de persona: Residentes (propietarios/inquilinos),
                Visitas (invitados) y Proveedores (delivery, servicios, repartos).
              </small>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Reporte Financiero con Soles Peruanos */}
      {reporteSeleccionado === 'financiero' && (
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <h6 className="mb-0">Reporte Financiero - Fondo Común (Soles Peruanos)</h6>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={datosIngresos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `S/ ${value}`} />
                <Tooltip formatter={(value) => [`S/ ${value.toLocaleString()}`, '']} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#0d6efd" strokeWidth={2} name="Ingresos (Cuotas, alquileres, multas)" />
                <Line type="monotone" dataKey="egresos" stroke="#dc3545" strokeWidth={2} name="Egresos (Gastos operativos)" />
              </LineChart>
            </ResponsiveContainer>
            <Table className="mt-4" responsive>
              <thead className="table-light">
                <tr>
                  <th>Mes</th>
                  <th>Ingresos (S/)</th>
                  <th>Egresos (S/)</th>
                  <th>Balance (S/)</th>
                </tr>
              </thead>
              <tbody>
                {datosIngresos.map((item, index) => (
                  <tr key={index}>
                    <td>{item.mes}</td>
                    <td className="text-success">{formatCurrency(item.ingresos)}</td>
                    <td className="text-danger">{formatCurrency(item.egresos)}</td>
                    <td className="text-primary">{formatCurrency(item.ingresos - item.egresos)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="mt-3 p-2 bg-light rounded">
              <small className="text-muted">
                <strong>¿Qué representa?</strong> Los ingresos incluyen cuotas de mantenimiento, 
                alquiler de estacionamientos y multas. Los egresos incluyen vigilancia, 
                limpieza, mantenimiento y servicios básicos del condominio.
              </small>
            </div>
          </Card.Body>
        </Card>
      )}

       {/* Reporte de Estacionamientos */}
      {reporteSeleccionado === 'estacionamientos' && (
        <Card className="shadow-sm">
          <Card.Header className="bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Reporte de Estacionamientos - Estado de Ocupación</h6>
              <Badge bg="secondary">Total: {totalPlazas} plazas</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosEstacionamientos}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="cantidad"
                    >
                      {datosEstacionamientos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} plazas`, props.payload.estado]} />
                  </PieChart>
                </ResponsiveContainer>
              </Col>
              <Col md={6}>
                <div className="mt-4">
                  <h6 className="mb-3">Desglose por Estado</h6>
                  {datosEstacionamientos.map((item, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>
                          <span style={{ color: item.color }}>●</span> {item.estado}
                        </span>
                        <strong>{item.cantidad} plazas</strong>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ width: `${(item.cantidad / totalPlazas) * 100}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                      <small className="text-muted">{item.explicacion}</small>
                    </div>
                  ))}
                  
                  <div className="mt-4 p-3 bg-primary bg-opacity-10 rounded">
                    <h6 className="mb-1">Resumen General</h6>
                    <p className="mb-0 small">
                      Ocupación actual: <strong>{porcentajeOcupacion}%</strong><br />
                      Plazas totales: <strong>{totalPlazas}</strong><br />
                      Plazas disponibles: <strong>{datosEstacionamientos[1].cantidad}</strong>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
            <div className="mt-3 p-2 bg-light rounded">
              <small className="text-muted">
                <strong>¿Qué significa?</strong> El gráfico muestra el estado actual de todas las plazas de estacionamiento. 
                <strong>Ocupados:</strong> Plazas con vehículo estacionado.{" "}
                <strong>Disponibles:</strong> Plazas libres para usar.{" "}
                <strong>Mantención:</strong> Plazas fuera de servicio por reparación o limpieza.
              </small>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}