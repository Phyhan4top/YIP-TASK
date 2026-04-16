# Product Upload App

A clean React Native product upload app built with Expo, TypeScript, Context API, and AsyncStorage.

## Features

- Add up to five products with a name, price, and photo.
- Pick a product photo from the gallery or camera.
- Preview the image before saving.
- Validate empty names, missing images, and invalid prices.
- Edit or delete any saved product.
- Persist products locally with AsyncStorage.
- Show a clear limit notice and disable fresh uploads after the fifth product.

## Stack

- Expo + React Native
- TypeScript
- Context API for local state management
- AsyncStorage for persistence
- `expo-image-picker` for camera and gallery access

## Project Structure

```text
.
|-- App.tsx
|-- src
|   |-- components
|   |-- constants
|   |-- context
|   |-- hooks
|   |-- screens
|   |-- types
|   `-- utils
|-- docs
|   `-- Product-Upload-App-Walkthrough.pdf
`-- scripts
    `-- generate_walkthrough.py
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo development server:

   ```bash
   npm run start
   ```

3. Open the project in an Android emulator, iOS simulator, or Expo Go.

## Notes

- The PDF walkthrough is generated into `docs/Product-Upload-App-Walkthrough.pdf`.
- If you want to refresh the walkthrough after editing the app, run:

  ```bash
  python scripts/generate_walkthrough.py
  ```
