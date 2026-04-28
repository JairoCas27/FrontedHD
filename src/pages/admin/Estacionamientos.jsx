import { useState, useMemo } from 'react'
import { FiMapPin, FiFilter, FiX } from "react-icons/fi"
import { Card, Row, Col, Button, Badge, Modal, Form, Pagination, InputGroup } from 'react-bootstrap'

// Configuración de plazas
const TOTAL_PLAZAS = 342
const OCUPADAS = 267
const DISPONIBLES = 45
const MANTENCION = 30

// Generar espacios automáticamente
const generarEspacios = () => {
  const espacios = []
  const bloques = ['A', 'B', 'C', 'D', 'E', 'F']
  const plazasPorBloque = Math.floor(TOTAL_PLAZAS / bloques.length)
  const residuo = TOTAL_PLAZAS % bloques.length

  let contadorOcupados = 0
  let contadorDisponibles = 0
  let contadorMantención = 0

  for (let i = 0; i < bloques.length; i++) {
    const letra = bloques[i]
    let plazasEnBloque = plazasPorBloque
    if (i < residuo) plazasEnBloque++

    for (let j = 1; j <= plazasEnBloque; j++) {
      let estado
      let residente = null
      let vehiculo = null

      // Asignar estados según los totales deseados
      if (contadorOcupados < OCUPADAS) {
        estado = 'Ocupado'
        residente = `Residente ${Math.floor(Math.random() * 100) + 1}`
        vehiculo = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 900) + 100}`
        contadorOcupados++
      } else if (contadorMantención < MANTENCION) {
        estado = 'Mantención'
        contadorMantención++
      } else {
        estado = 'Disponible'
        contadorDisponibles++
      }

      espacios.push({
        id: espacios.length + 1,
        numero: `${letra}${j.toString().padStart(2, '0')}`,
        bloque: letra,
        estado: estado,
        residente: residente,
        vehiculo: vehiculo,
      })
    }
  }

  return espacios
}

export default function Estacionamientos() {
  const [espacios] = useState(generarEspacios())
  const [showModal, setShowModal] = useState(false)
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null)
  const [formData, setFormData] = useState({ residente: '', vehiculo: '', estado: 'Ocupado' })
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtroBloque, setFiltroBloque] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const plazasPorPagina = 24

  // Calcular estadísticas
  const totalPlazas = espacios.length
  const plazasOcupadas = espacios.filter(e => e.estado === 'Ocupado').length
  const plazasDisponibles = espacios.filter(e => e.estado === 'Disponible').length
  const plazasMantención = espacios.filter(e => e.estado === 'Mantención').length
  const porcentajeOcupacion = Math.round((plazasOcupadas / totalPlazas) * 100)

  // Obtener lista única de bloques
  const bloques = ['todos', ...new Set(espacios.map(e => e.bloque))]

  // Aplicar filtros
  const espaciosFiltrados = useMemo(() => {
    let resultado = espacios
    
    if (filtroBloque !== 'todos') {
      resultado = resultado.filter(e => e.bloque === filtroBloque)
    }
    
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(e => e.estado === filtroEstado)
    }
    
    return resultado
  }, [espacios, filtroBloque, filtroEstado])

  // Calcular estadísticas de los filtrados
  const filtradosOcupados = espaciosFiltrados.filter(e => e.estado === 'Ocupado').length
  const filtradosDisponibles = espaciosFiltrados.filter(e => e.estado === 'Disponible').length
  const filtradosMantención = espaciosFiltrados.filter(e => e.estado === 'Mantención').length

  // Paginación
  const indexUltimo = paginaActual * plazasPorPagina
  const indexPrimero = indexUltimo - plazasPorPagina
  const espaciosPaginados = espaciosFiltrados.slice(indexPrimero, indexUltimo)
  const totalPaginas = Math.ceil(espaciosFiltrados.length / plazasPorPagina)

  // Resetear página cuando cambian los filtros
  const handleFilterChange = (tipo, valor) => {
    setPaginaActual(1)
    if (tipo === 'bloque') {
      setFiltroBloque(valor)
    } else {
      setFiltroEstado(valor)
    }
  }

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltroBloque('todos')
    setFiltroEstado('todos')
    setPaginaActual(1)
  }

  // Función para manejar cambios en el formulario
  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Disponible': return 'success'
      case 'Ocupado': return 'danger'
      case 'Mantención': return 'warning'
      default: return 'secondary'
    }
  }

  const getEstadoIcono = (estado) => {
    switch(estado) {
      case 'Disponible': return '🟢'
      case 'Ocupado': return '🔴'
      case 'Mantención': return '🟡'
      default: return '⚪'
    }
  }

  // Función para abrir el modal con los datos del espacio seleccionado
  const handleEspacioClick = (espacio) => {
    setEspacioSeleccionado(espacio)
    setFormData({
      residente: espacio.residente || '',
      vehiculo: espacio.vehiculo || '',
      estado: espacio.estado
    })
    setShowModal(true)
  }

  // Función para actualizar el espacio (simulado)
  const handleUpdateEspacio = () => {
    // Actualizar el espacio en el array (simulado)
    const index = espacios.findIndex(e => e.id === espacioSeleccionado.id)
    if (index !== -1) {
      espacios[index] = { ...espacios[index], ...formData }
    }
    setShowModal(false)
  }

  const handlePageChange = (pageNumber) => {
    setPaginaActual(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

    return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
            Estacionamientos
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Gestión de espacios de estacionamiento
          </p>
        </div>
        <div>
          <Badge bg="danger" className="me-2">Ocupados: {plazasOcupadas}</Badge>
          <Badge bg="success" className="me-2">Disponibles: {plazasDisponibles}</Badge>
          <Badge bg="warning">Mantención: {plazasMantención}</Badge>
        </div>
      </div>

      {/* Tarjeta de resumen */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm border-danger">
            <Card.Body>
              <h3 className="text-danger mb-0">{plazasOcupadas}</h3>
              <small className="text-muted">Plazas Ocupadas</small>
              <div className="progress mt-2" style={{ height: '5px' }}>
                <div className="progress-bar bg-danger" style={{ width: `${(plazasOcupadas / totalPlazas) * 100}%` }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <h3 className="text-success mb-0">{plazasDisponibles}</h3>
              <small className="text-muted">Plazas Disponibles</small>
              <div className="progress mt-2" style={{ height: '5px' }}>
                <div className="progress-bar bg-success" style={{ width: `${(plazasDisponibles / totalPlazas) * 100}%` }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm border-warning">
            <Card.Body>
              <h3 className="text-warning mb-0">{plazasMantención}</h3>
              <small className="text-muted">En Mantención</small>
              <div className="progress mt-2" style={{ height: '5px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${(plazasMantención / totalPlazas) * 100}%` }}></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm bg-primary text-white">
            <Card.Body>
              <h3 className="mb-0">{totalPlazas}</h3>
              <small>Total de Plazas</small>
              <small className="d-block mt-1">Ocupación: {porcentajeOcupacion}%</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
}