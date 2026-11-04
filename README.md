# A Simple PDF Editor

A browser-based portfolio demo for creating and editing PDF documents directly on the device. It offers text editing, image manipulation and annotations without requiring a server-side processing service.

Live demo: https://a-simple-pdf-editor-domingos-cameme.vercel.app/

## Contents

- Overview
- Key features
- Technologies
- Project structure
- Requirements and compatibility
- Running locally
- Production build
- Accessibility, security and privacy
- Testing and quality
- Basic usage
- Credits and contact
- Terms and copyright

## Overview

The project is a client-side application designed for users who need to create, edit and review PDF documents quickly and reliably. The application prioritizes:
- Client-side operations where possible, minimizing the need to upload documents to external servers;
- A simple and focused editing workflow;
- Compatibility with modern browsers and mobile devices.

## Key features
- Text editing: insert, edit and remove text blocks.
- Image handling: add, resize and remove images on pages.
- Tables, lists, links, code blocks and vertical spacing.
- Document title, author and metadata configuration.
- Layout presets, margins and export options.
- Text formatting, highlighting and direct selection editing.
- Save and print flows supported by the browser.
- Installable PWA with offline caching in production.
- Export: save the edited document as a new PDF while preserving layout and basic metadata.

## Technologies
- JavaScript (ES6+): primary language for application logic — DOM manipulation, UI state management and interaction with browser APIs.
  - Why: enables a full client-side editing experience, reducing latency and backend requirements.

- HTML5: semantic document structure and accessibility support.
  - Why: semantic markup improves compatibility with screen readers and makes the app more maintainable.

- CSS3 (Flexbox, Grid, Media Queries): responsive layout and styling.
  - Why: ensures a consistent UX across screen sizes and devices.

- Web APIs (File API, Blob, URL, Canvas): client-side file handling and rendering.
  - Why: allow opening, processing and exporting PDF content in the browser without mandatory uploads.
- Local vendor assets: Font Awesome 6.7.2 and PDFMake 0.2.20 are stored under `assets/vendor/`; their license files are kept alongside the assets.
  - Why: the app remains usable after browser cache cleanup and does not require `node_modules` or a CDN for its runtime dependencies.

### Note about libraries
- The project uses Font Awesome and PDFMake from local vendor directories. There is no package dependency for the application runtime, and the build script uses Node.js built-ins.

## Project structure
- Single-page application with a simple front-end code organization (HTML/CSS/JS).
- Development entry point: `index.html`.
- Production entry point generated in `dist/app.html`.
- Production assets are collected from `assets/`, `config/` and the bundled source files.
- `scripts/build.js` creates the standalone production output.
- `scripts/server.js` serves either the development files or the production output.
- `config/manifest.json` contains the Progressive Web App metadata.
- The generated service worker caches the production app shell and its local assets.
- Processing and content transformations are performed client-side using Canvas and browser file APIs when possible. Heavy operations (if any) should be performed asynchronously to keep the UI responsive.
- Component-oriented design (separation of concerns: UI, editing logic, and PDF generation/export).

## Requirements and compatibility
- Supported browsers: modern versions of Chrome, Edge, Firefox and Safari (WebKit/Chromium engines recommended).
- Devices: Desktop and tablets; layout adapts for mobile devices.
- No server-side tools are required for basic usage (a browser is sufficient). For local development, serving files via a static HTTP server is recommended to avoid CORS and URL limitations when using file APIs.

## Running locally
Requirements: Node.js 18 or newer.

Start the development server:

```sh
npm install
npm run dev
```

The development server is available at http://localhost:4173/.

## Production build

Create the standalone production output with:

```sh
npm run build
```

Preview it locally with:

```sh
npm run preview
```

The `dist/` directory is the deployment root for Vercel and contains the generated `app.html`, assets, service worker and deployment configuration.

## Basic usage
1. Open the application in the browser.
2. Add document content using the title, text, image, table, list, link or code tools.
3. Select document content to edit, resize it or apply formatting.
4. Configure document metadata and layout when needed.
5. Use the export or print controls to save the resulting PDF locally.

## Testing and quality
- There is no standardized automated test runner in the repository.
- Validate visual changes in the development server at desktop and mobile viewport sizes.
- Run `npm run build`, then use `npm run preview` to verify the production bundle.
- Adding automated tests is recommended for complex PDF manipulation logic.

## Accessibility, security and privacy
- Accessibility: use semantic markup, clear labels, sufficient contrast and keyboard navigation. Strive for WCAG compliance as the project evolves.
- Security and privacy: by default processing is done client-side (in the browser), avoiding unintentional uploads to remote servers. Avoid including libraries that require sending data to third parties.
- Input validation: sanitize text and metadata before embedding into documents to reduce risks of injection or file corruption.

## Terms and copyright
See `TERMS_OF_USE.md` for the usage terms and `LICENSE` for the copyright notice.

## Credits
Created by [Domingos Firmino Cameme](https://github.com/domingos-firmino-cameme).

## Contact
Questions and reports can be sent through the repository issue tracker:

https://github.com/domingos-firmino-cameme/A-SIMPLE-PDF-EDITOR/issues
