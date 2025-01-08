/*
 * :file description:
 * :name: /shadertoy/src/pages/cineShader/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-07 23:34:00
 * :last editor: 张德志
 * :date last edited: 2025-01-08 12:55:11
 */
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';

const CineShader: React.FC = () => {
  const cineShaderRef = useRef<any>();

  useEffect(() => {
    // 初始化场景、相机和渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 设置相机位置
    camera.position.z = 5;

    // 创建自定义 ShaderMaterial
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        iTime: { value: 0.0 },
      },
      vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform vec2 iResolution;
            uniform float iTime;
            varying vec2 vUv;
    
            // 平滑联合
            float opSmoothUnion(float d1, float d2, float k) {
                float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
                return mix(d2, d1, h) - k * h * (1.0 - h);
            }
    
            // 球体 SDF
            float sdSphere(vec3 p, float s) {
                return length(p) - s;
            }
    
            // 场景组合
            float map(vec3 p) {
                float d = 2.0;
                for (int i = 0; i < 16; i++) {
                    float fi = float(i);
                    float time = iTime * (fract(fi * 412.531 + 0.513) - 0.5) * 2.0;
                    d = opSmoothUnion(
                        sdSphere(p + sin(time + fi * vec3(52.5126, 64.62744, 632.25)) * vec3(2.0, 2.0, 0.8), 
                                 mix(0.5, 1.0, fract(fi * 412.531 + 0.5124))),
                        d,
                        0.4
                    );
                }
                return d;
            }
    
            // 计算法线
            vec3 calcNormal(vec3 p) {
                const float h = 1e-5;
                const vec2 k = vec2(1, -1);
                return normalize(
                    k.xyy * map(p + k.xyy * h) +
                    k.yyx * map(p + k.yyx * h) +
                    k.yxy * map(p + k.yxy * h) +
                    k.xxx * map(p + k.xxx * h)
                );
            }
    
            void main() {
                vec2 uv = gl_FragCoord.xy / iResolution;
                uv = uv * 2.0 - 1.0; // 将坐标转换为 [-1, 1]
    
                // 设置光线起点和方向
                vec3 rayOri = vec3(uv * vec2(iResolution.x / iResolution.y, 1.0) * 6.0, 3.0);
                vec3 rayDir = vec3(0.0, 0.0, -1.0);
    
                // 光线行进
                float depth = 0.0;
                vec3 p;
                for (int i = 0; i < 64; i++) {
                    p = rayOri + rayDir * depth;
                    float dist = map(p);
                    depth += dist;
                    if (dist < 1e-6) {
                        break;
                    }
                }
    
                depth = min(6.0, depth); // 限制最大深度
    
                // 计算颜色
                vec3 n = calcNormal(p);
                float b = max(0.0, dot(n, vec3(0.577))); // 简单光照
                vec3 col = (0.5 + 0.5 * cos((b + iTime * 3.0) + uv.xyx * 2.0 + vec3(0, 2, 4))) * (0.85 + b * 0.35);
                col *= exp(-depth * 0.15); // 添加深度雾效
    
                gl_FragColor = vec4(col, 1.0);
            }
        `,
    });

    // 创建平面并添加到场景
    const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    const plane = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(plane);

    // 动画渲染循环
    function animate() {
      requestAnimationFrame(animate);

      // 更新时间
      shaderMaterial.uniforms.iTime.value += 0.1;

      renderer.render(scene, camera);
    }
    animate();

    // 响应窗口大小调整
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      shaderMaterial.uniforms.iResolution.value.set(
        window.innerWidth,
        window.innerHeight,
      );
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  }, []);

  return <div ref={cineShaderRef}/>;
};

export default CineShader;
