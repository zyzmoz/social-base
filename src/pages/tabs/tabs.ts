import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ChatProvider } from '../../providers/chat/chat';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = 'HotTimelinePage';
  tab3Root = 'SearchPage';
  tab4Root = 'NotificationsPage';
  tab5Root = 'MessagesPage';

  unreadMessages: any[] = [];
  constructor(
    private chatProvider : ChatProvider
  ) {
    this.chatProvider.isUnread().subscribe( data =>{
      this.unreadMessages = data;
    })
  }
}
