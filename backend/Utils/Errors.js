class Errors {
    static SQL = 'Unsolvable';
    static InvalidToken = 'Invalid token';
    static AccessForbidden = 'Forbidden';
    static IncorrectLogin = 'Auth error';
    static IncorrectPass = 'Auth error';
    static PassValidationFailed = 'Auth error';
    static UserDeactivated = 'Auth error';
    static InvalidRegisterPass = 'Bad password';
    static RegisterNoPassOrLogin = 'No password or login';
    static RegistrationFailed = 'Registration error';
    static EmptyArgsFields = 'Empty fields';
    static IncorrectMsgReciever = 'Incorrect msg reciever';
    static UserNotFOund = 'Incorrect user';
    static MsgSendForbidden = 'Msg forbidden';
    static UpdNotOwnMsg = 'Upd forbidden';
    static MsgInClosedTicket = 'Ticket closed';
    static NotEnoughPerms = 'Not enough perms';
    static UpdateOfNotificationTicket = 'Changes forbidden';
    static ForbiddenTranslationType = 'This type of translation is forbidden';
    static TranslationInsertLangNoRu = 'Insert is possible only by ru lang';
    static TranslationRenamingLangNoRu = 'Renaming is possible only by ru lang';
}

export default Errors;