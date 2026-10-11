import * as THREE from 'three';
import gsap from 'gsap';

const vertexShader = `#define GLSLIFY 1
varying vec2 vUv;
varying float vDepth;

uniform float uCurveAmplitude;
uniform float uCurveFrequency;
uniform float uCurveDirection;
uniform float uCurveOffset;
uniform float uTime;
uniform float uPointerX;
uniform float uPointerY;
uniform float uCurveAnimation;

void main() {
    vec3 pos = position;
    vec2 currentUV = uv;

    vec2 pointerPos = vec2(uPointerX, uPointerY);
    vec2 distanceVec = currentUV - pointerPos;
    float distance2D = length(distanceVec);

    float bumpRadius = 0.25;
    float bump = exp(-distance2D * distance2D / (bumpRadius * bumpRadius));
    float shapedBump = pow(bump, 2.0);
    float curvePointer = shapedBump * uCurveAmplitude;

    float animatedOffset = uCurveOffset + uTime * 0.5;
    float wave = sin(position.x * uCurveFrequency + animatedOffset);
    wave += sin(position.x * uCurveFrequency * 2.0 + animatedOffset) * 0.1;
    float shapedWave = -pow(abs(wave), 2.0);

    float curveAnimated = curvePointer * uCurveAmplitude * 1.1 + shapedWave * uCurveAmplitude;
    float curve = curveAnimated * uCurveAnimation;

    pos.z += curve;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vDepth = worldPos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}
`;

const fragmentShader = `#define GLSLIFY 1
varying vec2 vUv;
varying float vDepth;

uniform sampler2D uTexture;
uniform float uTextureFrequency;
uniform float uDepthFade;
uniform float uTextureRotation;

vec2 rotateUV(vec2 uv, float angle) {
    vec2 centered = uv - 0.5;
    float cosA = cos(angle);
    float sinA = sin(angle);
    mat2 rotationMatrix = mat2(cosA, -sinA, sinA, cosA);
    return rotationMatrix * centered + 0.5;
}

void main() {
    vec2 rotatedUv = rotateUV(vUv, uTextureRotation);
    vec2 repeatedUv = rotatedUv * uTextureFrequency;
    vec4 textureColor = texture2D(uTexture, repeatedUv);

    float depthFactor = clamp(vDepth * uDepthFade + 1.0, 0.0, 1.0);
    float finalAlpha = clamp(textureColor.a * depthFactor, 0.1, 0.5);

    gl_FragColor = vec4(textureColor.rgb, finalAlpha * 0.6);
}
`;

export class IcomatScene3D {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 0.1, 300);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    this.clock = new THREE.Clock();

    this.initTexture();
    this.initMesh();
    this.initEvents();
    this.animate();
  }

  initTexture() {
    // Generate the procedural carbon-line texture on canvas
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);

    const lineWidth = Math.max(2, Math.floor(size / 64 * 2));
    const gap = (size - 3 * lineWidth) / 3;

    for (let i = 0; i < 3; i++) {
      const y = gap + i * (lineWidth + gap);
      const grad = ctx.createLinearGradient(0, y - 0.5, 0, y + lineWidth + 0.5);
      grad.addColorStop(0, 'rgba(58, 58, 58, 0)');
      grad.addColorStop(0.15, '#ffffff');
      grad.addColorStop(0.85, '#ffffff');
      grad.addColorStop(1, 'rgba(58, 58, 58, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, y - 0.5, size, lineWidth + 1);
    }

    this.texture = new THREE.CanvasTexture(canvas);
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.needsUpdate = true;
  }

  initMesh() {
    this.uniforms = {
      uTexture: { value: this.texture },
      uTextureFrequency: { value: 25.0 },
      uTextureRotation: { value: 0.5 },
      uCurveAmplitude: { value: 2.0 },
      uCurveFrequency: { value: 5.0 },
      uCurveDirection: { value: 0.1 },
      uCurveOffset: { value: 0.0 },
      uTime: { value: 0.0 },
      uPointerX: { value: 0.5 },
      uPointerY: { value: 0.5 },
      uDepthFade: { value: 0.08 },
      uCurveAnimation: { value: 1.0 }
    };

    const geometry = new THREE.PlaneGeometry(1, 1.5, 64, 64);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0, -10);
    this.mesh.rotation.x = 0.2;
    this.mesh.rotation.y = 0.2;
    this.mesh.scale.set(window.innerWidth * 0.03, window.innerHeight * 0.017, 1);
    this.scene.add(this.mesh);
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      if (this.mesh) {
        this.mesh.scale.set(window.innerWidth * 0.03, window.innerHeight * 0.017, 1);
      }
    });

    window.addEventListener('pointermove', (e) => {
      this.pointer.targetX = e.clientX / window.innerWidth;
      this.pointer.targetY = 1.0 - (e.clientY / window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Lerp pointer smoothly
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;

    if (this.uniforms) {
      this.uniforms.uTime.value = elapsedTime * 1.2;
      this.uniforms.uPointerX.value = this.pointer.x;
      this.uniforms.uPointerY.value = this.pointer.y;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
