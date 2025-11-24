interface QuickComparisonTableProps {
  optionA: {
    name: string
    pros: string[]
  }
  optionB: {
    name: string
    pros: string[]
  }
}

export default function QuickComparisonTable({ optionA, optionB }: QuickComparisonTableProps) {
  return (
    <div style={{ marginTop: "3rem" }}>
      <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem", textAlign: "center" }}>
        Quick Comparison
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div
          style={{
            padding: "2.5rem",
            border: "3px solid #000",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "8px 8px 0 rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", fontWeight: 700, color: "#667eea" }}>
            {optionA.name}
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {optionA.pros.map((pro, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "1rem",
                  paddingLeft: "2rem",
                  position: "relative",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "#4CAF50",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            padding: "2.5rem",
            border: "3px solid #000",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "8px 8px 0 rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", marginBottom: "1.5rem", fontWeight: 700, color: "#764ba2" }}>
            {optionB.name}
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {optionB.pros.map((pro, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "1rem",
                  paddingLeft: "2rem",
                  position: "relative",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "#4CAF50",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
