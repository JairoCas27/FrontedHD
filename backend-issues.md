# Problemas del Backend que NO se pueden resolver desde el Frontend

## 1. Propietarios & Agentes de Seguridad — Edición de Condominio

- **`PUT /api/super-admin/administrators/{id}`** no acepta `idCondominio` — el condominio debe asignarse por separado vía `PUT /api/super-admin/administrators/{id}/assign-condo`
- **`PUT /api/super-admin/administrators/{id}/assign-condo`** no permite desasignar (`null`), solo reasignar a otro condominio. Enviar `null` devuelve error `"no puede ser null"`

## 2. Departamentos — Cambio de Propietario

- **`PUT /api/admin/apartments/{id}/assign-owner`** solo funciona si el apto NO tiene propietario. Si ya tiene uno, devuelve 400. **No existe un endpoint para cambiar de propietario** — no se puede desasignar el actual y asignar uno nuevo

## 3. Estructura

- **No devuelve datos de contacto del propietario** — `GET /api/admin/structure` solo incluye `idPropietario` sin nombre, email ni teléfono
- **Un solo endpoint DELETE para torres, pisos y departamentos** — `DELETE /api/admin/structure/nodes/{id}?type=TORRE|PISO|APARTAMENTO` en lugar de endpoints separados

## 4. Bienes Comunes

- **No existe `DELETE /api/admin/assets/{id}` en el Swagger** — no hay endpoint documentado para eliminar un bien. El frontend lo intenta igual, pero devuelve 500
- **No existe endpoint para actualizar tipoVehiculo/capacidadMaxima de un asset** — `PUT /api/admin/assets/{id}/status` solo maneja `tipo/estado/disponible`. Se usa `PUT /api/admin/assets/{id}` para el resto de campos

## 5. Usuarios Globales

- **No existe DELETE real para usuarios no-admin** — `PATCH /api/super-admin/users/{id}/status` con `{ activo: false }` es solo desactivación lógica
- **No hay filtro por rol en el backend** — `GET /api/super-admin/users` no acepta `?rol=`, el frontend filtra client-side

## 6. Administradores

- **Crear admin no asigna condominio automáticamente** — requiere POST separado a `assignAdministratorCondo`
- **No permite desasignar condominio** — solo cambiar a otro, nunca dejar sin condominio

## 7. General

- **Respuestas inconsistentes entre endpoints** — algunos devuelven array plano, otros `{ items: [] }`, `{ content: [] }`, `{ data: [] }`
- **Departamentos no incluyen estacionamiento asignado** — el objeto departamento no trae el ID del parking vinculado