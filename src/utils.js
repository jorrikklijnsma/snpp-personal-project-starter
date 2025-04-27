const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const simpleGit = require('simple-git');
const chalk = require('chalk');
const ora = require('ora');
const config = require('./config');

/**
 * Initialize the cache directory structure
 */
async function initializeCache() {
  const spinner = ora('Initializing cache directory').start();
  
  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(config.cacheDir)) {
      fs.mkdirSync(config.cacheDir, { recursive: true });
      
      // Create an empty index file
      const indexPath = path.join(config.cacheDir, config.indexFile);
      fs.writeJSONSync(indexPath, { projectTypes: [] }, { spaces: 2 });
      
      spinner.succeed('Cache directory initialized');
      return true;
    }
    
    spinner.succeed('Cache directory already exists');
    return true;
  } catch (error) {
    spinner.fail(`Failed to initialize cache: ${error.message}`);
    return false;
  }
}

/**
 * Sync cache with remote repository
 */
async function syncCacheWithRepo() {
  const spinner = ora('Syncing templates from repository').start();
  
  try {
    const git = simpleGit(config.cacheDir);
    
    // Check if git repo exists in cache
    const isRepo = await fs.pathExists(path.join(config.cacheDir, '.git'));
    
    if (!isRepo) {
      // Clone the repository
      await git.clone(config.templateRepo, config.cacheDir);
      spinner.succeed('Template repository cloned successfully');
    } else {
      // Pull latest changes
      await git.pull();
      spinner.succeed('Templates synced with repository');
    }
    
    return true;
  } catch (error) {
    spinner.fail(`Failed to sync templates: ${error.message}`);
    console.log(chalk.yellow('Continuing with local templates.'));
    return false;
  }
}

/**
 * Get all available project types
 */
async function getAllProjectTypes() {
  try {
    const indexPath = path.join(config.cacheDir, config.indexFile);
    
    if (!fs.existsSync(indexPath)) {
      return [];
    }
    
    const indexData = fs.readJSONSync(indexPath);
    return indexData.projectTypes || [];
  } catch (error) {
    console.error(chalk.red(`Error reading project types: ${error.message}`));
    return [];
  }
}

/**
 * Validate and normalize path
 */
function validatePath(inputPath) {
  try {
    // If path is not provided, use current directory
    if (!inputPath) {
      return process.cwd();
    }
    
    // Convert to absolute path if relative
    const absolutePath = path.isAbsolute(inputPath) 
      ? inputPath 
      : path.resolve(process.cwd(), inputPath);
    
    return absolutePath;
  } catch (error) {
    console.error(chalk.red(`Invalid path: ${error.message}`));
    return null;
  }
}

/**
 * Create project from template
 */
async function createProjectFromTemplate(type, projectPath, projectName) {
  const spinner = ora(`Creating project ${projectName} from template ${type}`).start();
  
  try {
    // Source template directory
    const templateDir = path.join(config.cacheDir, type);
    
    if (!fs.existsSync(templateDir)) {
      spinner.fail(`Template ${type} not found`);
      return false;
    }
    
    // Destination directory
    const destDir = path.join(projectPath, projectName);
    
    // Create destination directory if it doesn't exist
    await fs.ensureDir(destDir);
    
    // Copy template files to destination
    await fs.copy(templateDir, destDir, {
      filter: (src) => {
        // Skip .git directory from template
        return !src.includes('/.git/') && !src.endsWith('/.git');
      }
    });
    
    // Replace placeholders in files
    await replacePlaceholders(destDir, projectName);
    
    // Initialize git repository
    await initializeGitRepo(destDir, type);
    
    spinner.succeed(`Project ${projectName} created successfully`);
    return true;
  } catch (error) {
    spinner.fail(`Failed to create project: ${error.message}`);
    return false;
  }
}

/**
 * Replace placeholders in project files
 */
async function replacePlaceholders(dir, projectName) {
  const spinner = ora('Replacing placeholders').start();
  
  try {
    // Find all files in the project directory
    const files = glob.sync('**/*', {
      cwd: dir,
      nodir: true,
      dot: true,
      ignore: ['**/node_modules/**', '**/.git/**']
    });
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(dir, file);
      
      // Check if file is binary
      const isBinary = await isFileBinary(filePath);
      if (isBinary) continue;
      
      // Read file content
      let content = await fs.readFile(filePath, 'utf8');
      
      // Replace placeholder with project name
      if (content.includes(config.projectNamePlaceholder)) {
        content = content.replaceAll(config.projectNamePlaceholder, projectName);
        await fs.writeFile(filePath, content, 'utf8');
      }
    }
    
    spinner.succeed('Placeholders replaced successfully');
    return true;
  } catch (error) {
    spinner.fail(`Failed to replace placeholders: ${error.message}`);
    return false;
  }
}

/**
 * Check if a file is binary
 */
async function isFileBinary(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    
    // Check first 8000 bytes for null bytes
    for (let i = 0; i < Math.min(buffer.length, 8000); i++) {
      if (buffer[i] === 0) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking file type: ${error.message}`);
    return true; // Assume binary on error
  }
}

/**
 * Initialize git repository with initial commit
 */
async function initializeGitRepo(dir, projectType) {
  const spinner = ora('Initializing Git repository').start();
  
  try {
    const git = simpleGit(dir);
    
    // Initialize repository
    await git.init();
    
    // Set default branch
    await git.checkoutLocalBranch(config.git.defaultBranch);
    
    // Add all files
    await git.add('.');
    
    // Commit changes
    const commitMessage = config.git.initialCommitMessage(projectType);
    await git.commit(commitMessage);
    
    spinner.succeed('Git repository initialized');
    return true;
  } catch (error) {
    spinner.fail(`Failed to initialize Git repository: ${error.message}`);
    return false;
  }
}

/**
 * Create new project type template
 */
async function createNewProjectType(name) {
  const spinner = ora(`Creating new project type: ${name}`).start();
  
  try {
    // Template directory
    const templateDir = path.join(config.cacheDir, name);
    
    // Check if template already exists
    if (fs.existsSync(templateDir)) {
      spinner.fail(`Project type '${name}' already exists`);
      return false;
    }
    
    // Create template directory
    fs.mkdirSync(templateDir, { recursive: true });
    
    // Create meta file
    const metaPath = path.join(templateDir, config.metaFile);
    fs.writeJSONSync(metaPath, {
      name: name,
      description: `Template for ${name} projects`,
      version: '1.0.0',
      created: new Date().toISOString()
    }, { spaces: 2 });
    
    // Initialize git repository
    const git = simpleGit(templateDir);
    await git.init();
    await git.checkoutLocalBranch(config.git.defaultBranch);
    
    // Update index file
    const indexPath = path.join(config.cacheDir, config.indexFile);
    const indexData = fs.existsSync(indexPath) 
      ? fs.readJSONSync(indexPath) 
      : { projectTypes: [] };
    
    if (!indexData.projectTypes.includes(name)) {
      indexData.projectTypes.push(name);
      fs.writeJSONSync(indexPath, indexData, { spaces: 2 });
    }
    
    spinner.succeed(`Project type '${name}' created successfully`);
    console.log(chalk.green(`You can now add template files to ${templateDir}`));
    
    return true;
  } catch (error) {
    spinner.fail(`Failed to create project type: ${error.message}`);
    return false;
  }
}

module.exports = {
  initializeCache,
  syncCacheWithRepo,
  getAllProjectTypes,
  validatePath,
  createProjectFromTemplate,
  replacePlaceholders,
  initializeGitRepo,
  createNewProjectType
};