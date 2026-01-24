"use client";

import { useEffect, useRef } from "react";

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

export default function MeteorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let meteors: Meteor[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createMeteor = () => {
      return {
        x: Math.random() * canvas.width * 1.5,
        y: Math.random() * canvas.height * -0.5,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 10 + 5,
        opacity: Math.random() * 0.5 + 0.2,
      };
    };

    const drawMeteors = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.02) {
        meteors.push(createMeteor());
      }

      meteors.forEach((meteor, index) => {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
          meteor.x, 
          meteor.y, 
          meteor.x - meteor.length, 
          meteor.y + meteor.length
        );
        gradient.addColorStop(0, `rgba(253, 230, 138, ${meteor.opacity})`);
        gradient.addColorStop(1, "rgba(253, 230, 138, 0)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.length, meteor.y + meteor.length);
        ctx.stroke();

        meteor.x -= meteor.speed;
        meteor.y += meteor.speed;

        if (meteor.x < -100 || meteor.y > canvas.height + 100) {
          meteors.splice(index, 1);
        }
      });

      animationFrameId = requestAnimationFrame(drawMeteors);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    drawMeteors();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{
        background: "radial-gradient(circle at center, #161e3d 0%, #0f172a 100%)",
      }}
    />
  );
}
