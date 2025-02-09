/*
 * :file description:
 * :name: /shadertoy/src/pages/4sfywn/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-02-09 19:33:44
 * :last editor: 张德志
 * :date last edited: 2025-02-09 19:37:10
 */
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Fsfywn: React.FC = () => {
  const dom = useRef<any>();
  useEffect(() => {
    let scene:THREE.Scene
    let camera:THREE.OrthographicCamera;
    let renderer:THREE.WebGLRenderer;
    let material:THREE.ShaderMaterial;

    function init() {
      // 初始化场景
      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // 着色器材质配置
      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2() },
      };

      material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            uniform float iTime;
            uniform vec2 iResolution;
            varying vec2 vUv;

            // 渐变颜色定义
            const vec3 colors[5] = vec3[](
                vec3(0.,0.,0.6),
                vec3(0.,1.,1.),
                vec3(0.0,1.0,0.),
                vec3(1.0,1.0,0.),
                vec3(1.0,0.0,0.)
            );
            
            const float points[5] = float[](
                0.0, 0.15, 0.5, 0.65, 1.0
            );

            vec3 gradian(vec3 c1, vec3 c2, float a) {
                return mix(c1, c2, a);
            }

            vec3 heat4(float weight) {
                if(weight <= points[0]) return colors[0];
                if(weight >= points[4]) return colors[4];
                
                for(int i = 1; i < 5; i++) {
                    if(weight < points[i]) {
                        float a = (weight - points[i-1]) / (points[i] - points[i-1]);
                        return gradian(colors[i-1], colors[i], a);
                    }
                }
                return vec3(0.0);
            }

            float d(vec2 a, vec2 b) {
                return pow(max(0.0, 1.0 - distance(a, b) / 0.6), 2.0);
            }

            void main() {
                vec2 uv = vUv * 4.0 - vec2(2.0);
                uv.x *= iResolution.x / iResolution.y;
                
                float totalWeight = 0.0;
                
                // 优化循环次数为常量表达式
                for (float i = 0.0; i < 112.0; i += 1.0) {
                    totalWeight += 0.5 * d(uv, vec2(
                        sin(iTime * 0.3 + i) * 2.0 + 2.0 * sin(i * i),
                        cos(iTime * 0.4 + i * 1.5) * 2.0
                    ));
                }
                
                gl_FragColor = vec4(heat4(totalWeight), 1.0);
            }
        `,
      });

      // 创建全屏平面
      const plane = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(plane, material);
      scene.add(mesh);

      // 初始化分辨率
      onWindowResize();
      window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      material.uniforms.iResolution.value.set(width, height);
    }

    function animate() {
      requestAnimationFrame(animate);
      material.uniforms.iTime.value = performance.now() / 1000;
      renderer.render(scene, camera);
    }

    init();
    animate();
  }, []);
  return <div ref={dom} />;
};

export default Fsfywn;
