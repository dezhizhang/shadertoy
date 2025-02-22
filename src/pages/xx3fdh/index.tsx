/*
 * :file description: https://www.shadertoy.com/view/XX3fDH
 * :name: /shadertoy/src/pages/xx3fdh/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-02-22 19:04:16
 * :last editor: 张德志
 * :date last edited: 2025-02-22 19:09:30
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Xx3fdh: React.FC = () => {
  const dom = useRef<any>();
  useEffect(() => {
    // 使用示例
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);

    const flameShader = {
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
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
        #define NUM_OCTAVES 5
        varying vec2 vUv;
        uniform float time;
        uniform vec2 resolution;

        float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);
            float res = mix(
                mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
                mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), 
                u.y);
            return res*res;
        }

        float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
            for (int i = 0; i < NUM_OCTAVES; ++i) {
                v += a * noise(x);
                x = rot * x * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 shake = vec2(sin(time * 1.5) * 0.01, cos(time * 2.7) * 0.01);
            vec2 fragCoord = vUv * resolution;
            
            vec2 p = ((fragCoord + shake * resolution) - resolution * 0.5) / resolution.y;
            p *= mat2(8.0, -6.0, 6.0, 8.0);
            
            vec2 v;
            vec4 o = vec4(0.0);
            float f = 3.0 + fbm(p + vec2(time * 7.0, 0.0));
            
            for(float i = 0.0; i < 50.0; i++) {
                v = p + cos(i*i + (time + p.x*0.1)*0.03 + i*vec2(11.0,9.0)) *5.0 
                    + vec2(sin(time*4.0 + i)*0.005, cos(time*4.5 - i)*0.005);
                
                float tailNoise = fbm(v + vec2(time, i)) * (1.0 - (i/50.0));
                vec4 currentContribution = (cos(sin(i)*vec4(1.0,2.0,3.0,1.0)) +1.0) 
                    * exp(sin(i*i + time)) / length(max(v, vec2(v.x*f*0.02, v.y)));
                
                float thinnessFactor = smoothstep(0.0, 1.0, i/50.0);
                o += currentContribution * (1.0 + tailNoise*2.0) * thinnessFactor;
            }
            
            o = tanh(pow(o/1e2, vec4(1.5)));
            gl_FragColor = o;
        }
    `,
    };

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        ...flameShader,
        blending: THREE.AdditiveBlending,
        transparent: true,
      }),
    );

    scene.add(mesh);

    function animate() {
      mesh.material.uniforms.time.value = performance.now() / 1000;
      mesh.material.uniforms.resolution.value.set(
        window.innerWidth,
        window.innerHeight,
      );
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  }, []);
  return <div ref={dom} />;
};

export default Xx3fdh;
