import { Component } from '@angular/core';

import { SearchPage } from '../search/search';
import { HotTimelinePage } from '../../pages/hot-timeline/hot-timeline';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = 'HotTimelinePage';
  tab3Root = 'SearchPage';
  tab4Root = 'NotificationsPage';
  tab5Root = 'MessagesPage';

  constructor() {

  }
}
