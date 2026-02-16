# RPG Notes to .md Migrator
A web tool for automated migration of knowledge bases and notes from the RPG Notes mobile app to Markdown format, with full preservation of tags and internal links.

[Live Demo](http://rpg-notes-to-md.vercel.app)

## Why it was created
TTRPG Game Masters are increasingly moving toward professional note-taking tools like Obsidian, which has become the industry standard for building complex knowledge bases.

This tool solves the migration problem from the RPG Notes mobile app. It automates the transfer of thousands of notes while preserving their structure, turning hours of manual copying into a few seconds of script execution.

## Tech Stack
*   **React**: Building a reactive and responsive interface.
*   **TypeScript + Zod**: Strict typing and data schema validation to prevent errors when parsing complex JSON structures.
*   **JSZip**: Client-side data processing and archive generation, ensuring complete data privacy.
*   **Tailwind CSS**: Efficient styling and rapid UI prototyping.
*   **Vitest + React Testing Library**: Ensuring reliability through Unit and Snapshot testing.

## Technical Challenges & Solutions

### Structure Construction Algorithm Optimization
The initial approach to building the directory tree had a complexity of O(n^2). By implementing auxiliary Map objects for link indexing, I optimized the algorithm to ensure high performance even with very large databases.

### Cross-platform Path Safety
I implemented a specialized regulator class that handles duplicate names and specific file system constraints for various operating systems (Windows, macOS, Linux). This guarantees that the generated archive will extract correctly on any platform.

### Type-safe Polymorphic Components
Implemented the type-safe polymorphic components pattern (using the Button component as an example). Used **Discriminated Unions** to strictly segregate HTML element attributes (button vs a), which eliminates passing invalid props and ensures UI layer consistency.

### Quality Assurance via Snapshot Testing
Snapshot tests were applied to verify the correctness of Markdown content generation. This allows for instant tracking of regressions in the output file structure during logic refactoring.

## Setup Instructions (for developers)
```npm i```
```npm run dev```

## Future (To-do)
- **Refactoring**: Completely extracting content assembly logic into generateNoteContent function to eliminate minor bugs related to missing headers.
- **UX**: Adding a progress indicator and support for processing multiple files simultaneously.
- **Performance**: Memory optimization via temporary Blob object cleanup.
- **Localization**: Adding support for the Russian language.