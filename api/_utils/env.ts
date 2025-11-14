/**
 * Environment variable validation and configuration utilities
 */

export interface EnvConfig {
  isProduction: boolean;
  hasAnthropicKey: boolean;
  hasGroqKey: boolean;
  hasGithubToken: boolean;
  domain: string | undefined;
}

/**
 * Get environment configuration
 */
export function getEnvConfig(): EnvConfig {
  return {
    isProduction: process.env.NODE_ENV === 'production',
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasGroqKey: !!process.env.GROQ_API_KEY,
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    domain: process.env.VITE_DOMAIN,
  };
}

/**
 * Validate environment variables on startup
 * Returns array of warnings (non-critical issues)
 */
export function validateEnvironment(): string[] {
  const warnings: string[] = [];
  const config = getEnvConfig();

  // Check for at least one AI provider
  if (!config.hasAnthropicKey && !config.hasGroqKey && !config.hasGithubToken) {
    warnings.push(
      'No AI provider configured. Set ANTHROPIC_API_KEY, GROQ_API_KEY, or GITHUB_TOKEN for AI features.'
    );
  }

  // Production-specific checks
  if (config.isProduction) {
    if (!config.domain) {
      warnings.push('VITE_DOMAIN not set in production environment');
    }
  }

  return warnings;
}

/**
 * Log environment status on startup
 */
export function logEnvironmentStatus(): void {
  const config = getEnvConfig();
  
  console.log('=== Environment Configuration ===');
  console.log(`Mode: ${config.isProduction ? 'Production' : 'Development'}`);
  console.log(`Domain: ${config.domain || 'Not set'}`);
  console.log('\nAI Providers:');
  console.log(`- Anthropic: ${config.hasAnthropicKey ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`- Groq: ${config.hasGroqKey ? '✓ Configured' : '✗ Not configured'}`);
  console.log(`- GitHub: ${config.hasGithubToken ? '✓ Configured' : '✗ Not configured'}`);

  const warnings = validateEnvironment();
  if (warnings.length > 0) {
    console.log('\nWarnings:');
    warnings.forEach(warning => console.log(`⚠ ${warning}`));
  }
  
  console.log('================================\n');
}
