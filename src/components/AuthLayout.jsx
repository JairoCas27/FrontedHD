import { useEffect, useState } from "react"
import AuthLeft from "./AuthLeft"
import AuthRight from "./AuthRight"

function AuthLayout({ bgImageLeft, bgImageRight, bgLeftOpacity, bgRightOpacity, accentColor, accentColorDark, heroTitle, heroTitleAccent, heroDescription, onSubmit }) {
  const [phase, setPhase] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)"

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50)
    const t2 = setTimeout(() => setPhase(2), 250)
    const t3 = setTimeout(() => setPhase(3), 450)
    const t4 = setTimeout(() => setPhase(4), 620)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (isMobile) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", position: "relative", width: "100vw", height: "100dvh", overflow: "hidden" }}>
        <img
          src={bgImageRight}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }}
        />
        <div style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <AuthRight
            accentColor={accentColor}
            accentColorDark={accentColorDark}
            onSubmit={onSubmit}
            phase={phase}
            ease={ease}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", position: "relative", width: "100vw", height: "100dvh", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="clipLeft" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L0.49,0 C0.55,0.12 0.45,0.28 0.53,0.50 C0.59,0.65 0.47,0.82 0.49,1 L0,1 Z" />
          </clipPath>
          <clipPath id="clipRight" clipPathUnits="objectBoundingBox">
            <path d="M0.49,0 C0.55,0.12 0.45,0.28 0.53,0.50 C0.59,0.65 0.47,0.82 0.49,1 L1,1 L1,0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div style={{ position: "absolute", inset: 0, clipPath: "url(#clipLeft)", zIndex: 0, opacity: bgLeftOpacity ?? 1 }}>
        <img src={bgImageLeft} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, clipPath: "url(#clipRight)", zIndex: 0, opacity: bgRightOpacity ?? 1 }}>
        <img src={bgImageRight} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M49,0 C55,12 45,28 53,50 C59,65 47,82 49,100"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", height: "100dvh", overflow: "hidden" }}>
        <AuthLeft
          phase={phase}
          ease={ease}
          accentColor={accentColor}
          heroTitle={heroTitle}
          heroTitleAccent={heroTitleAccent}
          heroDescription={heroDescription}
        />
        <AuthRight
          accentColor={accentColor}
          accentColorDark={accentColorDark}
          onSubmit={onSubmit}
          phase={phase}
          ease={ease}
        />
      </div>
    </div>
  )
}

export default AuthLayout