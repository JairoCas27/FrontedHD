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

      {/* Filtros */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Label>
                <FiFilter className="me-1" /> Filtrar por Zona/Bloque
              </Form.Label>
              <Form.Select
                value={filtroBloque}
                onChange={(e) => handleFilterChange('bloque', e.target.value)}
              >
                <option value="todos">Todas las zonas</option>
                <option value="A">Zona A (Norte)</option>
                <option value="B">Zona B (Este)</option>
                <option value="C">Zona C (Sur)</option>
                <option value="D">Zona D (Oeste)</option>
                <option value="E">Zona E (Central)</option>
                <option value="F">Zona F (Visitas)</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>
                <FiFilter className="me-1" /> Filtrar por Estado
              </Form.Label>
              <Form.Select
                value={filtroEstado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="Ocupado">🔴 Ocupados</option>
                <option value="Disponible">🟢 Disponibles</option>
                <option value="Mantención">🟡 En Mantención</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Button 
                variant="outline-secondary" 
                onClick={limpiarFiltros}
                className="w-100"
              >
                <FiX className="me-1" /> Limpiar Filtros
              </Button>
            </Col>
          </Row>
          
          {/* Resumen de filtros aplicados */}
          {(filtroBloque !== 'todos' || filtroEstado !== 'todos') && (
            <div className="mt-3 pt-2 border-top">
              <small className="text-muted">
                <strong>Filtros aplicados:</strong>
                {filtroBloque !== 'todos' && <Badge bg="info" className="ms-2">Zona {filtroBloque}</Badge>}
                {filtroEstado !== 'todos' && <Badge bg="secondary" className="ms-2">{filtroEstado}</Badge>}
                <span className="ms-3">
                  Mostrando {espaciosFiltrados.length} de {totalPlazas} plazas
                </span>
                <span className="ms-2">
                  ({filtradosOcupados} ocupadas, {filtradosDisponibles} disponibles, {filtradosMantención} mantención)
                </span>
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Grid de estacionamientos */}
      {espaciosPaginados.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <FiMapPin size={48} className="text-muted mb-3 opacity-50" />
            <h5>No hay plazas que coincidan con los filtros</h5>
            <Button variant="outline-primary" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-3 mb-4">
            {espaciosPaginados.map((espacio) => (
              <Col key={espacio.id} xs={6} sm={4} md={3} lg={2}>
                <Card 
                  className={`text-center shadow-sm ${espacio.estado === 'Disponible' ? 'border-success' : espacio.estado === 'Mantención' ? 'border-warning' : 'border-danger'}`}
                  style={{ cursor: 'pointer', height: '100%' }}
                  onClick={() => handleEspacioClick(espacio)}
                >
                  <Card.Body>
                    <div className="mb-2">
                      <span style={{ fontSize: '1.2rem' }}>{getEstadoIcono(espacio.estado)}</span>
                    </div>
                    <h6 className="mb-1">
                      <strong>{espacio.numero}</strong>
                    </h6>
                    <Badge 
                      bg={getEstadoColor(espacio.estado)} 
                      style={{ fontSize: '0.7rem' }}
                    >
                      {espacio.estado}
                    </Badge>
                    {espacio.residente && (
                      <small className="d-block text-muted mt-1" style={{ fontSize: '0.65rem' }}>
                        {espacio.residente.split(' ')[0]}
                      </small>
                    )}
                    <small className="d-block text-muted" style={{ fontSize: '0.6rem' }}>
                      Zona {espacio.bloque}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={paginaActual === 1} />
                <Pagination.Prev onClick={() => handlePageChange(paginaActual - 1)} disabled={paginaActual === 1} />
                
                {[...Array(Math.min(5, totalPaginas))].map((_, index) => {
                  let pageNum
                  if (totalPaginas <= 5) {
                    pageNum = index + 1
                  } else if (paginaActual <= 3) {
                    pageNum = index + 1
                  } else if (paginaActual >= totalPaginas - 2) {
                    pageNum = totalPaginas - 4 + index
                  } else {
                    pageNum = paginaActual - 2 + index
                  }
                  
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === paginaActual}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  )
                })}
                
                <Pagination.Next onClick={() => handlePageChange(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                <Pagination.Last onClick={() => handlePageChange(totalPaginas)} disabled={paginaActual === totalPaginas} />
              </Pagination>
            </div>
          )}

          {/* Información de paginación */}
          <div className="text-center text-muted mt-2">
            <small>
              Mostrando {indexPrimero + 1} - {Math.min(indexUltimo, espaciosFiltrados.length)} de {espaciosFiltrados.length} plazas
              {filtroBloque !== 'todos' && ` (Zona ${filtroBloque})`}
              {filtroEstado !== 'todos' && ` - Estado: ${filtroEstado}`}
            </small>
          </div>
        </>
      )}

      {/* Modal para editar espacio de estacionamiento */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Espacio {espacioSeleccionado?.numero} - Zona {espacioSeleccionado?.bloque}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option value="Disponible">🟢 Disponible</option>
                <option value="Ocupado">🔴 Ocupado</option>
                <option value="Mantención">🟡 Mantención</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Residente/Propietario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del residente"
                value={formData.residente || ''}
                onChange={(e) => setFormData({ ...formData, residente: e.target.value })}
                disabled={formData.estado !== 'Ocupado'}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehículo (Placa)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Placa del vehículo"
                value={formData.vehiculo || ''}
                onChange={(e) => setFormData({ ...formData, vehiculo: e.target.value.toUpperCase() })}
                disabled={formData.estado !== 'Ocupado'}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateEspacio}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}