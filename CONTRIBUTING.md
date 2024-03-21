# Contributing to Logestic

## Reporting Issues

😥 Feel free to submit an issue when Logestic is not working as you expected.

## Solving Issues

1. ❗ All PRs must reference an issue.
2. 🗣 If there is an issue you want to work on, ask on the issue thread if you want to work on it.
3. 🍴 Fork this repository and create a new branch `fix-[number]/[short description]` according to the issue.
4. ✍ Fix the issue.
6. 🎆 Open a PR and wait until a collaborator merges it in.

## Adding Presets

1. 🍴 Fork this repository and create a new branch `preset-[name]` with the name of your preset.
2. ✍ Create a new file under [presets/](./src/presets/) and export an Elysia incstance with your Logestic middleware.
3. ➕ Import your file in [index.ts](./src/presets/index.ts) and add the key type to [types](./src/types.ts)
4. 🎆 Open a PR and wait until a collaborator merges it in. Attach a screenshot so we can add to the Wiki.
