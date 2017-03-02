/*
################ First Aid States ################
*/

var FIRST_AID_STATES = {
    CHECK_INJD_ILL_ADLT_STATE: "_CHECK_INJ_ILL_ADLT_MODE", // start checking injured or illed adult mode.
    CPR_STATE: "_CPRMODE", // CPR Start Mode, start instruction on CPR
    //TODO: Add more here
    HELP: "_HELPMODE" // The user is asking for help.
};

'use strict';
var Alexa = require("alexa-sdk");
var appId = undefined; //'amzn1.echo-sdk-ams.app.your-skill-id';
//TODO: add ARN after creating utterance and Intent schema

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = 'highLowGuessUsers';
    alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers, guessAttemptHandlers);
    alexa.execute();
};

/*
################ Handelers ################
*/









