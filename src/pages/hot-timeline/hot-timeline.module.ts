import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotTimelinePage } from './hot-timeline';

@NgModule({
  declarations: [
    HotTimelinePage,
  ],
  imports: [
    IonicPageModule.forChild(HotTimelinePage),
  ],
})
export class HotTimelinePageModule {}
