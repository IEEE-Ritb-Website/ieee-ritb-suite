import { useRef, useEffect } from 'react';
import './GradientOrb.css';
import { isLowEndDevice, prefersReducedMotion } from '@/utils/deviceDetection';

// Helper to convert hex to a normalized RGB array [r, g, b]
const hexToRgb = (hex: string): [number, number, number] => {
  if (!hex.startsWith('#')) return [0, 0, 0];
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return [r / 255, g / 255, b / 255];
};

const vertexShaderSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;

  // 2D Random function
  float random (vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // 2D Noise function
  float noise (vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // Animate and distort the coordinate space
    vec2 pos = st;
    pos.x += noise(pos + u_time * 0.1) * 0.1;
    pos.y += noise(pos + u_time * 0.15) * 0.1;

    // Add mouse interaction
    float mouse_dist = distance(st, u_mouse);
    pos.x += (u_mouse.x - st.x) * 0.1 / (mouse_dist + 0.1);
    pos.y += (u_mouse.y - st.y) * 0.1 / (mouse_dist + 0.1);

    // Create the plasma pattern
    float n = noise(pos * 3.0 + u_time * 0.2);
    
    // Mix colors
    vec3 color = mix(u_color1, u_color2, smoothstep(0.3, 0.7, n));
    color = mix(color, u_color3, smoothstep(0.6, 0.9, n));

    // Create the circular orb shape
    float d = distance(st, vec2(0.5, 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0));
    float alpha = 1.0 - smoothstep(0.2, 0.5, d);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function GradientOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (isLowEndDevice() || prefersReducedMotion()) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const computedStyle = getComputedStyle(canvas);
    const color1 = hexToRgb(computedStyle.getPropertyValue('--color1').trim());
    const color2 = hexToRgb(computedStyle.getPropertyValue('--color2').trim());
    const color3 = hexToRgb(computedStyle.getPropertyValue('--color3').trim());

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource)!;
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)!;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseUniformLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
    const color1UniformLocation = gl.getUniformLocation(program, 'u_color1');
    const color2UniformLocation = gl.getUniformLocation(program, 'u_color2');
    const color3UniformLocation = gl.getUniformLocation(program, 'u_color3');

    let animationFrameId: number;
    const startTime = Date.now();

    const render = () => {
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(mouseUniformLocation, mouse.current.x, 1.0 - mouse.current.y);
      gl.uniform1f(timeUniformLocation, (Date.now() - startTime) * 0.0005);
      gl.uniform3fv(color1UniformLocation, color1);
      gl.uniform3fv(color2UniformLocation, color2);
      gl.uniform3fv(color3UniformLocation, color3);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = (e.clientX - rect.left) / rect.width;
        mouse.current.y = (e.clientY - rect.top) / rect.height;
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="gradient-orb-canvas" aria-hidden="true" />;
}