Turbo dev is failing due to two issues:

1. Root package.json lacked workspace/packageManager metadata.
   - Fixed by adding:
     - packageManager
     - workspaces: ["apps/_", "packages/_"]

2. turbo.json uses old key `pipeline`.
   - Turbo v2 expects `tasks`.

Next steps to fix:

- Rename `pipeline` -> `tasks` in turbo.json.
- Re-run `npm run dev`.
