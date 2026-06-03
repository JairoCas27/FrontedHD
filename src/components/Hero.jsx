function Hero({
  title,
  description,
  background,
  video,
  align = "center"
}) {
  const alignment =
    align === "left"
      ? "align-items-start text-start px-4 px-lg-5"
      : align === "right"
      ? "align-items-end text-end px-4 px-lg-5"
      : "align-items-center text-center px-4";

  return (
    <section
      className={`hero d-flex flex-column justify-content-center ${alignment} text-white`}
    >
      {video ? (
        <video autoPlay muted loop playsInline className="hero-video">
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${background})` }}
        />
      )}

      <div className="overlay" />

      <div className="position-relative hero-content">
        <h1 className="hero-title">{title}</h1>
        {description && <p className="hero-description">{description}</p>}
      </div>

      <style>{`
        .hero{
          position:relative;
          overflow:hidden;
          height:480px;
        }

        .hero-bg{
          position:absolute;
          inset:0;
          background-size:cover;
          background-position:center;
          transform:scale(1.08);
          animation: bgZoom 12s ease-in-out infinite alternate;
        }

        .hero-video{
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
          transform:scale(1.08);
          animation: bgZoom 12s ease-in-out infinite alternate;
        }

        .overlay{
          position:absolute;
          inset:0;
          background:rgba(0,0,0,0.55);
          z-index:1;
        }

        .hero-content{
          position:relative;
          z-index:2;
          animation: contentFloat 6s ease-in-out infinite;
          max-width:900px;
        }

        .hero-title{
          font-size:clamp(2rem,4vw,3.2rem);
          font-weight:800;
          margin-bottom:14px;
          opacity:0;
          transform:translateY(20px);
          animation: fadeUp 0.8s ease forwards;
        }

        .hero-description{
          font-size:clamp(1.1rem,2vw,1.5rem);
          line-height:1.7;
          max-width:750px;
          margin:0 auto;
          opacity:0;
          transform:translateY(20px);
          animation: fadeUp 0.8s ease forwards;
          animation-delay:0.3s;
          font-weight:300;
        }

        @keyframes fadeUp{
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        @keyframes bgZoom{
          from{
            transform:scale(1.08);
          }
          to{
            transform:scale(1.15);
          }
        }

        @keyframes contentFloat{
          0%,100%{
            transform:translateY(0);
          }
          50%{
            transform:translateY(-6px);
          }
        }

        @media (max-width: 768px){
          .hero{
            height:300px;
          }

          .hero-title{
            font-size:2.0rem;
            margin-bottom:10px;
          }

          .hero-description{
            font-size:1rem;
            line-height:1.5;
            max-width:90%;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;