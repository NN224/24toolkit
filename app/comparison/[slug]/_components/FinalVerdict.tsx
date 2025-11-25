interface FinalVerdictProps {
  verdict: string
  winner?: string
}

export default function FinalVerdict({ verdict, winner }: FinalVerdictProps) {
  return (
    <div style={{ marginTop: "5rem" }}>
      <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "2rem", textAlign: "center" }}>Final Verdict</h2>

      <div
        style={{
          padding: "3rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {winner && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#FFD700",
              color: "#000",
              padding: "0.5rem 1.5rem",
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>👑</span>
            Winner: {winner}
          </div>
        )}

        <p
          style={{
            fontSize: "1.2rem",
            lineHeight: 1.8,
            marginTop: winner ? "2rem" : "0",
          }}
        >
          {verdict}
        </p>
      </div>
    </div>
  )
}
