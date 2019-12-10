# Altar Workspace Cleaner

The Altar Workspace Cleaner performs the following tasks:

- Parsing `ALTAR_PROJECT` environment variable
- Cleanup workspace directory from disk

`ALTAR_PROJECT` environment variable is JSON format and satisfies the following format:

```typescript
type AltarProject = {
  // Project ID
  id: string;
};
```
