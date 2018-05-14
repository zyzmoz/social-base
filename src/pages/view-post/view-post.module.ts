import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPostPage } from './view-post';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ViewPostPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPostPage),
    ComponentsModule
  ],
})
export class ViewPostPageModule {}
