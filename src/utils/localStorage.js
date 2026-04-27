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