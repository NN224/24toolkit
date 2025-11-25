"use client"

import React from "react"

export default function ComparisonLoadingSkeleton() {
  return (
    <div style={{ marginTop: "3rem", animation: "fadeIn 0.5s ease-in" }}>
      {/* Header Skeleton */}
      <div
        style={{
          padding: "2.5rem",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          border: "3px solid var(--border)",
          marginBottom: "2rem",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "300px",
              height: "40px",
              background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
              backgroundSize: "200% 100%",
              borderRadius: "8px",
              margin: "0 auto 1rem",
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div
            style={{
              width: "200px",
              height: "20px",
              background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
              backgroundSize: "200% 100%",
              borderRadius: "8px",
              margin: "0 auto",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>

        {/* Scores Skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "2.5rem",
            alignItems: "center",
            marginBottom: "2.5rem",
            padding: "2rem",
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            borderRadius: "20px",
            border: "2px solid #e9ecef",
          }}
        >
          {/* Product A Skeleton */}
          <div
            style={{
              textAlign: "center",
              padding: "1.5rem",
              background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
              borderRadius: "16px",
              border: "3px solid #e0e0e0",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "60px",
                background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                borderRadius: "8px",
                margin: "0 auto 1rem",
                animation: "shimmer 1.5s infinite",
              }}
            />
            <div
              style={{
                width: "100%",
                height: "16px",
                background: "#e0e0e0",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "20px",
                background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                borderRadius: "8px",
                margin: "0 auto",
                animation: "shimmer 1.5s infinite",
              }}
            />
          </div>

          <div style={{ fontSize: "2.5rem", opacity: 0.3, color: "#666" }}>VS</div>

          {/* Product B Skeleton */}
          <div
            style={{
              textAlign: "center",
              padding: "1.5rem",
              background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
              borderRadius: "16px",
              border: "3px solid #e0e0e0",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "60px",
                background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                borderRadius: "8px",
                margin: "0 auto 1rem",
                animation: "shimmer 1.5s infinite",
              }}
            />
            <div
              style={{
                width: "100%",
                height: "16px",
                background: "#e0e0e0",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <div
              style={{
                width: "120px",
                height: "20px",
                background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                borderRadius: "8px",
                margin: "0 auto",
                animation: "shimmer 1.5s infinite",
              }}
            />
          </div>
        </div>

        {/* Summary Skeleton */}
        <div
          style={{
            padding: "2rem",
            background: "linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)",
            borderRadius: "12px",
            border: "2px solid #ffc107",
            marginTop: "1.5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "20px",
              background: "linear-gradient(90deg, #ffe69c 25%, #fff3cd 50%, #ffe69c 75%)",
              backgroundSize: "200% 100%",
              borderRadius: "8px",
              marginBottom: "0.75rem",
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div
            style={{
              width: "90%",
              height: "20px",
              background: "linear-gradient(90deg, #ffe69c 25%, #fff3cd 50%, #ffe69c 75%)",
              backgroundSize: "200% 100%",
              borderRadius: "8px",
              marginBottom: "0.75rem",
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div
            style={{
              width: "85%",
              height: "20px",
              background: "linear-gradient(90deg, #ffe69c 25%, #fff3cd 50%, #ffe69c 75%)",
              backgroundSize: "200% 100%",
              borderRadius: "8px",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              padding: "2.5rem",
              border: "4px solid #e0e0e0",
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              borderRadius: "20px",
              boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: "150px",
                height: "30px",
                background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                animation: "shimmer 1.5s infinite",
              }}
            />
            {[1, 2, 3, 4, 5].map((j) => (
              <div
                key={j}
                style={{
                  width: "100%",
                  height: "16px",
                  background: "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
                  backgroundSize: "200% 100%",
                  borderRadius: "8px",
                  marginBottom: "0.75rem",
                  animation: "shimmer 1.5s infinite",
                  animationDelay: `${j * 0.1}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}

