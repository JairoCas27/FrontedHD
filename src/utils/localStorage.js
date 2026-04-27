export const getUsuario = () => {
  return JSON.parse(localStorage.getItem("usuario")) || {
    nombre: "John Anderson",
    email: "john.anderson@example.com",
    telefono: "+51 923 123 457",
    rol: "Residente",
  };
};

export const setUsuario = (data) => {
  localStorage.setItem("usuario", JSON.stringify(data));
};

export const getVehiculos = () => {
  const data = JSON.parse(localStorage.getItem("vehiculos"));

  if (!data || data.length === 0) {
    const inicial = [
      {
        placa: "ABC-1234",
        modelo: "Toyota Camry 2022",
        color: "Plata",
        estado: "Activo",
      },
    ];
    localStorage.setItem("vehiculos", JSON.stringify(inicial));
    return inicial;
  }

  return data;
};
const resetear = () => {
  const dataInicial = [
    {
      placa: "ABC-1234",
      modelo: "Toyota Camry 2022",
      color: "Plata",
      estado: "Activo",
    },
    {
      placa: "XYZ-5678",
      modelo: "Honda CR-V 2023",
      color: "Negro",
      estado: "Activo",
    },
    {
      placa: "DEF-9012",
      modelo: "Mazda CX-5 2021",
      color: "Rojo",
      estado: "Activo",
    },
  ];

  setList(dataInicial);
  setVehiculos(dataInicial);
};
export const setVehiculos = (data) => {
  localStorage.setItem("vehiculos", JSON.stringify(data));
};
const datosCondominios = [
  {
    id: 1,
    nombre: "Jerarquía Residencial Central",
    ubicacion: "Puente Piedra",
    plan: "Premium",
    torres: [
      {
        id: "T-101",
        nombre: "Torre Esmeralda",
        pisos: [
          {
            nivel: 1,
            apartamentos: [
              { id: "A-1", numero: "101", metraje: 75, derecho_estacionamiento: true },
              { id: "A-2", numero: "102", metraje: 80, derecho_estacionamiento: false }
            ]
          },
          {
            nivel: 2,
            apartamentos: [
              { id: "A-3", numero: "201", metraje: 75, derecho_estacionamiento: true }
            ]
          }
        ]
      },
      {
        id: "T-102",
        nombre: "Torre Zafiro",
        pisos: [
          {
            nivel: 1,
            apartamentos: [
              { id: "A-4", numero: "101", metraje: 90, derecho_estacionamiento: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: "Residencial Las Torres",
    ubicacion: "Los Olivos",
    plan: "Pro",
    torres: []
  }
];

// Esto guardará los datos respetando la clave que usa tu Condominios.jsx
localStorage.setItem("jerarquia_residencial", JSON.stringify(datosCondominios));