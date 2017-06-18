import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { MaterialEditorModule } from './material-editor/material-editor.module';
import { RouterModule } from '@angular/router';
import { MaterialEditorComponent } from './material-editor/material-editor.component';
import { HomeComponent } from './home/home.component';
import { UiComponentsModule } from './ui-components/ui-components.module';


const appRoutes = [{ path: 'home', component: HomeComponent },
  { path: 'material',      component: MaterialEditorComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UiComponentsModule,
    HomeModule,
    MaterialEditorModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
