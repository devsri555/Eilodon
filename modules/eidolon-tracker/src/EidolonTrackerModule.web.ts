import { registerWebModule, NativeModule } from 'expo';

// EidolonTrackerModule is not available on the web platform.
class EidolonTrackerModule extends NativeModule<{}> {}

export default registerWebModule(EidolonTrackerModule, 'EidolonTrackerModule');
