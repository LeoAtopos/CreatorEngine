# CreatorEngine

[中文说明](README.zh-CN.md)

CreatorEngine is a local-first game concept guide. It turns a vague idea into a design summary that a creator can discuss, revise, test, and continue editing.

The interface automatically uses Chinese when the operating system language starts with `zh`; otherwise it uses English. A language button in the top navigation lets you switch at any time, and the preference is saved on the current device.

## Use it now

- Web app: [Open CreatorEngine](https://leoatopos.github.io/CreatorEngine/)
- Windows portable app: [Download CreatorEngine.exe](https://github.com/LeoAtopos/CreatorEngine/releases/latest/download/CreatorEngine.exe)
- Windows x64 installer: [Download CreatorEngine_x64-setup.exe](https://github.com/LeoAtopos/CreatorEngine/releases/latest/download/CreatorEngine_x64-setup.exe)

## Design flow

1. Initial Idea — preserve the original creative spark.
2. Three Sentences — define the game, target experience, and testable design hypothesis.
3. Four Pillars — align narrative, mechanics, aesthetics, and technology, including each pillar's guidance, support, or requirements for the others.
4. Player-Side Concept — examine first impression, the first ten minutes, mid-to-late progression, and the final experience.
5. Design Summary — review, edit, copy, or download the complete Markdown document.

All project data is stored in browser `localStorage` on the current device. No sign-in is required and no project content is sent to an external service. Downloaded Markdown files can be loaded again to continue editing.

## Run locally

```bash
npm install
npm run dev -- --port 3100
```

Open `http://localhost:3100/`.

Production mode:

```bash
npm run build
npm run start -- --port 3100
```

## Check

```bash
npm run lint
npm test
```
