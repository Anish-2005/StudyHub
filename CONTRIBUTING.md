# Contributing to StudyHub

Thanks for contributing.

## Ground Rules

- Keep changes focused and scoped.
- Do not commit secrets or local credentials.
- Prefer readable, maintainable code over clever code.
- Preserve existing UI patterns unless the change explicitly redesigns them.

## Local Development

1. Fork and clone:
   ```bash
   git clone https://github.com/<your-username>/StudyHub.git
   cd StudyHub
   npm install
   ```
2. Configure `.env.local` with Firebase values.
3. Start the app:
   ```bash
   npm run dev
   ```

## Branching

- Create feature branches from `main`.
- Branch name examples:
  - `feature/topic-sharing`
  - `fix/sidebar-overflow`
  - `docs/readme-refresh`

## Code Quality

Before opening a PR:

```bash
npm run lint
npm run build
```

If either command fails, fix it before requesting review.

## Pull Request Checklist

- Clear title and summary
- Linked issue (if available)
- Screenshots or short video for UI changes
- Notes about migrations/config changes (if any)
- Confirmation that lint and build pass

## Commit Style (Recommended)

Use concise, descriptive commits.

Examples:

- `feat: add task deep-link sharing`
- `fix: remove horizontal overflow in collapsed sidebar`
- `docs: rewrite readme for setup clarity`

## Reporting Issues

When filing a bug, include:

- Reproduction steps
- Expected vs actual behavior
- Browser/device details
- Screenshots if UI-related

## Security

If you discover a security issue, do not open a public issue with sensitive details. Contact the maintainer directly.
