# Contributing to SNPP

Thank you for considering contributing to SNPP! Here are some guidelines to help you get started.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/snpp.git`
3. Install dependencies: `npm install`
4. Link the package for local development: `npm link`

## Making Changes

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes locally
4. Commit your changes: `git commit -m "Add feature: your feature"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a pull request

## Adding New Templates

If you're adding new default templates:

1. Add your template to the `examples/` directory
2. Update `examples/index.json` to include your new template
3. Add appropriate documentation

## Code Style

- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic

## Testing

- Test your changes locally before submitting a pull request
- Ensure all commands work correctly

## Documentation

- Update documentation when adding new features
- Keep the README.md and docs/ directory up to date

## Releasing

Only project maintainers can release new versions:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a new git tag
4. Push to GitHub
5. Publish to npm: `npm publish`
6. Update Homebrew formula if needed

## License

By contributing to SNPP, you agree that your contributions will be licensed under the project's MIT License.