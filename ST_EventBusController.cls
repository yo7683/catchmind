/*************************************************************
 * @author : th.kim
 * @date : 2024-06-12
 * @description : 캐치마인드 Apex 컨트롤러
 * @target : st_chatSubscriber, st_eventBus
==============================================================
 * Ver          Date            Author          Modification
 * 1.0          2024-06-12      th.kim          Initial Version
**************************************************************/
public with sharing class ST_EventBusController {

    /**
     * @author th.kim
     * @description 플랫폼 이벤트 메시지 생성
     * @param message 전송할 메시지 값
     */
    @AuraEnabled
    public static void sendMessage(String message) {
        Id userId = UserInfo.getUserId();
        TestEvent__e chatMessage = new TestEvent__e(
                Message__c = message,
                Sender__c = [SELECT Alias FROM User WHERE Id = :userId LIMIT 1].Alias,
                UserId__c = userId,
                SendTime__c = System.now()
        );
        EventBus.publish(chatMessage);
    }

    /**
     * @author th.kim
     * @description 사용자가 접속했음을 나타내는 플랫폼 이벤트 레코드 생성
     */
    @AuraEnabled
    public static void userConnected() {
        UserStatus__e session = new UserStatus__e(
                UserId__c = UserInfo.getUserId(),
                IsOnline__c = true
        );
        EventBus.publish(session);
    }

    /**
     * @author th.kim
     * @description 사용자가 접속을 종료했음을 나타내는 플랫폼 이벤트 레코드 생성
     */
    @AuraEnabled
    public static void userDisconnected() {
        UserStatus__e session = new UserStatus__e(
                UserId__c = UserInfo.getUserId(),
                IsOnline__c = false
        );
        EventBus.publish(session);
    }

    /**
     * @author th.kim
     * @description 현재 접속중인 유저 가져오기
     * @return 현재 User 리스트
     */
    @AuraEnabled
    public static List<User> getOnlineUserCount() {
        return [SELECT Id, Alias FROM User WHERE IsOnline__c = TRUE ORDER BY LastModifiedDate ASC];
    }

    /**
     * @author th.kim
     * @description 그림 데이터 보여주기 위한 플랫폼 이벤트 레코드 생성
     * @param drawingData 그림 데이터
     */
    @AuraEnabled
    public static void sendDrawingData(String drawingData) {
        DrawEvent__e objEvent = new DrawEvent__e(
                UserId__c = UserInfo.getUserId(),
                DrawingData__c = drawingData
        );
        EventBus.publish(objEvent);
    }
}
