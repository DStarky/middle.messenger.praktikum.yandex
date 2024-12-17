import type { Props } from '../../../app/Block';
import Block from '../../../app/Block';

import MenuIcon from '../../../assets/icons/menu.svg';
import AttachmentIcon from '../../../assets/icons/attachment.svg';
import ArrowRightIcon from '../../../assets/icons/arrow-right.svg';
import type { MessageData } from '../../../components/common/Message/Message';

const template = `
  {{#if selectedChat}}
    <div class="chat-header">
      {{> Avatar src=selectedChat.avatar alt=selectedChat.name className="avatar_size-small"}}
      <div class="chat-header__name">{{selectedChat.name}}</div>
      <button class="chat-header__settings">
        <img src="${MenuIcon}" alt="menu" />
      </button>
    </div>
    <div class="chat-messages">
      {{#each messages}}
        {{> Message message=this}}
      {{/each}}
    </div>
    <div class="chat-input">
      <button class="chat-input__attach">
        <img src="${AttachmentIcon}" alt="attach" />
      </button>
      <div class="chat-input__message">
        {{> SimpleInput type="text" id="message" name="message" placeholder="Сообщение" className="simple-input_message"}}
      </div>
      {{> Button 
        type="button" 
        className="button_round" 
        icon="${ArrowRightIcon}" 
        alt="Send"
      }}
    </div>
  {{else}}
    <div class="no-chat-selected">
      Выберите чат, чтобы отправить сообщение
    </div>
  {{/if}}
`;

interface Chat {
  id: string;
  name: string;
  avatar: string;
}

interface InnerChatProps extends Props {
  selectedChat?: Chat | null;
  messages: MessageData[];
  className?: string;
  events?: Record<string, (e: Event) => void>;
}

export class InnerChat extends Block<InnerChatProps> {
  constructor(props: InnerChatProps) {
    super(props);
  }

  override render(): string {
    return template;
  }
}
