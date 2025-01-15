
/*
 * :file description:
 * :name: /shadertoy/src/pages/xccbrx/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-09 19:13:23
 * :last editor: 张德志
 * :date last edited: 2025-01-11 11:39:14
 */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Xsfgrn: React.FC = () => {
  const dom = useRef<any>();

  useEffect(() => {

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define the shader material
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
    iTime: { value: 0.0 }
  },
  fragmentShader: `
    uniform vec3 iResolution;
    uniform float iTime;

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 p = (2.0 * fragCoord - iResolution.xy) / min(iResolution.y, iResolution.x);

        // background color
        vec3 bcol = vec3(1.0, 0.8, 0.7 - 0.07 * p.y) * (1.0 - 0.25 * length(p));

        // animate
        float tt = mod(iTime, 1.5) / 1.5;
        float ss = pow(tt, 0.2) * 0.5 + 0.5;
        ss = 1.0 + ss * 0.5 * sin(tt * 6.2831 * 3.0 + p.y * 0.5) * exp(-tt * 4.0);
        p *= vec2(0.5, 1.5) + ss * vec2(0.5, -0.5);

        // shape
        p.y -= 0.25;
        float a = atan(p.x, p.y) / 3.141593;
        float r = length(p);
        float h = abs(a);
        float d = (13.0 * h - 22.0 * h * h + 10.0 * h * h * h) / (6.0 - 5.0 * h);

        // color
        float s = 0.75 + 0.75 * p.x;
        s *= 1.0 - 0.4 * r;
        s = 0.3 + 0.7 * s;
        s *= 0.5 + 0.5 * pow(1.0 - clamp(r / d, 0.0, 1.0), 0.1);
        vec3 hcol = vec3(1.0, 0.4 * r, 0.3) * s;

        vec3 col = mix(bcol, hcol, smoothstep(-0.01, 0.01, d - r));

        fragColor = vec4(col, 1.0);
    }

    void main() {
        vec4 color;
        mainImage(color, gl_FragCoord.xy);
        gl_FragColor = color;
    }
  `,
});

// Create a plane geometry and add it to the scene
const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const plane = new THREE.Mesh(geometry, shaderMaterial);
scene.add(plane);

// Resize handler
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  shaderMaterial.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  // Update the time uniform
  shaderMaterial.uniforms.iTime.value = clock.getElapsedTime();

  renderer.render(scene, camera);
}

animate();



  }, []);

  return <div ref={dom} />;
};

export default Xsfgrn;
