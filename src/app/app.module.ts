import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { MaterialEditorModule } from './material-editor/material-editor.module';
import { RouterModule } from '@angular/router';
import { MaterialEditorComponent } from './material-editor/material-editor.component';
import { HomeComponent } from './home/home.component';
import { UiComponentsModule } from './ui-components/ui-components.module';
import { CoreModule } from './core/core.module';
import { StoreModule } from '@ngrx/store';
import { plateReducer } from './reducers/plate.reducer';
import { materialOptionsReducer } from './reducers/material-options.reducer';


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
    CoreModule,
    HomeModule,
    MaterialEditorModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore({
      plate: plateReducer,
      materialOptions: materialOptionsReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
