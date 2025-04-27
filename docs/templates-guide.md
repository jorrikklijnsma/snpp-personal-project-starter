# SNPP Templates Guide

This guide explains how to create, modify, and manage project templates for SNPP.

## Templates Location

Templates are stored in the `~/.snpp/` directory on your machine. Each template is a subdirectory containing the file structure for a specific project type.

## Template Structure

A basic template structure looks like this:

```
~/.snpp/
├── index.json                # List of all available project types
├── node-express/             # A template directory
│   ├── .snpp.config.json     # Template metadata (required)
│   ├── package.json          # Project files with placeholders
│   ├── index.js
│   └── ...
└── react-app/               # Another template
    └── ...
```

## Creating a New Template

### Using the CLI

The easiest way to create a new template is with the built-in command:

```bash
snpp new-type
```

This will:
1. Create a new directory in your templates folder
2. Add the template to the index.json file
3. Create a basic .snpp.config.json file
4. Initialize a git repository

### Manual Creation

To manually create a template:

1. Create a new directory in `~/.snpp/`
2. Add a `.snpp.config.json` file with at least:
   ```json
   {
     "name": "your-template-name",
     "description": "Template description",
     "version": "1.0.0"
   }
   ```
3. Add the template to the index.json file:
   ```json
   {
     "projectTypes": [
       "existing-template",
       "your-template-name"
     ]
   }
   ```
4. Add your project files

## Using Placeholders

To have SNPP replace the project name in your template files, use:

```
~~~snpp_project_name_placeholder~~~
```

This placeholder will be replaced with the actual project name when a new project is created.

Examples:
- In package.json: `"name": "~~~snpp_project_name_placeholder~~~"`
- In README.md: `# ~~~snpp_project_name_placeholder~~~`

## Template Configuration

The `.snpp.config.json` file supports the following properties:

```json
{
  "name": "template-name",
  "description": "Template description",
  "version": "1.0.0",
  "created": "2025-04-27T12:00:00Z",
  "author": "Your Name",
  "dependencies": [],
  "postActions": []
}
```

## Template Repository

Templates can be synchronized with a remote Git repository. To configure your own repository, modify the `templateRepo` property in the `src/config.js` file.