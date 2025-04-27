const path = require('path');
const os = require('os');

// Define the placeholder pattern for project name
// Using '~~~' as the special character sequence as suggested
const PROJECT_NAME_PLACEHOLDER = '~~~snpp_project_name_placeholder~~~';

// Configuration for the SNPP tool
const config = {
  // Cache directory for project templates
  cacheDir: path.join(os.homedir(), '.snpp'),
  // Index file for project types
  indexFile: 'index.json',
  // Default GitHub repo for templates (can be customized by user)
  templateRepo: 'https://github.com/yourusername/snpp-templates.git',
  // Git configuration for new projects
  git: {
    defaultBranch: 'main',
    initialCommitMessage: (projectType) => `Initialize empty project with snpp. Project type used is: ${projectType}`
  },
  // Meta file for project templates
  metaFile: '.snpp.config.json',
  // Pattern for project name placeholder
  projectNamePlaceholder: PROJECT_NAME_PLACEHOLDER
};

module.exports = config;