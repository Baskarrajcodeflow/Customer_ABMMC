import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.prod';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  if (!environment.enableLogs) {
    console.log = function () {};
    console.warn = function () {};
    console.error = function () {};
  }