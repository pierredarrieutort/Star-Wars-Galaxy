uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
  /**
  *  Position
  */
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  /**
  *  Spin
  */
  float angle = atan(modelPosition.z, modelPosition.x);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime;
  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.y = -(cos(angle) / 1.5 + sin(angle) * 2.5) / 4.0 * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  /**
  *  Randomness
  */
  modelPosition.xyz += aRandomness;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;

  /**
  *  Size
  */
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);

  /**
  *  Color
  */
  vColor = color;
}
