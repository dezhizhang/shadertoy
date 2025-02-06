/*
 * :file description:
 * :name: /shadertoy/src/pages/xisbz1/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-02-06 17:42:02
 * :last editor: 张德志
 * :date last edited: 2025-02-06 17:43:17
 */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Xisbz1:React.FC = () => {
    const dom = useRef<any>();
    useEffect(() => {
      const snowflakeShader = {
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(1, 1) }
        },

        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,

        fragmentShader: `
          precision highp float;
          varying vec2 vUv;
          uniform vec2 iResolution;
          uniform float iTime;

          #define PI2 6.28
          #define PI 3.1416

          vec2 p_to_pc(vec2 p) {
            return vec2(atan(p.y, p.x), length(p));
          }

          vec2 pc_to_p(vec2 pc) {
            return vec2(pc.y * cos(pc.x), pc.y * sin(pc.x));
          }

          vec2 fieldA(vec2 pc) {
            pc.y += 0.02 * floor(cos(pc.x * 6.0) * 5.0);
            pc.y += 0.01 * floor(10.0 * cos(pc.x * 30.0));
            pc.y += 0.5 * cos(pc.y * 10.0);
            return pc;
          }

          vec2 fieldB(vec2 pc, float f) {
            pc.y += 0.1 * cos(pc.y * 100.0 + 10.0);
            pc.y += 0.1 * cos(pc.y * 20.0 + f);
            pc.y += 0.04 * cos(pc.y * 10.0 + 10.0);
            return pc;
          }

          vec4 snow_flake(vec2 p, float f) {
            vec4 col = vec4(0.0);
            vec2 pc = p_to_pc(p * 10.0);
            pc = fieldA(fieldB(pc, f));
            p = pc_to_p(pc);
            float d = length(p);
            if(d < 0.3) {
              col.rgba += vec4(1.0);
            }
            return col;
          }

          vec4 snow(vec2 p) {
            vec4 col = vec4(0.0);
            float time = iTime / 2.0;
            p.y += 2.0 * time;
            p = fract(p + 0.5) - 0.5;
            p *= 1.0;
            p.x += 0.01 * cos(p.y * 3.0 + p.x * 3.0 + time * PI2);

            col += snow_flake(p, 1.0);
            col += snow_flake(p + vec2(0.2, -0.1), 4.0);
            col += snow_flake(p * 2.0 + vec2(-0.4, -0.5), 5.0);
            col += snow_flake(p * 1.0 + vec2(-0.2, 0.4), 9.0);
            col += 2.0 * snow_flake(p * 1.0 + vec2(0.4, -0.4), 5.0);
            col += snow_flake(p * 1.0 + vec2(-1.2, 1.2), 9.0);
            col += snow_flake(p * 1.0 + vec2(2.4, -1.2), 5.0);
            col += snow_flake(p * 1.0 + vec2(-1.2, 1.1), 9.0);

            return col;
          }

          void main() {
            vec2 uv = (vUv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0) * 2.0;
            vec4 col = vec4(0.2, 0.4, 0.7, 1.0);

            col += 0.3 * snow(uv * 2.0);
            col += 0.2 * snow(uv * 4.0 + vec2(iTime / 2.0, 0.0));
            col += 0.1 * snow(uv * 8.0);

            gl_FragColor = col;
          }
        `
      };

      // 使用示例
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      dom.current.appendChild(renderer.domElement);

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        fragmentShader: snowflakeShader.fragmentShader,
        vertexShader: snowflakeShader.vertexShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        }
      });

      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      camera.position.z = 1;

      function animate() {
        requestAnimationFrame(animate);
        material.uniforms.iTime.value = performance.now() / 1000;
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
      }

      animate();

      // 处理窗口大小变化
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
      });
    },[])
  return <div ref={dom}/>
}

export default Xisbz1;
