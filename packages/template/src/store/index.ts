import { createPinia } from 'pinia'

// Singleton pinia instance for the app. main.ts installs this via app.use().
// Tests create their own pinia via createPinia() + setActivePinia().
const pinia = createPinia()

export default pinia
