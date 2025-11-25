"use client"

export function ComparisonCardSkeleton() {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        padding: "1.5rem",
        borderRadius: "12px",
        border: "2px solid var(--border)",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
    >
      <div
        style={{
          height: "20px",
          background: "var(--bg-secondary)",
          borderRadius: "4px",
          marginBottom: "1rem",
          width: "60%",
        }}
      />
      <div
        style={{
          height: "16px",
          background: "var(--bg-secondary)",
          borderRadius: "4px",
          marginBottom: "0.5rem",
        }}
      />
      <div
        style={{
          height: "16px",
          background: "var(--bg-secondary)",
          borderRadius: "4px",
          width: "80%",
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          height: "48px",
          background: "var(--bg-secondary)",
          borderRadius: "4px",
          marginBottom: "0.5rem",
          width: "120px",
          margin: "0 auto 0.5rem",
        }}
      />
      <div
        style={{
          height: "20px",
          background: "var(--bg-secondary)",
          borderRadius: "4px",
          width: "150px",
          margin: "0 auto",
        }}
      />
    </div>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div style={{ padding: "60px 0" }}>
      <div className="container">
        <div
          style={{
            height: "40px",
            background: "var(--bg-secondary)",
            borderRadius: "8px",
            marginBottom: "2rem",
            width: "300px",
            margin: "0 auto 2rem",
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ComparisonCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
