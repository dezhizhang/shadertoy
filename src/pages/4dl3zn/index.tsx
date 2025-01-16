
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
    // Create the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Create a plane geometry (to display the shader)
    const geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    
    // Define the shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },  // Uniform for time
        iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) } // Resolution
      },
      fragmentShader: `
        uniform float iTime;
        uniform vec3 iResolution;
    
        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
          vec2 uv = (2.0*fragCoord-iResolution.xy) / iResolution.y;
    
          // background     
          vec3 color = vec3(0.8 + 0.2*uv.y);
    
          // bubbles  
          for( int i=0; i<40; i++ )
          {
              // bubble seeds
              float pha =      sin(float(i)*546.13+1.0)*0.5 + 0.5;
              float siz = pow( sin(float(i)*651.74+5.0)*0.5 + 0.5, 4.0 );
              float pox =      sin(float(i)*321.55+4.1) * iResolution.x / iResolution.y;
    
              // bubble size, position and color
              float rad = 0.1 + 0.5*siz;
              vec2  pos = vec2( pox, -1.0-rad + (2.0+2.0*rad)*mod(pha+0.1*iTime*(0.2+0.8*siz),1.0));
              float dis = length( uv - pos );
              vec3  col = mix( vec3(0.94,0.3,0.0), vec3(0.1,0.4,0.8), 0.5+0.5*sin(float(i)*1.2+1.9));
              
              // render
              float f = length(uv-pos)/rad;
              f = sqrt(clamp(1.0-f*f,0.0,1.0));
              color -= col.zyx *(1.0-smoothstep( rad*0.95, rad, dis )) * f;
          }
    
          // vigneting  
          color *= sqrt(1.5-0.5*length(uv));
    
          fragColor = vec4(color,1.0);
        }
    
        void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `,
    });
    
    // Create the mesh with the shader material and geometry
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    // Position the camera
    camera.position.z = 1;
    
    // Animate the scene
    function animate(time) {
      requestAnimationFrame(animate);
    
      // Update uniforms
      material.uniforms.iTime.value = time * 0.001;
    
      // Render the scene
      renderer.render(scene, camera);
    }
    
    // Start the animation
    animate(0);
    
    // Handle window resizing
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    
      // Update resolution uniform on resize
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
    });
    
    
  }, []);

  return <div ref={dom}/>;
};

export default CineShader;
