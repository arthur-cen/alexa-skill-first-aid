'use strict';
var Alexa = require("alexa-sdk");
var appId = 'amzn1.ask.skill.44fdf1d5-89cb-4459-9163-e1f5c60e24e7'; //'amzn1.echo-sdk-ams.app.your-skill-id';
 
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
	"checking an injured adult": "InjureHandling", //done
	"injured": "InjureHandling", //done
	"injuries": "InjureHandling", //done
	"choking": "ChokingHandling", //done
	"CPR": "CPRHandling", //done
	"AED": "AEDHandling", //done
	"controlling bleeding": "CtrlBleedHandling",//done
	"burns": "BurnsHandling", //done
	"poisoning": "PoisoningHandling", //done
	"neck injuries": "NeckInjHandling",
	"spinal injuries": "SpinalInjHandling",
	"stroke": "StrokeHandling" // done
};

var KeyWordsState = {
	"checking an injured adult": FIRST_AID_STATES.CHECKING_STATE,
	"injured": FIRST_AID_STATES.CHECKING_STATE,
	"injuries": FIRST_AID_STATES.CHECKING_STATE,
	"choking": FIRST_AID_STATES.CHOKING_STATE,
	"CPR": FIRST_AID_STATES.CPR_STATE,
	"AED": FIRST_AID_STATES.AED_STATE,
	"controlling bleeding": FIRST_AID_STATES.CTRL_BLEED_STATE,
	"burns": FIRST_AID_STATES.BURN_STATE,
	"poisoning": FIRST_AID_STATES.POISON_STATE,
	"neck injuries": FIRST_AID_STATES.NECK_INJ_STATE,
	"spinal injuries": FIRST_AID_STATES.SPINAL_INJ_STATE,
	"stroke": FIRST_AID_STATES.STROKE_STATE
};

//Custom cards to allow detailed interactions
var CPR_DIALOG = {
	"BEGIN":"Put the person on a flat and firm surface. ",

	"CHEST_COMPRESSIONS":"Step 1: Give 30 Chest Compressions. " +
		"Push hard, push fast in the middle of the chest" + 
		" at least 2 inches deep and at least " +
		"100 compressions per minute. ",
	"RESECUE_BREATHS_INTRO": "Step 2: Give 2 Rescue Breaths. ",
	"RESECUE_BREATHS": "Tilt the head back and lift the chin up. " + 
		"Pinch the nose shut then make a complete seal over the person’s mouth. " + 
		"Blow in for about 1 second to make the chest clearly rise. " + 
		"Give rescue breaths, one after the other. ",
	"DO_NOT_STOP":"Step 3: DO NOT STOP. Continue cycles of CPR. " +
		"Do not stop CPR except in one of these situations: " + 
		"You find an obvious sign of life, such as breathing. " + 
		"An AED is ready to use. " +
		"Another trained responder or EMS personnel take over. " + 
		"You are too exhausted to continue. " +
		"The scene becomes unsafe. ",
	"NEXT": "If you've done, say next to proceed.",
	"HELP_MESSAGE": "you can say: how do i do, " +
		"with following commands: chest compressions," +
		" rescue breaths or breaths",
	"SAYREADY": "Say ready to begin CPR procedure.",
	"BEGIN_CHEST_COMPRESSIONS": "Begin Chest Compressions. ",
	"BEGIN_RESECUE_BREATHS_FIRST": "Begin first Resecue Breaths. ",
	"BEGIN_RESECUE_BREATHS_SECOND": "Begin second Resecue Breaths. ",
	"SAYDONE": "Say Done when you are done. ",
	"STOP_MESSAGE": "Are you sure you want to stop?",
	"Unhandled": "Sorry, I didn't get that. To start CPR procedure, say: give me instructions on CPR. ",
	"CANCEL_MESSAGE": "Goodbye!",
	"NO_MESSAGE": "Continue on CPR. ",
	"SAYRESTART": "Say restart to repeat the procedure from chest compressions. "
};


var responseMap = {
    "WELCOME_MESSAGE" : "First Aid here. What can I help you with?",// Be sure to change this for your skill.
	"WELCOME_MESSAGE_REPROMPT": "What can I help you with? You can say I need ",
	"START_UNHANDLED": "You can say First Aid or start to start First Aid. ",
	"FIRST_AID_OPTIONS" : "Checking an Injured Adult, Choking, CPR, AED, " +
	"Controlling Bleeding, Burns, Poisoning, Neck Injuries, Spinal Injuries, Stroke",
	"HELP_MESSAGE": "You can say I need help with, with following keywords: ",
	"HELP_MESSAGE_REPROMPT": "I'm not sure what help you need. Please say any of the following: ",
	"HELP_UNHANDLED": "Say repeat to listen to help again, say stop to quit First Aid",
	"CANCEL_MESSAGE": "Goodbye!",
	"STOP_MESSAGE": "Would you like to continue on First Aid? Say yes to continue, say no to quit.",
	"NO_MESSAGE": "Ok, Let me known whenever you need First Aid. Goodbye!"
};

/*
################ Language Strings ################
*/

var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = FIRST_AID_STATES.START; 
        this.emitWithState("StartFirstAid"); 
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = FIRST_AID_STATES.START; 
        this.emitWithState("StartFirstAid"); 
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = FIRST_AID_STATES.HELP; 
        this.emitWithState("helpTheUser"); 
    },
    "Unhandled": function () {
        var speechOutput = responseMap["START_UNHANDLED"]; 
        this.emit(":ask", speechOutput, speechOutput); 
    }
};

var startFirstAidHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.START, {
	"StartFirstAid": function () {
		var speechOutput = responseMap["WELCOME_MESSAGE"];
		var repromptText = responseMap["WELCOME_MESSAGE_REPROMPT"] + responseMap["FIRST_AID_OPTIONS"];
		this.emit(":ask", speechOutput, repromptText);
	},

	"AMAZON.HelpIntent": function () {
		this.handler.state = FIRST_AID_STATES.HELP;
		this.emitWithState("helpTheUser");
	},

	"AMAZON.StartOverIntent": function() {
        this.emitWithState("StartFirstAid");
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
		var speechOutput = responseMap["START_UNHANDLED"];
		this.emit(":ask", speechOutput, speechOutput);
	}
});

var helpStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.HELP, {
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
    	var speechOutput = responseMap["CANCEL_MESSAGE"];
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
################ Handelers ################
*/

var CPRStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CPR_STATE, {
	"CPRHandling": function(step) {
		var speechOutput = CPR_DIALOG["BEGIN"] + CPR_DIALOG["SAYREADY"];
		Object.assign(this.attributes, {
			"speechOutput": speechOutput,
			"repromptText": speechOutput,
			"step": step,
			"cycle": 0
		});
		this.emit(":ask", speechOutput, speechOutput);
	},

	"CPR_Steps": function(step, cycle) {
		var speechOutput = "";
		if (cycle == 0) {
			if (step == 0) {
				speechOutput += CPR_DIALOG['BEGIN_CHEST_COMPRESSIONS'];
				speechOutput += CPR_DIALOG['CHEST_COMPRESSIONS'];
			} else if (step == 1) {
				speechOutput += CPR_DIALOG['RESECUE_BREATHS_INTRO']
				speechOutput += CPR_DIALOG['BEGIN_RESECUE_BREATHS_FIRST'];
				speechOutput += CPR_DIALOG['RESECUE_BREATHS'];
			} else if (step == 2) {
				speechOutput += CPR_DIALOG['RESECUE_BREATHS_INTRO']
				speechOutput += CPR_DIALOG['BEGIN_RESECUE_BREATHS_SECOND'];

			} else {
				Object.assign(this.attributes, {
				"step": (step + 1) % 4,
				"cycle": cycle + 1
				});

				speechOutput += CPR_DIALOG['DO_NOT_STOP'];
				speechOutput += CPR_DIALOG['SAYRESTART'];
				this.emit(":ask", speechOutput, speechOutput);
			}
		} else {
			if (step == 0) {
				speechOutput += CPR_DIALOG['BEGIN_CHEST_COMPRESSIONS'];
			} else if (step == 1) {
				speechOutput += CPR_DIALOG['BEGIN_RESECUE_BREATHS_FIRST'];
			} else if (step == 2) {
				speechOutput += CPR_DIALOG['BEGIN_RESECUE_BREATHS_SECOND'];
			} else {
				Object.assign(this.attributes, {
				"step": step,
				"cycle": cycle + 1
				});

				speechOutput += CPR_DIALOG['DO_NOT_STOP'];
				speechOutput += CPR_DIALOG['SAYRESTART'];
				this.emit(":ask", speechOutput, speechOutput);
			}
		}
		
		speechOutput += CPR_DIALOG["SAYDONE"];
		this.emit(":ask", speechOutput, speechOutput);
	},

	"AMAZON.StartOverIntent": function() {
		if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
			this.emitWithState("CPR_Steps", 0, 0);
		} else {
			this.handler.state = FIRST_AID_STATES.START;
			this.emitWithState("StartFirstAid");
		}
	},

	"CPRRestartIntent": function() {
		handleSpecialCPRRequest.call(this);
	},

	"CPRInstructionRequestIntent": function() {
		handleSpecialCPRRequest.call(this);
	},

	"UserDoneIntent": function() {
		var step = this.attributes['step'];
		var cycle = this.attributes['cycle'];
		Object.assign(this.attributes, {
			"step": (step + 1) % 4,
			"cycle": cycle
		});

		this.emitWithState("CPR_Steps", this.attributes['step'], this.attributes['cycle']);
	},

	"UserReadyIntent": function() {
		this.emitWithState("CPR_Steps", this.attributes['step'], this.attributes['cycle']);
	},

	"AMAZON.HelpIntent": function () {
		this.emit(":tell", CPR_DIALOG['HELP_MESSAGE']);
	},

	"AMAZON.YesIntent": function() {
		this.emit(":tell", CPR_DIALOG["CANCEL_MESSAGE"]);
	},

	"AMAZON.NoIntent": function() {
        this.emitWithState("CPR_Steps", this.attributes["step"], this.attributes["cycle"]);
	},

	"AMAZON.StopIntent": function () {
		var speechOutput = CPR_DIALOG["STOP_MESSAGE"];
        this.emit(":ask", speechOutput, speechOutput);
    },

    "AMAZON.CancelIntent": function () {
    	this.emitWithState("SessionEndedRequest");
    },

    "Unhandled": function () {
    	var speechOutput = CPR_DIALOG["Unhandled"];
        this.emit(":ask", speechOutput, speechOutput);
    },

    "SessionEndedRequest": function () {
    	console.log("Session ended in CPR state: " + this.event.request.reason);
    }


});
// All other handlers are used for future development on other intents
var CheckingStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CHECKING_STATE, {
	"InjureHandling": function(step) {
		var speechOutput = "Call 911";
		this.emit(":tell", speechOutput);
	}
});

var ChokingStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CHOKING_STATE, {
	"ChokingHandling": function(step) {
		var speechOutput = "Is the person conscious?";
		this.emit(":ask", speechOutput, speechOutput);
	},

	"AMAZON.YesIntent": function() {
		this.emit(":tell", "Call 911. ");
	},

	"AMAZON.NoIntent": function() {
		this.emit(":tell", "Call 911. ")
	}
});

var AEDStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.AED_STATE, {
	"AEDHandling": function(step) {
		var speechOutput = "Call 911";
		this.emit(":tell", speechOutput);
	}
});

var CtrlBleedStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.CTRL_BLEED_STATE, {
	"CtrlBleedHandling": function(step) {
		var speechOutput = "Call 911";
		this.emit(":tell", speechOutput);
	}
});

var BurnSateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.BURN_STATE, {
	"BurnsHandling": function(step) {
		var speechOutput = "Call 911";
		this.emit(":tell", speechOutput);
	}
});

var PoisonStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.POISON_STATE, {
	"PoisoningHandling": function(step) {
		var speechOutput = "Call 911";
		this.emit(":tell", speechOutput);
	}
});

var NeckInjStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.NECK_INJ_STATE, {
	"NeckInjHandling": function(step) {
		var speechOutput = "Call 911";
		this.emit(":tell", speechOutput);
	}
});

var SpinalInjStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.SPINAL_INJ_STATE, {
	"SpinalInjHandling": function(step) {
		var speechOutput = "Call 911";
		this.emit(":tell", speechOutput);
	}
});

var StrokeStateHandlers = Alexa.CreateStateHandler(FIRST_AID_STATES.STROKE_STATE, {
	"StrokeHandling": function(step) {
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
		requestedSate = FIRST_AID_STATES.START;
		requestedHandler = "StartFirstAid";
	}
	this.handler.state = requestedSate;
	this.emitWithState(requestedHandler, 0);
}

function handleSpecialCPRRequest() {
	if (isCPRSpecialRequestValid(this.event.request.intent)) {
		if (this.event.request.intent.slots.CPRStep.value == 'breaths' || this.event.request.intent.slots.CPRStep.value == 'rescue breaths') {
			this.emitWithState("CPR_Steps", 1, 0);
		} else {
			this.emitWithState("CPR_Steps", 0, 0);
		}
	} else {
		this.emitWithState("CPR_Steps", 0, 0);
	}
}

function isCPRSpecialRequestValid (intent) {
	return intent && intent.slots && intent.slots.CPRStep && intent.slots.CPRStep.value;
}

function isKeyWordValid(intent) {
	return intent && intent.slots && intent.slots.KeyWord && intent.slots.KeyWord.value && (intent.slots.KeyWord.value in KeyWordsHandler);
}

function retriveState(intent) {
	return KeyWordsState[intent.slots.KeyWord.value];
}

function retriveHandler(intent) {
	return KeyWordsHandler[intent.slots.KeyWord.value];
}