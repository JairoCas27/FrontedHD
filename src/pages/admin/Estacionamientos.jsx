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

}