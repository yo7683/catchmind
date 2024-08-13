/*************************************************************
 * @author : th.kim
 * @date : 2024-06-12
 * @description : 캐치마인드 메인 화면
 * @target : App Page
 ==============================================================
 * Ver          Date            Author          Modification
 * 1.0          2024-06-12      th.kim          Initial Version
 **************************************************************/
import {LightningElement, track} from 'lwc';

export default class STChatSubscriber extends LightningElement {

    // 채팅 데이터
    @track messages = [];

    // 채널명
    eventChannelName = '/event/TestEvent__e';

    connectedCallback() {
        this.handleSubscribe();
    }

    /**
     * @description 채팅 플랫폼 이벤트 가져오기
     */
    handleSubscribe() {
        // 채팅 생성
        const messageCallback = (res) => {
            const message = res.data.payload;
            const newMessage = {
                id: this.messages.length + 1,
                sender: message.Sender__c,
                text: message.Message__c,
                timestamp: message.SendTime__c
            };
            this.messages = [...this.messages, newMessage];
            this.scrollToBottom();
        };

        subscribe(this.eventChannelName, -1, messageCallback).then(response => {
            console.log('res', response);
        }).catch(error => {
            showToast('Error subscribing to channel', error.body.message, 'error');
        });

        // Debug Flag
        setDebugFlag(true);

        // 에러 처리
        onError(error => {
            console.error('Error in streaming channel', error);
            showToast('Streaming channel error', error.body.message, 'error');
        });
    }

    /**
     * @description 새 채팅 올라올 시 채팅 맨 밑으로 focus
     */
    scrollToBottom() {
        setTimeout(() => {
            const chatContainer = this.template.querySelector('.chat-window');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 0);
    }
}