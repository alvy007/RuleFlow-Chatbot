# RuleFlow: Simple Rule-Based Chatbot

Part of **Week 1: Classical AI Foundations, State-Space Search & Problem Solving**. The app is built with **HTML5, CSS3, and Vanilla JavaScript (ES6+)** and uses no paid APIs, backend, or build tools.

## Run locally

From the project folder, use a local server (JavaScript module imports need HTTP):

```bash
python -m http.server 8000
```

Open http://localhost:8000/ in a browser. Alternatively, open **standalone.html** directly from your computer: it bundles styles and JavaScript into one portable file.

## Test

Node.js 18+ is required:

```bash
node --test tests/engine.test.mjs
```

The project includes 18 automated tests.

## Implementation

Developed a responsive rule-based chatbot using vanilla JavaScript without external AI APIs. Implemented text normalization, keyword and regex pattern matching, ordered intent mappings, dynamic if-then responses, session-based name memory, and contextual follow-up messages. Added a clean chat interface with suggested prompts, conversation reset, input validation, safe text rendering, and graceful fallbacks for unsupported questions. Includes automated unit tests for intent recognition, personalization, and edge cases.

## Quick manual verification

Try “What is BFS?”, “A* search”, “My name is Alex”, “What's my name?”, and “tell me more”.

## Project structure

- `index.html`: semantic HTML interface
- `styles.css`: responsive UI
- `js/engine.mjs`: pure JavaScript AI algorithm / rule engine
- `js/app.mjs`: DOM controls and interactions
- `tests/engine.test.mjs`: algorithm unit tests
- `standalone.html`: portable, self-contained app for offline review
- `SUBMISSION.md`: copy-ready implementation remark and submission checklist
- `.github/workflows/ci.yml`: automated testing on GitHub pushes

## GitHub repository and GitHub Pages deployment

- **GitHub repository:** https://github.com/alvy007/RuleFlow-Chatbot
- **Expected live URL after enabling Pages:** https://alvy007.github.io/RuleFlow-Chatbot/

For one-time deployment, open **Settings → Pages** in this repository. Set **Source** to **Deploy from a branch**, select branch **main** and folder **/(root)**, and click **Save**. Verify the working site before submitting its live URL.


## License

MIT, © 2026 Alvy Rahman Masum.
