const inquirer = require('inquirer');
const chalk = require('chalk');
const utils = require('../utils');

/**
 * New project type command handler
 */
async function newProjectType() {
  try {
    // Initialize cache if needed
    await utils.initializeCache();
    
    // Get all existing project types
    const existingTypes = await utils.getAllProjectTypes();
    
    // Prompt for new project type name
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the new project type:',
        validate: (input) => {
          if (!input.trim()) {
            return 'Project type name cannot be empty';
          }
          if (existingTypes.includes(input)) {
            return `Project type '${input}' already exists`;
          }
          // Check for valid directory name
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return 'Project type name must contain only letters, numbers, dashes, and underscores';
          }
          return true;
        }
      }
    ]);
    
    // Create new project type
    const success = await utils.createNewProjectType(name);
    
    if (success) {
      console.log(chalk.green(`\nProject type '${name}' created successfully!`));
      console.log(chalk.cyan('Next steps:'));
      console.log(chalk.cyan('1. Add template files to your new project type'));
      console.log(chalk.cyan(`2. Use the '~~~snpp_project_name_placeholder~~~' placeholder in files where you want the project name to be inserted`));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
  }
}

module.exports = {
  newProjectType
};