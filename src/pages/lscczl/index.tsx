
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
#define S(a, b, t) smoothstep(a, b, t)
#define NUM_LAYERS 4.

uniform vec3 iResolution;
uniform vec2 iMouse;
uniform float iTime;

float N21(vec2 p) {
    vec3 a = fract(vec3(p.xyx) * vec3(213.897, 653.453, 253.098));
    a += dot(a, a.yzx + 79.76);
    return fract((a.x + a.y) * a.z);
}

vec2 GetPos(vec2 id, vec2 offs, float t) {
    float n = N21(id+offs);
    float n1 = fract(n*10.);
    float n2 = fract(n*100.);
    float a = t+n;
    return offs + vec2(sin(a*n1), cos(a*n2))*.4;
}

float df_line(in vec2 a, in vec2 b, in vec2 p) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa,ba) / dot(ba,ba), 0., 1.);    
    return length(pa - ba * h);
}

float line(vec2 a, vec2 b, vec2 uv) {
    float r1 = .04;
    float r2 = .01;
    
    float d = df_line(a, b, uv);
    float d2 = length(a-b);
    float fade = S(1.5, .5, d2);
    
    fade += S(.05, .02, abs(d2-.75));
    return S(r1, r2, d)*fade;
}

float NetLayer(vec2 st, float n, float t) {
    vec2 id = floor(st)+n;

    st = fract(st)-.5;
   
    vec2 p[9];
    int i=0;
    for(float y=-1.; y<=1.; y++) {
        for(float x=-1.; x<=1.; x++) {
            p[i++] = GetPos(id, vec2(x,y), t);
        }
    }
    
    float m = 0.;
    float sparkle = 0.;
    
    for(int i=0; i<9; i++) {
        m += line(p[4], p[i], st);

        float d = length(st-p[i]);

        float s = (.005/(d*d));
        s *= S(1., .7, d);
        float pulse = sin((fract(p[i].x)+fract(p[i].y)+t)*5.)*.4+.6;
        pulse = pow(pulse, 20.);

        s *= pulse;
        sparkle += s;
    }
    
    m += line(p[1], p[3], st);
    m += line(p[1], p[5], st);
    m += line(p[7], p[5], st);
    m += line(p[7], p[3], st);
    
    float sPhase = (sin(t+n)+sin(t*.1))*.25+.5;
    sPhase += pow(sin(t*.1)*.5+.5, 50.)*5.;
    m += sparkle*sPhase;
    
    return m;
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (fragCoord - iResolution.xy * 0.5) / iResolution.y;
    vec2 M = iMouse.xy / iResolution.xy - 0.5;
    
    float t = iTime * 0.1;
    
    float s = sin(t);
    float c = cos(t);
    mat2 rot = mat2(c, -s, s, c);
    vec2 st = uv * rot;  
    M *= rot * 2.0;
    
    float m = 0.0;
    for(float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYERS) {
        float z = fract(t + i);
        float size = mix(15.0, 1.0, z);
        float fade = S(0.0, 0.6, z) * S(1.0, 0.8, z);
        
        m += fade * NetLayer(st * size - M * z, i, iTime);
    }
    
    vec3 baseCol = vec3(s, cos(t * 0.4), -sin(t * 0.24)) * 0.4 + 0.6;
    vec3 col = baseCol * m;
    
    gl_FragColor = vec4(col, 1.0);
}
`;

    // Three.js Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
      },
      iMouse: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(window.innerWidth, window.innerHeight),
      material,
    );
    scene.add(plane);

    // Animation Loop
    function animate() {
      uniforms.iTime.value += 0.05;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    // Handle Resize
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
    });

    // Handle Mouse
    window.addEventListener('mousemove', (event) => {
      uniforms.iMouse.value.set(event.clientX, event.clientY);
    });

    animate();
  }, []);

  return <div ref={dom} />;
};

export default Wldsrn;
