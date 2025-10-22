/**
 * WebGL support detection and capability checking
 * Ensures graceful degradation when WebGL is unavailable
 */

export interface WebGLCapabilities {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  maxVertexAttributes: number;
  renderer: string | null;
  vendor: string | null;
}

/**
 * Check if WebGL is supported
 */
export const hasWebGLSupport = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    return !!gl;
  } catch {
    return false;
  }
};

/**
 * Check if WebGL2 is supported
 */
export const hasWebGL2Support = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');

    return !!gl;
  } catch {
    return false;
  }
};

/**
 * Get detailed WebGL capabilities
 */
export const getWebGLCapabilities = (): WebGLCapabilities => {
  const defaultCapabilities: WebGLCapabilities = {
    hasWebGL: false,
    hasWebGL2: false,
    maxTextureSize: 0,
    maxVertexAttributes: 0,
    renderer: null,
    vendor: null,
  };

  if (typeof window === 'undefined') return defaultCapabilities;

  try {
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext) ||
      (canvas.getContext('webgl') as WebGLRenderingContext) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext);

    if (!gl) return defaultCapabilities;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    return {
      hasWebGL: true,
      hasWebGL2: hasWebGL2Support(),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
      maxVertexAttributes: gl.getParameter(gl.MAX_VERTEX_ATTRIBS) as number,
      renderer: debugInfo
        ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
        : null,
      vendor: debugInfo
        ? (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string)
        : null,
    };
  } catch {
    return defaultCapabilities;
  }
};

/**
 * Check if device can handle Three.js
 */
export const canHandleThreeJS = (): boolean => {
  const hasWebGL = hasWebGLSupport();
  const capabilities = getWebGLCapabilities();

  // Minimum requirements for Three.js
  return (
    hasWebGL &&
    capabilities.maxTextureSize >= 1024 &&
    capabilities.maxVertexAttributes >= 8
  );
};

/**
 * Get error message for WebGL unavailability
 */
export const getWebGLErrorMessage = (): string => {
  if (!hasWebGLSupport()) {
    return 'Your browser does not support WebGL, which is required for 3D graphics. Please try using a modern browser like Chrome, Firefox, or Safari.';
  }

  if (!canHandleThreeJS()) {
    return 'Your graphics hardware does not meet the minimum requirements for 3D effects. Some visual features have been disabled.';
  }

  return 'An error occurred while initializing 3D graphics. Some visual features may be unavailable.';
};
