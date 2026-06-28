import { Building2, Home, Layers3, Car } from "lucide-react";
import colors from "../../theme/colors";

export default function ApartmentCard({ data }) {

    if (!data) return null;

    return (

        <div
            style={{
                background: colors.white,
                borderRadius: "30px",
                border: `1px solid ${colors.orangeBorder}`,
                padding: "2rem",
                boxShadow: "0 10px 20px rgba(0,0,0,.05)"
            }}
        >

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: "2rem"
                }}
            >

                <div
                    style={{
                        background: colors.orangeLight,
                        color: colors.orange,
                        padding: 12,
                        borderRadius: 16
                    }}
                >
                    <Building2 size={22}/>
                </div>

                <div>

                    <h3
                        style={{
                            margin:0,
                            color:colors.slate,
                            fontWeight:800
                        }}
                    >
                        Mi Apartamento
                    </h3>

                    <span
                        style={{
                            color:colors.slateLight
                        }}
                    >
                        Información general
                    </span>

                </div>

            </div>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
                    gap:"1rem"
                }}
            >

                <Item
                    icon={<Building2 size={18}/>}
                    titulo="Torre"
                    valor={data.torreNombre}
                />

                <Item
                    icon={<Layers3 size={18}/>}
                    titulo="Piso"
                    valor={data.pisoNumero}
                />

                <Item
                    icon={<Home size={18}/>}
                    titulo="Apartamento"
                    valor={data.numeroApartamento}
                />

                <Item
                    icon={<Car size={18}/>}
                    titulo="Vehículos"
                    valor={data.totalVehiculos}
                />

            </div>

        </div>

    );

}

function Item({ icon, titulo, valor }){

    return(

        <div
            style={{
                background:colors.background,
                borderRadius:20,
                padding:"1rem"
            }}
        >

            <div
                style={{
                    color:colors.orange,
                    marginBottom:10
                }}
            >
                {icon}
            </div>

            <div
                style={{
                    fontSize:13,
                    color:colors.slateLight
                }}
            >
                {titulo}
            </div>

            <div
                style={{
                    marginTop:5,
                    fontSize:22,
                    fontWeight:800,
                    color:colors.slate
                }}
            >
                {valor}
            </div>

        </div>

    );

}