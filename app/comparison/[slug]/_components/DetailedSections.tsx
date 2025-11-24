interface Section {
  title: string
  content: string
}

interface DetailedSectionsProps {
  sections: Section[]
}

export default function DetailedSections({ sections }: DetailedSectionsProps) {
  return (
    <div style={{ marginTop: "5rem" }}>
      <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "3rem", textAlign: "center" }}>
        Detailed Analysis
      </h2>

      {sections.map((section, index) => (
        <div
          key={index}
          style={{
            marginBottom: "3rem",
            padding: "2.5rem",
            background: index % 2 === 0 ? "#f8f9fa" : "#fff",
            borderRadius: "12px",
            border: "2px solid #e9ecef",
          }}
        >
          <h3
            style={{
              fontSize: "1.8rem",
              marginBottom: "1.5rem",
              fontWeight: 700,
              color: "#2c3e50",
            }}
          >
            {section.title}
          </h3>
          <p
            style={{
              lineHeight: 1.8,
              fontSize: "1.1rem",
              color: "#5a6c7d",
            }}
          >
            {section.content}
          </p>
        </div>
      ))}
    </div>
  )
}
