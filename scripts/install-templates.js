#!/usr/bin/env node

/**
 * This script installs the default templates to the user's cache directory
 * It's meant to be run after the package is installed
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

// Define paths
const cacheDir = path.join(os.homedir(), '.snpp');
const examplesDir = path.join(__dirname, '../examples');

async function installTemplates() {
  try {
    console.log(chalk.cyan('Installing default project templates...'));
    
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Copy examples to cache directory
    if (fs.existsSync(examplesDir)) {
      // Copy index.json
      const indexSrc = path.join(examplesDir, 'index.json');
      const indexDest = path.join(cacheDir, 'index.json');
      
      // Only copy if destination doesn't exist (don't overwrite user templates)
      if (!fs.existsSync(indexDest)) {
        fs.copySync(indexSrc, indexDest);
      } else {
        console.log(chalk.yellow('Index file already exists, skipping...'));
      }
      
      // Copy template directories
      const entries = fs.readdirSync(examplesDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'node_modules') {
          const srcDir = path.join(examplesDir, entry.name);
          const destDir = path.join(cacheDir, entry.name);
          
          // Only copy if destination doesn't exist (don't overwrite user templates)
          if (!fs.existsSync(destDir)) {
            fs.copySync(srcDir, destDir);
          } else {
            console.log(chalk.yellow(`Template '${entry.name}' already exists, skipping...`));
          }
        }
      }
      
      console.log(chalk.green('Default templates installed successfully!'));
    } else {
      console.log(chalk.yellow('Examples directory not found, skipping...'));
    }
  } catch (error) {
    console.error(chalk.red(`Error installing templates: ${error.message}`));
  }
}

// Run the installation
installTemplates();