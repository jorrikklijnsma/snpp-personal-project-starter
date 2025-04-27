const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const utils = require('../utils');

/**
 * Start a new project command handler
 */
async function startProject(options) {
  try {
    // Initialize cache if needed
    await utils.initializeCache();
    
    // Sync cache with repo (optional, fails gracefully)
    await utils.syncCacheWithRepo();
    
    // Get project type
    const projectType = await getProjectType(options.type);
    if (!projectType) {
      console.error(chalk.red('No project type selected or available. Exiting.'));
      return;
    }
    
    // Get project path
    const projectPath = await getProjectPath(options.path);
    if (!projectPath) {
      console.error(chalk.red('Invalid project path. Exiting.'));
      return;
    }
    
    // Get project name
    const projectName = await getProjectName(projectPath, options.name);
    if (!projectName) {
      console.error(chalk.red('Invalid project name. Exiting.'));
      return;
    }
    
    // Create project from template
    const success = await utils.createProjectFromTemplate(projectType, projectPath, projectName);
    
    if (success) {
      const projectFullPath = path.join(projectPath, projectName);
      console.log(chalk.green(`\nProject created successfully at:`));
      console.log(chalk.cyan(projectFullPath));
      console.log(chalk.green(`\nHappy coding!`));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
  }
}

/**
 * Get project type through interactive prompt or from options
 */
async function getProjectType(preDefinedType) {
  // If type is pre-defined, validate and return it
  if (preDefinedType) {
    const allTypes = await utils.getAllProjectTypes();
    if (allTypes.includes(preDefinedType)) {
      return preDefinedType;
    } else {
      console.error(chalk.red(`Project type '${preDefinedType}' not found.`));
      // Fall back to interactive selection
    }
  }
  
  // Get all available project types
  const projectTypes = await utils.getAllProjectTypes();
  
  if (projectTypes.length === 0) {
    console.error(chalk.red('No project types available.'));
    console.log(chalk.yellow('Use `snpp new-type` to create a new project type.'));
    return null;
  }
  
  // Prompt user to select a project type
  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Select a project type:',
      choices: projectTypes
    }
  ]);
  
  return type;
}

/**
 * Get project path through interactive prompt or from options
 */
async function getProjectPath(preDefinedPath) {
  // If path is pre-defined, validate and return it
  if (preDefinedPath !== undefined) {
    return utils.validatePath(preDefinedPath);
  }
  
  // Prompt user for project path
  const { inputPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputPath',
      message: 'Enter project path (leave empty for current directory):',
      default: process.cwd()
    }
  ]);
  
  return utils.validatePath(inputPath);
}

/**
 * Get project name through interactive prompt or from options
 */
async function getProjectName(projectPath, preDefinedName) {
  // If name is pre-defined, validate and return it
  if (preDefinedName) {
    if (preDefinedName === '.') {
      // Use current directory name
      return path.basename(projectPath);
    }
    return preDefinedName;
  }
  
  // Get current directory name as default
  const defaultName = path.basename(projectPath);
  
  // Prompt for project name with options
  const { nameOption } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nameOption',
      message: 'How would you like to name your project?',
      choices: [
        { name: `Use current folder name (${defaultName})`, value: 'useFolder' },
        { name: 'Enter a custom name', value: 'custom' }
      ]
    }
  ]);
  
  if (nameOption === 'useFolder') {
    return defaultName;
  }
  
  // Prompt for custom name
  const { customName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'customName',
      message: 'Enter project name:',
      validate: (input) => {
        if (!input.trim()) {
          return 'Project name cannot be empty';
        }
        // Check if directory already exists
        const projectDir = path.join(projectPath, input);
        if (fs.existsSync(projectDir) && fs.readdirSync(projectDir).length > 0) {
          return `Directory ${projectDir} already exists and is not empty`;
        }
        return true;
      }
    }
  ]);
  
  return customName;
}

module.exports = {
  startProject
};