"use client"

import React, { useEffect, useState } from "react"

interface SuccessAnimationProps {
  show: boolean
  onComplete?: () => void
  message?: string
}

export default function SuccessAnimation({ show, onComplete, message = "Success!" }: SuccessAnimationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        if (onComplete) {
          setTimeout(onComplete, 500)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show || !visible) return null

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
          padding: "2rem 3rem",
          borderRadius: "20px",
          boxShadow: "0 16px 48px rgba(76, 175, 80, 0.4)",
          textAlign: "center",
          animation: "successPopIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      >
        {/* Success Checkmark */}
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 1.5rem",
            position: "relative",
          }}
        >
          {/* Circle */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "checkmarkCircle 0.6s ease-in-out",
            }}
          >
            {/* Checkmark */}
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              style={{
                animation: "checkmarkDraw 0.6s ease-in-out 0.3s both",
              }}
            >
              <path
                d="M 14 25 L 22 33 L 36 19"
                stroke="#4CAF50"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="50"
                strokeDashoffset="50"
                style={{
                  animation: "checkmarkPath 0.6s ease-in-out 0.3s forwards",
                }}
              />
            </svg>
          </div>

          {/* Confetti Effect */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                background: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"][i % 4],
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-60px)`,
                opacity: 0,
                animation: `confettiPop 0.8s ease-out ${i * 0.1}s forwards`,
              }}
            />
          ))}
        </div>

        {/* Message */}
        <p
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#fff",
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {message}
        </p>
      </div>

      <style jsx>{`
        @keyframes successPopIn {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes checkmarkCircle {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmarkDraw {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes checkmarkPath {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes confettiPop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-60px) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(-80px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-100px) scale(0.5);
          }
        }
      `}</style>
    </div>
  )
}

