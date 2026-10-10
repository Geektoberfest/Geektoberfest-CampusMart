# Contributing to CampusMart

Thanks for contributing! CampusMart is intentionally kept simple so students can understand the codebase.

## Workflow
1. Fork and clone the repository.
2. Create a branch such as `feature/favorites` or `fix/login-validation`.
3. Install dependencies in both `client` and `server`.
4. Create local `.env` files from the examples.
5. Make one focused change.
6. Test the affected API and UI manually.
7. Open a pull request with a short summary and testing notes.

## Good first contributions
- Improve empty states or accessibility labels.
- Add the price quick-filter feature.
- Add favorites/saved listings.
- Improve image upload UX.
- Add Cloudinary storage support.

## Code guidelines
- Keep components small and readable.
- Keep API calls in `client/src/services`.
- Keep database logic in server controllers/models.
- Never commit `.env`, secrets or uploaded files.
- Validate on the backend even if the frontend validates first.
- Avoid unnecessary dependencies.
