/**
 * Centralized feature flags configuration for ASTRA.
 * 
 * To re-enable any of these developer or inactive experiences for testing
 * or implementation, toggle the respective flags to true.
 */
export const featureFlags = {
  /** Hides the developer playgrounds, components testing panels, and developer routes */
  developerSurfaces: false,
  
  /** Hides the stubbed, placeholder AI companion and Memory Sanctuary UI blocks */
  inactiveFeatures: false,
};
