'use strict';
var Alexa = require("alexa-sdk");
var appId = 'amzn1.ask.skill.44fdf1d5-89cb-4459-9163-e1f5c60e24e7'; //'amzn1.echo-sdk-ams.app.your-skill-id';
//TODO: add ARN after creating utterance and Intent schema

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.resources = 'languageString';
    alexa.registerHandlers(newSessionHandlers, startFirstAidHandlers, helpStateHandlers, CPRStateHandlers, CheckingStateHandlers, ChokingStateHandlers, AEDStateHandlers, CtrlBleedStateHandlers, BurnSateHandlers, PoisonStateHandlers, NeckInjStateHandlers, SpinalInjStateHandlers, StrokeStateHandlers);
    alexa.execute();
};

/*
################ First Aid States ################
*/
var FIRST_AID_STATES = {
	START: "_START_MODE",
    CHECKING_STATE: "_CHECKING_MODE",
    CPR_STATE: "_CPR_MODE",
    CHOKING_STATE: "_CHOKING_MODE",
    AED_STATE: "_AED_MODE",
    CTRL_BLEED_STATE: "_CTRL_BLEED_MODE",
    BURN_STATE: "_BURN_MODE",
    POISON_STATE: "_POISON_MODE",
    NECK_INJ_STATE: "_NECK_INJ_MODE",
    SPINAL_INJ_STATE: "_SPINAL_INJ_MODE",
    STROKE_STATE: "_STROKE_MODE",
    HELP: "_HELPMODE" // The user is asking for help.
};
// TODO: Change mapping literals when time allows
var KeyWordsHandler = {
	"Checking an Injured Adult": "InjureHandling",
	"injured": "InjureHandling",
	"Choking": "ChokingHandling",
	"CPR": "CPRHandling",
	"AED": "AEDHandling",
	"Controlling Bleeding": "CtrlBleedHandling",
	"Burns": "BurnsHandling",
	"Poisoning": "PoisoningHandling",
	"Neck Injuries": "NeckInjHandling",
	"Spinal Injuries": "SpinalInjHandling",
	"Stroke": "StrokeHandling"
};

var KeyWordsState = {
	"Checking an Injured Adult": FIRST_AID_STATES.CHECKING_STATE,
	"injured": FIRST_AID_STATES.CHECKING_STATE,
	"Choking": FIRST_AID_STATES.CHOKING_STATE,
	"CPR": FIRST_AID_STATES.CPR_STATE,
	"AED": FIRST_AID_STATES.AED_STATE,
	"Controlling Bleeding": FIRST_AID_STATES.CTRL_BLEED_STATE,
	"Burns": FIRST_AID_STATES.BURN_STATE,
	"Poisoning": FIRST_AID_STATES.POISON_STATE,
	"Neck Injuries": FIRST_AID_STATES.NECK_INJ_STATE,
	"Spinal Injuries": FIRST_AID_STATES.SPINAL_INJ_STATE,
	"Stroke": FIRST_AID_STATES.STROKE_STATE
};

//Custom cards to allow detailed interactions
var CPR_CARDS = {
	"1":"Step 1: Give 30 Chest Compressions. " +
		"Push hard, push fast in the middle of the chest" + 
		" at least 2 inches deep and at least " +
		"100 compressions per minute",
	"2":"Step 2: Give 2 Rescue Breaths. " + 
		"Tilt the head back and lift the chin up. " + 
		"Pinch the nose shut then make a complete seal over the person’s mouth. " + 
		"Blow in for about 1 second to make the chest clearly rise. " + 
		"Give rescue breaths, one after the other. ",
	"3":"Step 3: DO NOT STOP. Continue cycles of CPR. " +
		"Do not stop CPR except in one of these situations:" + 
		"You find an obvious sign of life, such as breathing. " + 
		"An AED is ready to use. " +
		"Another trained responder or EMS personnel take over. " + 
		"You are too exhausted to continue. " +
		"The scene becomes unsafe.",
	"next": "If you've done, say next to proceed."
};

var responseMap = {
    "WELCOME_MESSAGE" : "First Aid here. What can I help you with?",// Be sure to change this for your skill.
	"WELCOME_MESSAGE_REPROMPT": "What can I help you with? You can say I need ",
	"START_UNHANDLED": "You can say First Aid or start to start First Aid",
	"FIRST_AID_OPTIONS" : "Checking an Injured Adult, Choking, CPR, AED, " +
	"Controlling Bleeding, Burns, Poisoning, Neck Injuries, Spinal Injuries, Stroke",
	"HELP_MESSAGE": "You can say I need help with, with following keywords: ",
	"HELP_MESSAGE_REPROMPT": "I'm not sure what help you need. Please say any of the following: ",
	"HELP_UNHANDLED": "Say repeat to listen to help again, say stop to quit First Aid",
	"CANCEL_MESSAGE": "Goodbye!",
	"STOP_MESSAGE": "Would you like to continue on First Aid? Say yes to continue, say no to quit.",
	"NO_MESSAGE": "Ok, Let me known whenever you need First Aid. Goodbye!",
	"CPRUnhandled": "Sorry, I didn't get that. To start CPR procedure, say: give me instructions on CRP.",
	"CPR_STOP_MESSAGE": "Are you sure to stop?"
};

/*
################ Language Strings ################
*/

var newSessionHandlers = {
	// Fill out the intents-function that this Handler need to handle
    "LaunchRequest": function () {
        this.handler.state = FIRST_AID_STATES.START; //Change this line
        this.emitWithState("StartFirstAid"); //Change this line
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = FIRST_AID_STATES.START; //Change this line
        this.emitWithState("StartFirstAid"); //Change this line
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = FIRST_AID_STATES.HELP; //Change this line
        this.emitWithState("helpTheUser"); //Change this line
    },
    "Unhandled": function () {
        var speechOutput = responseMap["START_UNHANDLED"]; //Change this line
        this.emit(":ask", speechOutput, speechOutput); //Change this line
    }
};

var startFirstAidHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.START, {
	// Fill out the intents-function that this Handler need to handle
	"StartFirstAid": function () {
		var speechOutput = responseMap["WELCOME_MESSAGE"];
		var repromptText = responseMap["WELCOME_MESSAGE_REPROMPT"] + responseMap["FIRST_AID_OPTIONS"];
		// TODO: Think about what need to handle during the start state	
		// Emit alexa response
		this.emit(":ask", speechOutput, repromptText);
	},

	"AMAZON.HelpIntent": function () {
		this.handler.state = FIRST_AID_STATES.HELP;
		this.emitWithState("helpTheUser");
	},

	"InstructionRequestIntent": function () {
		handleUserRequest.call(this);
	},

	"AMAZON.StopIntent": function () {
		var speechOutput = responseMap["STOP_MESSAGE"];
        this.emit(":ask", speechOutput, speechOutput);
    },

    "AMAZON.CancelIntent": function () {
    	this.emit(":tell", responseMap["CANCEL_MESSAGE"]);
    },
  
	"Unhandled": function() {
		var speechOutput = responseMap["START_UNHANDLED"]; // Something wrong here
		this.emit(":ask", speechOutput, speechOutput);
	}
});

var helpStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.HELP, {
// Fill out the intents-function that this Handler need to handle
	"helpTheUser": function() {
		var optionMessage =  responseMap["FIRST_AID_OPTIONS"];
		var speechOutput = responseMap["HELP_MESSAGE"] + responseMap["FIRST_AID_OPTIONS"];
		var repromptText = responseMap["HELP_MESSAGE_REPROMPT"] + responseMap["FIRST_AID_OPTIONS"];
		this.emit(":ask", speechOutput, repromptText);
	},

	"InstructionRequestIntent": function () {
		handleUserRequest.call(this);
	},
	
	"AMAZON.RepeatIntent": function () {
        this.emitWithState("helpTheUser");
	},

	"AMAZON.HelpIntent": function () {
        this.emitWithState("helpTheUser");
	},

	"AMAZON.YesIntent": function() {
        if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
            this.handler.state = FIRST_AID_STATES.CPR_STATE;
            this.emitWithState("AMAZON.RepeatIntent");
        } else {
			this.handler.state = FIRST_AID_STATES.START;
			this.emitWithState("StartFirstAid");
        }
	},

	"AMAZON.NoIntent": function() {
		var speechOutput = responseMap["NO_MESSAGE"];
        this.emit(":tell", speechOutput);
	},

	"AMAZON.StopIntent": function () {
		var speechOutput = responseMap["STOP_MESSAGE"];
        this.emit(":ask", speechOutput, speechOutput);
    },

    "AMAZON.CancelIntent": function () {
    	var speechOutput = responseMap["CANCEL_MESSAGE"]
    	this.emit(":tell", speechOutput);
    },

    "Unhandled": function () {
    	var speechOutput = responseMap["HELP_UNHANDLED"];
        this.emit(":ask", speechOutput, speechOutput);
    },

    "SessionEndedRequest": function () {
    	console.log("Session ended in help state: " + this.event.request.reason);
    }

});

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

var CPRStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CPR_STATE, {
	"CPRHandling": function(number) {
		//TODO Elaborate on this section later
		var speechOutput = CPR_CARDS[number.toString()] + CPR_CARDS["next"];
		Object.assign(this.attributes, {
			"speechOutput": speechOutput,
			"repromptText": speechOutput,
			"step": number
		});
		this.emit(":ask", speechOutput, speechOutput);
	},

	// "AMAZON.StartOverIntent": function() {

	// },

	"AMAZON.NextIntent": function() {
		this.emitWithState("CPRHandling", this.attributes["step"] + 1);
	},

	"AMAZON.HelpIntent": function () {
		this.handler.state = FIRST_AID_STATES.HELP;
        this.emitWithState("helpTheUser");
	},

	"AMAZON.YesIntent": function() {
		//NOTE: SAYING YES HERE RESTART CPR PROCEDURE
		if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
            this.handler.state = FIRST_AID_STATES.CPR_STATE;
            this.emitWithState("AMAZON.RepeatIntent");
        } else {
			this.handler.state = FIRST_AID_STATES.CPR_STATE;
			this.emitWithState("CPRHandling");
        }
	},

	"AMAZON.NoIntent": function() {
		var speechOutput = responseMap["NO_MESSAGE"];
        this.emit(":tell", speechOutput);
	},

	"AMAZON.StopIntent": function () {
		var speechOutput = responseMap["CPR_STOP_MESSAGE"];
        this.emit(":ask", speechOutput, speechOutput);
    },

    "AMAZON.CancelIntent": function () {
    	this.emit(":tell", responseMap["CANCEL_MESSAGE"]);
    },

    "Unhandled": function () {
    	var speechOutput = responseMap["CPRUnhandled"];
        this.emit(":ask", speechOutput, speechOutput);
    },

    "SessionEndedRequest": function () {
    	console.log("Session ended in help state: " + this.event.request.reason);
    }


});
// All other handlers are unnecessary
var CheckingStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CHECKING_STATE, {
	"InjureHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}

});

var ChokingStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CHOKING_STATE, {
	"ChokingHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}

});

var AEDStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.AED_STATE, {
	"AEDHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}
});

var CtrlBleedStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES, {
	"CtrlBleedHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}
});

var BurnSateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.BURN_STATE, {
	"BurnsHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}
});

var PoisonStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.POISON_STATE, {
	"PoisoningHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}
});

var NeckInjStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.NECK_INJ_STATE, {
	"NeckInjHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}
});

var SpinalInjStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.SPINAL_INJ_STATE, {
	"SpinalInjHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}
});

var StrokeStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.STROKE_STATE, {
	"StrokeHandling": function(number) {
	var speechOutput = "Call 911";
	this.emit(":tell", speechOutput);
	}
});



/*
############# Helper Functions #############
*/

// handle the case when user need different instructions
function handleUserRequest() {
	//Need handle 10 different user requests
	var keyWordSlotValid = isKeyWordValid(this.event.request.intent);
	var requestedSate = "";
	var requestedHandler = "";
	if (keyWordSlotValid) {
		requestedSate = retriveState(this.event.request.intent);
		requestedHandler = retriveHandler(this.event.request.intent);

	} else {
		requestedSate = FIRST_AID_STATES.HELP;
		requestedHandler = "helpTheUser";
	}
	//change the state here skipped calling handling function
	this.handler.state = requestedSate;
	this.emitWithState(requestedHandler, 1);

	//change line below
	// this.emit(":ask", speechOutput, repromptText, this.t("GAME_NAME"), repromptText);
}

// function handleCPRRestartRequest(){
// 	if (this.event.request.intent.slots.CPRStep.value == "chest compressions") {

// 	} else if (this.event.request.intent.slots.CPRStep.value == "rescue breaths") {

// 	} else if (this.event.request.intent.slots.CPRStep.value == "breaths") {

// 	} else {

// 	}
// }

// function handleSpecialCPRRequest() {

// }

function isKeyWordValid(intent) { // Try to fix problem here
	return intent && intent.slots && intent.slots.KeyWord && intent.slots.KeyWord.value && (intent.slots.KeyWord.value in KeyWordsHandler);
}

function retriveState(intent) {
	return KeyWordsState[intent.slots.KeyWord.value];
}

function retriveHandler(intent) {
	return KeyWordsHandler[intent.slots.KeyWord.value];
}