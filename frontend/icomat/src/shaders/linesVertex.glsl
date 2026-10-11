#define GLSLIFY 1
varying vec2 vUv;
varying float vDepth; // Z position in world space for depth darkening

uniform float uCurveAmplitude;
uniform float uCurveFrequency;
uniform float uCurveDirection; // 0.0 = X, 1.0 = Y
uniform float uCurveOffset;
uniform float uTime;           // Time for infinite wave progression
uniform float uPointerX;       // Pointer X coordinate (0 to 1)
uniform float uPointerY;       // Pointer Y coordinate (0 to 1)
uniform float uCurveAnimation; // In/Out animation scale (1 to 0)

void main() {
    vec3 pos = position;
    vec2 currentUV = uv;

    // === 2D GAUSSIAN BUMP FOLLOWING CURSOR ===
    vec2 pointerPos = vec2(uPointerX, uPointerY);
    vec2 distanceVec = currentUV - pointerPos;
    float distance2D = length(distanceVec);

    float bumpRadius = 0.25; // Bump radius in UV coordinates
    float bump = exp(-distance2D * distance2D / (bumpRadius * bumpRadius));
    float shapedBump = pow(bump, 2.0); // Sharpen Gaussian peak
    float curvePointer = shapedBump * uCurveAmplitude;

    // === TRAVELING WAVES (HORIZONTAL) ===
    float animatedOffset = uCurveOffset + uTime * 0.5;
    float wave = sin(position.x * uCurveFrequency + animatedOffset);
    wave += sin(position.x * uCurveFrequency * 2.0 + animatedOffset) * 0.1;
    float shapedWave = -pow(abs(wave), 2.0);

    float curveAnimated = curvePointer * uCurveAmplitude * 1.1 + shapedWave * uCurveAmplitude;
    float curve = curveAnimated * uCurveAnimation;

    // Displace vertex on Z axis
    pos.z += curve;

    // Calculate world space position for depth lighting
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vDepth = worldPos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}
