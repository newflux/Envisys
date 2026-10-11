#define GLSLIFY 1
varying vec2 vUv;
varying float vDepth;

uniform sampler2D uTexture;
uniform float uTextureFrequency;
uniform float uDepthFade;        // Controls intensity of depth-based darkening
uniform float uTextureRotation;  // Rotation of texture in radians

// Rotate UVs around center (0.5, 0.5)
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

    // Darken based on Z depth
    float depthFactor = clamp(vDepth * uDepthFade + 1.0, 0.0, 1.0);
    float finalAlpha = clamp(textureColor.a * depthFactor, 0.1, 0.5);

    gl_FragColor = vec4(textureColor.rgb, finalAlpha * 0.6);
}
