/*
 * :file description:
 * :name: /shadertoy/src/pages/tsjszh/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-02-05 17:58:20
 * :last editor: 张德志
 * :date last edited: 2025-02-05 23:16:38
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import React, { useRef, useEffect } from 'react';

const Tsjszh: React.FC = () => {
  const dom = useRef<any>();
  useEffect(() => {
    const scene = new THREE.Scene();

    let uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() }
  };

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    dom.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000);
    camera.position.set(100,100,100);
    camera.lookAt(scene.position);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec2 iResolution;
            uniform float iTime;
            varying vec2 vUv;

            float rect(vec2 uv, vec2 pos, float width, float height) {
                float square = (step(pos.x - width, uv.x) - step(pos.x + width, uv.x)) *
                               (step(pos.y - height, uv.y) - step(pos.y + height, uv.y));
                return square;
            }

            float Circle(vec2 uv, vec2 pos, float rad, float blur) {
                float d = length(uv - pos);
                float t = smoothstep(rad, rad - blur, d);
                return t;
            }

            void main() {
                vec3 red = vec3(0.8, 0.0, 0.0);
                vec3 white = vec3(1.0);
                vec3 yellow = vec3(0.9, 0.9, 0.3);
                vec3 blue = vec3(0.5, 0.8, 0.9);
                vec3 black = vec3(0.0);
                vec3 green = vec3(0.0, 1.0, 0.0);

                vec2 uv = vUv;
                uv -= 0.5;
                uv.x *= iResolution.x / iResolution.y;

                vec3 Mask = mix(black, vec3(3.0, 3.0, 0.0), Circle(uv, vec2(0.0, 0.01), 0.2, 0.01));

                Mask = mix(Mask, vec3(3.0, 3.0, 0.0), Circle(uv, vec2(-0.13, 0.15), 0.07, 0.01));
                Mask = mix(Mask, vec3(3.0, 3.0, 0.0), Circle(uv, vec2(0.13, 0.15), 0.07, 0.01));

                float v = abs(clamp(sin(iTime), 0.0, 0.07));
                Mask = mix(Mask, black, Circle(uv, vec2(0.05 + v, 0.07), 0.03, 0.01));
                Mask = mix(Mask, black, Circle(uv, vec2(-0.10 + v, 0.07), 0.03, 0.01));

                float w = abs(clamp(sin(iTime * 3.0), 0.0, 0.03));
                Mask = mix(Mask, vec3(3.0, 3.0, 0.0), rect(uv, vec2(0.00, 0.13 - w), 0.15, 0.03));

                Mask = mix(Mask, black, rect(uv, vec2(-0.02 + v, -0.05), 0.03, 0.010));

                vec3 Mouth = mix(black, vec3(-10.0), rect(uv, vec2(-0.02 + v, -0.05), 0.08, 0.015));
                Mask = mix(Mouth, blue, Mask);

                Mask = mix(Mask, red, Circle(uv, vec2(0.05 + v, -0.05), 0.04, 0.01));
                Mask = mix(Mask, red, Circle(uv, vec2(-0.09 + v, -0.05), 0.04, 0.01));

                gl_FragColor = vec4(Mask, 1.0);
            }
        `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const controls = new OrbitControls(camera,renderer.domElement);


    function render() {
      requestAnimationFrame(render);
      renderer.render(scene,camera);
      uniforms.iTime.value = performance.now() / 1000;
    }

    render();



  }, []);
  return <div ref={dom}/>;
};

export default Tsjszh;
