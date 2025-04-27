#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { startProject } = require('./commands/start');
const { newProjectType } = require('./commands/new-type');
const { version } = require('../package.json');

// Configure the CLI
program
  .name('snpp')
  .description('Start New Personal Project - A CLI tool for initializing empty projects from templates')
  .version(version);

// Register the start command
program
  .command('start')
  .description('Start a new project based on a template')
  .option('-p, --path <path>', 'Pre-define the project path')
  .option('-n, --name <name>', 'Pre-define the project name')
  .option('-t, --type <type>', 'Pre-define the project type')
  .action(startProject);

// Register the new-type command
program
  .command('new-type')
  .description('Create a new empty project type template')
  .action(newProjectType);

// Parse command line arguments
program.parse(process.argv);

// If no commands were passed, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}