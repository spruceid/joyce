# Joyce

Joyce is a decentralized application for book reviews that allows users to host and manage their ratings, comments, favorite passages, reading progress, and more within their personal data vaults. All the data models are open and interoperable, meaning developers can quickly write adapters to sync across platforms such as Kindle, Google Books, and Calibre. It’s up to the user how their content gets shared and whether sharing happens direct peer-to-peer, to a publicly available website, or with a third-party recommendation algorithm.

## to run

```bash
yarn install
yarn dev
```

That's it!

## Using dev containers

If you'd prefer to use Docker with dev containers (my personal preference), first install the dev containers CLI:

```bash
yarn add --global @devcontainers/cli # or, npm install -g @devcontainers/cli
```

For ease of integration, add the [remote containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) to your VS Code installation as well. Next, open the project:

```bash
code path-to/your-project
```

Either:

- Open the project in a container through VS Code using `ctrl` + `shift` + `p` and select `Dev Containers: Open Folder in Container...`
- Build the container locally with `devcontainer build --workspace-folder .` and use the above command to attach your local workspace to the container

## Husky git hooks

If you'd rather disable/enable only certain hooks, it's only a matter of removing the individual lifecycle hook you're interested in in the `.husky` folder. By default, three hooks are enabled:

- `commit-msg`: validates commit messages on an individual commit conform to (more/less) semantic commit convention (see `commitlint.config.js` to customize this)
- `pre-commit`: formats staged code using [lint-staged](https://github.com/okonet/lint-staged) based on `.prettierrc` configuration
- `pre-push`: runs [Playwright](https://playwright.dev/) tests before pushing commits to the remote origin
