import { Container, Row, Col, Card } from "react-bootstrap";

function PricingCards({ planes }) {
  return (
    <section className="py-5">
      <Container>
        <Row className="g-4 justify-content-center">
          {planes.map((p, i) => (
            <Col md={4} key={i}>
              <Card className="pricing-card h-100 border-0 text-center shadow-sm">
                <Card.Body className="p-4">
                  <h4 className="fw-bold">{p.nombre}</h4>

                  <h2 className="my-3 text-primary price">{p.precio}</h2>

                  <p className="text-muted">{p.descripcion}</p>

                  <ul className="list-unstyled mt-4 features">
                    {p.features.map((f, j) => (
                      <li key={j} className="mb-2 feature-item">
                        <i className="bi bi-check-circle-fill feature-icon"></i>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="btn btn-dark w-100 mt-3 btn-hover">
                    Elegir plan
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <style>{`
        .pricing-card{
          border-radius: 18px;
          transition: all .3s ease;
          background: #fff;
        }

        .pricing-card:hover{
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .price{
          transition: all .3s ease;
        }

        .pricing-card:hover .price{
          transform: scale(1.1);
          color: #2563eb;
        }

        .features{
          text-align: left;
          max-width: 240px;
          margin: 0 auto;
        }

        .feature-item{
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          color: #475569;
          transition: all .2s ease;
        }

        .feature-icon{
          color: #10b981;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .pricing-card:hover .feature-item{
          transform: translateX(4px);
        }

        .btn-hover{
          border-radius: 12px;
          transition: all .3s ease;
        }

        .btn-hover:hover{
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </section>
  );
}

export default PricingCards;