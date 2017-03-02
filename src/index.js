/*
################ First Aid States ################
*/
/*
"Checking an Injured Adult"
"Choking"
"CPR"
"AED"
"Controlling Bleeding"
"Burns"
"Poisoning"
"Neck Injuries"
"Spinal Injuries"
"Stroke"
*/

var FIRST_AID_STATES = {
	START: "_START_MODE",
    INSTRUCTION_STATE: "_INSTRUCTION_MODE", // start checking injured or illed adult mode.
    CHECHING_STATE: "_CHECKING_MODE",
    CPR_STATE: "_CPR_MODE",
    CHOKING_STATE: "_CHOKING_MODE",
    AED_STATE: "_AED_MODE",
    CTRL_BLEED_STATE: "_CTRL_BLEED_MODE",
    BURN_STATE: "_BURN_MODE",
    POISON_STATE: "_POISON_MODE",
    NECK_INJ_STATE: "_NECK_INJ_MODE",
    SPINAL_INJ_STATE: "_SPINAL_INJ_MODE",
    STROKE_STATE: "_STROKE_MODE"
    //TODO: Add more here
    HELP: "_HELPMODE" // The user is asking for help.
};

var KeyWords = {
	"Checking an Injured Adult": FIRST_AID_STATES.CHECHING_STATE,
	"injured": FIRST_AID_STATES.CHECHING_STATE,
	"Choking": FIRST_AID_STATES.CHOKING_STATE,
	"CPR": FIRST_AID_STATES.CPR_STATE,
	"AED": FIRST_AID_STATES.AED_STATE,
	"Controlling Bleeding": FIRST_AID_STATES.CTRL_BLEED_STATE,
	"Burns": FIRST_AID_STATES.BURN_STATE,
	"Poisoning": FIRST_AID_STATES.POISON_STATE,
	"Neck Injuries": FIRST_AID_STATES.NECK_INJ_STATE,
	"Spinal Injuries": FIRST_AID_STATES.SPINAL_INJ_STATE,
	"Stroke": FIRST_AID_STATES.STROKE_STATE
}

var languageString = {
	    "en-US": {
        "translation": {
            "WELCOME_MESSAGE" : "%s here. What can I help you with?",// Be sure to change this for your skill.
        	"NAME": "First Aid",
        	"START_UNHANDLED": "Say I need First Aid to start First Aid",
        	"FIRST_AID_OPTIONS" : 
        		"Checking an Injured Adult, 
				Choking,
				CPR,
				AED,
				Controlling Bleeding,
				Burns,
				Poisoning,
				Neck Injuries,
				Spinal Injuries,
				Stroke",
        	"HELP_MESSAGE": "You can say I need help with, with following keywords:",
    		"HELP_MESSAGE_REPROMPT": "I'm not sure what help you need. Please say any of the following:",
        	"HELP_UNHANDLED": "Say repeat to listen to help again, say stop to quit Fisrt Aid",
        	"CANCEL_MESSAGE": "",
        	"STOP_MESSAGE": "Would you like to continue on First Aid? Say yes to continue, say no to quit.",
        	"NO_MESSAGE": "Ok, Let me known whenever you need First Aid. Goodbye!"
        }
}

/*
################ Language Strings ################
*/

'use strict';
var Alexa = require("alexa-sdk");
var appId = undefined; //'amzn1.echo-sdk-ams.app.your-skill-id';
//TODO: add ARN after creating utterance and Intent schema

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.resources = 'languageString';
    alexa.registerHandlers(newSessionHandlers, startFirstAidHandlers, instructionStateHandlers, helpStateHandlers);
    alexa.execute();
};

/*
TODO:
	Implement Counting for during chest compression

	YY in {"chest compressions", "rescue breaths", just "breaths"}
	Implement "How do I do YY"
	Implement "restart YY", "restart"(default = "chest compression")
	Implement "Quit CPR"
	Implement "what can I say?"
*/
/*
################ Handelers ################
*/

var newSessionHandlers = {
	// Fill out the intents-function that this Handler need to handle
    "LaunchRequest": function () {
        this.handler.state = FIRST_AID_STATES.START; //Change this line
        this.emitWithState("StartFirstAid", true); //Change this line
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = FIRST_AID_STATES.START; //Change this line
        this.emitWithState("StartFirstAid", true); //Change this line
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = FIRST_AID_STATES.HELP; //Change this line
        this.emitWithState("helpTheUser", true); //Change this line
    },
    "Unhandled": function () {
        var speechOutput = this.t("START_UNHANDLED"); //Change this line
        this.emit(":ask", speechOutput, speechOutput); //Change this line
    }
};

var startFirstAidHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.START, {
	// Fill out the intents-function that this Handler need to handle
	"StartFirstAid": function (newFirstAid) {
		var speechOutput = newFirstAidState ? this.t("WELCOME_MESSAGE", this.t("NAME")) : ""; //handel when newFirstAid is false
		// TODO: Think about what need to handle during the start state	
		// Set the current state to INSTRUCTION STATE
		this.handler.state = FIRST_AID_STATES.INSTRUCTION_STATE;
		// Emit alexa response
		this.emit(":ask something here") //TODO
		}
	"AMAZON.HelpIntent": function () {

	}

	"AMAZON.StopIntent": function() {

	}

	"AMAZON.CancelIntent": function() {

	}

	"Unhandled": function() {

	}
})

var instructionStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.INSTRUCTION_STATE, {
// Fill out the intents-function that this Handler need to handle
	"InstructionRequestIntent": function () {

	},

	"AMAZON.HelpIntent": function () {

	},

})

var helpStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.HELP, {
// Fill out the intents-function that this Handler need to handle
	"helpTheUser": function() {
		var optionMessage =  this.t("FIRST_AID_OPTIONS");
		var speechOutput = this.t("HELP_MESSAGE") + this.t("FIRST_AID_OPTIONS");
		var repromptText = this.("HELP_MESSAGE_REPROMPT") + this.t("FIRST_AID_OPTIONS");
		this.emit(":ask", speechOutput, repromptText);
	},

	"InstructionRequestIntent": function () {
        this.handler.state = FIRST_AID_STATES.START;
        this.emitWithState("StartFirstAid", false);
	},
	
	"AMAZON.RepeatIntent": function () {
		var newFirstAid = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
        this.emitWithState("helpTheUser", newFirstAid);
	}

	"AMAZON.HelpIntent": function () {
		var newFirstAid = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
        this.emitWithState("helpTheUser", newFirstAid);
	},

	"AMAZON.YesIntent": function() {
        this.handler.state = FIRST_AID_STATES.START;
        this.emitWithState("StartFirstAid", true);
	}

	"AMAZON.NoIntent": function() {
		var speechOutput = this.t("NO_MESSAGE");
        this.emit(":tell", speechOutput);
	}

	"AMAZON.StopIntent": function () {
		var speechOutput = this.t("STOP_MESSAGE");
        this.emit(":ask", speechOutput, speechOutput);
    },

    "AMAZON.CancelIntent": function () {
    	this.emit(":tell", this.t("CANCEL_MESSAGE"));
    },

    "Unhandled": function () {
    	var speechOutput = this.t("HELP_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    },

    "SessionEndedRequest": function () {
    	console.log("Session ended in help state: " + this.event.request.reason);
    }

})

var CPRStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CPR_STATE, {

})

var CheckingStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CHECHING_STATE, {

})

var ChokingStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CHOKING_STATE, {

})

var AEDStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.AED_STATE, {

})

var CtrlBleedStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES, {

})

var BurnSateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.BURN_STATE, {

})

var PoisonStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.POISON_STATE, {

})

var NeckInjStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.NECK_INJ_STATE, {

})

var SpinalInjStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.SPINAL_INJ_STATE, {

})

var StrokeStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.STROKE_STATE, {

})



/*
############# Helper Functions #############
*/

// handle the case when user need different instructions
function handleUserFirstAidRequest

