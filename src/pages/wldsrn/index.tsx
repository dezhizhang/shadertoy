/*
 * :file description:
 * :name: /shadertoy/src/pages/wldsrn/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-11 11:36:56
 * :last editor: 张德志
 * :date last edited: 2025-01-11 11:41:56
 */

import * as THREE from 'three';
import React, { useRef, useEffect } from 'react';

const Wldsrn: React.FC = () => {
  const dom = useRef<any>();

  useEffect(() => {
    // Create the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a); // Set background color of the scene

    // Create the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    // Create the WebGLRenderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Define the custom shader code
    // Define the custom shader code
    const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

    const fragmentShader = `
  #define MAX_STEPS 80
  varying vec2 vUv;

  uniform float iTime;
  uniform vec2 iResolution;

  // Functions copied from the GLSL shader code
  float sdSphere(vec3 pos, float size) {
    return length(pos) - size;
  }

  float sdBox(vec3 pos, vec3 size) {
    pos = abs(pos) - size;
    return max(max(pos.x, pos.y), pos.z);
  }

  float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    float m = p.x + p.y + p.z - s;
    vec3 q;
    if (3.0 * p.x < m) q = p.xyz;
    else if (3.0 * p.y < m) q = p.yzx;
    else if (3.0 * p.z < m) q = p.zxy;
    else return m * 0.57735027;
    float k = clamp(0.5 * (q.z - q.y + s), 0.0, s);
    return length(vec3(q.x, q.y - s + k, q.z - k));
  }

  float sdPlane(vec3 pos) {
    return pos.y;
  }

  mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, s, -s, c);
  }

  vec3 repeat(vec3 pos, vec3 span) {
    return abs(mod(pos, span)) - span * 0.5;
  }

  float getDistance(vec3 pos, vec2 uv) {
    vec3 originalPos = pos;

    for (int i = 0; i < 3; i++) {
      pos = abs(pos) - 4.5;
      pos.xz *= rotate(1.0);
      pos.yz *= rotate(1.0);
    }

    pos = repeat(pos, vec3(4.0));

    float d0 = abs(originalPos.x) - 0.1;
    float d1 = sdBox(pos, vec3(0.8));

    pos.xy *= rotate(mix(1.0, 2.0, abs(sin(iTime))));
    float size = mix(1.1, 1.3, (abs(uv.y) * abs(uv.x)));
    float d2 = sdSphere(pos, size);
    float dd2 = sdOctahedron(pos, 1.8);
    float ddd2 = mix(d2, dd2, abs(sin(iTime)));

    return max(max(d1, -ddd2), -d0);
  }

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

    // Camera setup
    vec3 cameraOrigin = vec3(0.0, 0.0, -10.0 + iTime * 4.0);
    vec3 cameraTarget = vec3(cos(iTime) + sin(iTime / 2.0) * 10.0, exp(sin(iTime)) * 2.0, 3.0 + iTime * 4.0);
    vec3 upDirection = vec3(0.0, 1.0, 0.0);
    vec3 cameraDir = normalize(cameraTarget - cameraOrigin);
    vec3 cameraRight = normalize(cross(upDirection, cameraOrigin));
    vec3 cameraUp = cross(cameraDir, cameraRight);
    vec3 rayDirection = normalize(cameraRight * p.x + cameraUp * p.y + cameraDir);

    float depth = 0.0;
    float ac = 0.0;
    vec3 rayPos = vec3(0.0);
    float d = 0.0;

    // Ray marching loop
    for (int i = 0; i < MAX_STEPS; i++) {
      rayPos = cameraOrigin + rayDirection * depth;
      d = getDistance(rayPos, p);

      if (abs(d) < 0.0001) {
        break;
      }

      ac += exp(-d * mix(5.0, 10.0, abs(sin(iTime))));
      depth += d;
    }

    vec3 col = vec3(0.2, 0.5, 0.9);  // Brighter color
    ac *= 2.0 * (iResolution.x / iResolution.y - abs(p.x));  // Increased multiplier
    vec3 finalCol = col * ac * 0.2;  // Brighter final color

    gl_FragColor = vec4(finalCol, 1.0);
    gl_FragColor.w = 1.0 - depth * 0.05;  // Less depth influence
  }
`;

    // The rest of the code remains the same as before

    // Create a plane geometry
    const geometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight,
    );

    // Create a shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true, // Ensure transparency is handled properly
      depthWrite: false, // Disable depth writing to avoid z-fighting
      depthTest: true, // Enable depth testing
    });

    // Create a mesh with the geometry and the shader material
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Create the animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Update the time uniform
      material.uniforms.iTime.value += 0.01;

      // Render the scene
      renderer.render(scene, camera);
    }

    // Adjust the size of the renderer and update uniforms on window resize
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.x = window.innerWidth;
      material.uniforms.iResolution.value.y = window.innerHeight;
    });

    // Start the animation loop
    animate();
  }, []);

  return <div ref={dom} />;
};

export default Wldsrn;
