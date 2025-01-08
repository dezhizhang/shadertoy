/*
 * :file description: 
 * :name: /shadertoy/src/pages/ftt3R7/index.tsx
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-08 23:22:50
 * :last editor: 张德志
 * :date last edited: 2025-01-08 23:23:55
 */
import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';

const CineShader: React.FC = () => {
  const dom = useRef<any>();

  useEffect(() => {
    //  创建场景和相机
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    dom?.current?.appendChild(renderer.domElement);
    
    // GLSL 着色器代码
    const vertexShader = `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;
    
    const fragmentShader = `
    #define NUM_LAYERS 10.0
    uniform float iTime;
    uniform vec2 iResolution;
    uniform vec2 iMouse;
    
    varying vec2 vUv;
    
    // 旋转矩阵
    mat2 Rot(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
    }
    
    // 星星函数
    float Star(vec2 uv, float flare) {
        float col = 0.0;
        float d = length(uv);
        float m = 0.02 / d;
    
        float rays = max(0.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * flare;
        uv *= Rot(3.1415 / 4.0);
        rays = max(0.0, 1.0 - abs(uv.x * uv.y * 1000.0));
        m += rays * 0.3 * flare;
    
        m *= smoothstep(1.0, 0.2, d);
    
        return m;
    }
    
    // 随机数生成函数
    float Hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
    }
    
    // 星层函数
    vec3 StarLayer(vec2 uv) {
        vec3 col = vec3(0.0);
    
        vec2 gv = fract(uv) - 0.5;
        vec2 id = floor(uv);
    
        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
                vec2 offs = vec2(x, y);
                float n = Hash21(id + offs);
                float size = fract(n * 345.32);
    
                vec2 p = vec2(n, fract(n * 34.0));
    
                float star = Star(gv - offs - p + 0.5, smoothstep(0.8, 1.0, size) * 0.6);
                vec3 color = vec3(1.0, 0.25, 1.0 + size);
                col += star * size * color;
            }
        }
    
        return col;
    }
    
    // 主片段着色器
    void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        uv *= 2.0;
    
        vec3 col = vec3(0.0);
        float t = iTime * 0.01;
    
        for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYERS) {
            float depth = fract(i + t);
            float scale = mix(20.0, 0.5, depth);
            col += StarLayer(uv * scale + i * 453.2);
        }
    
        gl_FragColor = vec4(col, 1.0);
    }
    `;
    
    // 创建材质
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            iMouse: { value: new THREE.Vector2(0, 0) }
        }
    });
    
    // 创建平面网格
    const geometry = new THREE.PlaneGeometry(14,10);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    // 渲染循环
    function animate() {
        material.uniforms.iTime.value += 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    
    animate();
    
  }, []);

  return <div ref={dom}/>;
};

export default CineShader;
