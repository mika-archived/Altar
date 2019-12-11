# DynamoDB Table Structure

Altar DynamoDB

## Table Structure

| Key Name             | Type         |
| -------------------- | ------------ |
| Partition Key (`id`) | `String`     |
| `dependencyNames`    | `String Set` |
| `dependencyVersions` | `String Set` |
| `executor`           | `String`     |
| `fileContents`       | `String Set` |
| `fileTitles`         | `String Set` |
| `title`              | `String`     |
| `out`                | `String`     |
