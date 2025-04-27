# SNPP - Start New Personal Project

SNPP is a CLI tool for quickly initializing new projects based on customizable templates.

## Features

- Create new projects from templates with a simple command
- Interactive selection of project types, paths, and names
- Customizable templates with Git integration
- Automatic placeholder replacement
- Create new project type templates

## Installation

### NPM (Global)

```bash
npm install -g snpp
```

### Clone from GitHub

```bash
git clone https://github.com/yourusername/snpp.git
cd snpp
npm install
npm link
```

## Usage

### Start a new project (interactive)

```bash
snpp start
```

This will guide you through:
1. Selecting a project type
2. Specifying a folder path
3. Naming your project

### Start a new project (with options)

```bash
snpp start -t node-express -p ./projects -n my-new-app
```

### Create a new project type template

```bash
snpp new-type
```

## Project Templates

Templates are stored in `~/.snpp/`. Each template is a directory containing the files and structure for a specific project type.

### Custom Templates

1. Create a new template:
   ```bash
   snpp new-type
   ```
2. Add your template files to the created directory
3. Use `~~~snpp_project_name_placeholder~~~` in files where you want the project name to be inserted

## Command Reference

```
Usage: snpp [options] [command]

Start New Personal Project - A CLI tool for initializing empty projects from templates

Options:
  -V, --version              output the version number
  -h, --help                 display help for command

Commands:
  start [options]            Start a new project based on a template
  new-type                   Create a new empty project type template
  help [command]             display help for command
```

### Start Command Options

```
Options:
  -p, --path <path>          Pre-define the project path
  -n, --name <name>          Pre-define the project name
  -t, --type <type>          Pre-define the project type
  -h, --help                 display help for command
```

## License

MIT