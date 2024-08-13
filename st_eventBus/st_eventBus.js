/*************************************************************
 * @author : th.kim
 * @date : 2024-06-12
 * @description : 캐치마인드 실시간 유저, 채팅 플랫폼 이벤트 생성
 * @target : st_chatSubscriber
 ==============================================================
 * Ver          Date            Author          Modification
 * 1.0          2024-06-12      th.kim          Initial Version
 **************************************************************/
import {LightningElement, track} from 'lwc';
import sendMessage from '@salesforce/apex/ST_EventBusController.sendMessage';
import userConnected from '@salesforce/apex/ST_EventBusController.userConnected';
import userDisconnected from '@salesforce/apex/ST_EventBusController.userDisconnected';

export default class StEventBus extends LightningElement {

    // 채팅 메시지 값
    @track messageText = '';

    constructor() {
        super();
        // beforeunload 이벤트 생성
        window.addEventListener('beforeunload', this.disconnectedUser);
        // 로드 되기 전 현재 유저 실시간 유저에 추가
        userConnected().then(() => {
        }).catch(err => {
            console.log('err :: ',err);
        });
    }

    /**
     * @description 사용자 접속 종료 시 실시간 유저에서 제외
     */
    disconnectedCallback() {
        this.disconnectedUser();
    }

    /**
     * @description 현재 유저 실시간 유저에서 제외
     */
    disconnectedUser() {
        userDisconnected().then(() => {
        }).catch(err => {
            console.log('err :: ',err);
        });
    }

    /**
     * @description 채팅 데이터 입력 값 저장
     * @param e onchange 이벤트
     */
    handleInputChange(e) {
        this.messageText = e.target.value;
    }

    /**
     * @description 엔터 누를 시 채팅 전송
     * @param e onkeyup 이벤트
     */
    handleKeyUp(e) {
        if (e.key === 'Enter' || e.keyCode === 13) this.handleSendMessage();
    }

    /**
     * @description 전송 버튼 클릭이나 엔터 누를 시 채팅 전송
     */
    handleSendMessage() {
        if (this.messageText.trim()) {
            sendMessage({message: this.messageText})
                .then(() => {
                    this.messageText = '';
                })
                .catch(error => {
                    console.error('Error sending message', error);
                });
        }
    }
}
