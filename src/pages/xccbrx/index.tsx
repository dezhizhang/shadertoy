/*
 * :file description:
 * :name: /shadertoy/src/pages/xccbrx/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-09 19:13:23
 * :last editor: 张德志
 * :date last edited: 2025-01-09 19:22:15
 */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Xccbrx: React.FC = () => {
  const dom = useRef<any>();

  useEffect(() => {


    // Vertex Shader
    const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;
    
    // Fragment Shader
    const fragmentShader = `
    uniform vec2 iResolution;
    uniform float iTime;
    
    varying vec2 vUv;
    
    // SDF Circle Function
    float sdCircle(vec2 p, float r) {
        return length(p) - r;
    }
    
    // Effect 1
    vec4 effect_1(vec2 uv) {
        float c = length(uv);
        c = abs(sin(c * 6.0 - iTime) / 6.0);
        c = smoothstep(0.0, 0.125, c);
    
        return vec4(vec3(1.0 - c), 1.0);
    }
    
    // Effect 2
    vec4 effect_2(vec2 uv) {
        vec3 color = vec3(1.0, 2.0, 4.0);
    
        float c = length(uv);
        c = abs(sin(c * 2.0 - iTime) / 4.0);
        c = 0.0125 / c;
    
        color *= c;
    
        return vec4(color, 1.0);
    }
    
    void main() {
        vec2 uv = vUv;
        float ratio = iResolution.x / iResolution.y;
    
        vec2 center = vec2(0.5, 0.5); // Center position
    
        uv -= center; // Center the UV coordinates
        uv *= 2.0;    // Normalize
        uv.x *= ratio;
    
        // Choose the effect (effect_1 or effect_2)
        gl_FragColor = effect_2(uv);
    }
    `;
    
    // Uniforms setup
    const uniforms = {
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iTime: { value: 0 },
    };
    
    // Shader Material
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
    });
    
    // Create a plane to apply the shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add the mesh to the scene
    const scene = new THREE.Scene();
    scene.add(mesh);
    
    // Camera setup
    const camera = new THREE.Camera();
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Animation loop
    function animate() {
        uniforms.iTime.value += 0.05; // Update time
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    animate();
    
  }, []);

  return <div ref={dom} />;
};


export default Xccbrx;
