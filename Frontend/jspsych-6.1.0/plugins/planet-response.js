/**
 * Adapted from jspsych-image-button-response
 * Original author: Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a mouseclick response (in the indexed order of displayed images)
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["planet-response"] = (function() {
	var plugin = {};
	jsPsych.pluginAPI.registerPreload('planet-response', 'stimulus', 'image');
	plugin.info = {
		name: 'planet-response',
		description: '',
		parameters: {
			stimulus: {
				type: jsPsych.plugins.parameterType.IMAGE,
				pretty_name: 'Stimulus planets',
				array: true,
				default: undefined,
				description: 'The planets (img files) to be displayed.'
			},
			stimulus_height: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Image height',
				default: null,
				description: 'Set the image height in pixels'
			},
			stimulus_width: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Image width',
				default: null,
				description: 'Set the image width in pixels'
			},
			maintain_aspect_ratio: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Maintain aspect ratio',
				default: true,
				description: 'Maintain the aspect ratio after setting width or height'
			},
			stimulus_select: {
				type: jsPsych.plugins.parameterType.IMAGE,
				pretty_name: 'Selection image',
				default: undefined,
				description: 'Stimulus selection image on mouseover.'
			},			
			prompt: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Prompt',
				default: ['Planet A','Planet B','Planet C'], //stup for 3 planets
				array: true,
				description: 'Any content here will be displayed under the option.'
			},
			show_total_points: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Total Points',
				default: true,
				description: 'Show points accumulated up to this point'
			},
			ship_space: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Spacer between stimuli',
				default: 300,
				description: 'Set the space between stimuli in pixels'
			},
			block_duration: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Block duration (ms)',
				default: 240*1000,
				description: 'Duration of continuous block in ms.'
			},
			feedback_duration: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Feedback duration (ms)',
				default: 3000,
				description: 'Duration of trade(planet) and ship feedback.'
			},		
			signal_time: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Signal duration',
				default: 2000,
				description: 'Duration of signal image above chosen planet, in ms.'
			},
			signal_height: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Signal height',
				default: 100,
				description: 'Height of signal image.'
			},
			signal_width: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Signal duration',
				default: 80,
				description: 'Width of signal image.'
			},
			signal_padding: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Signal image padding',
				default: 10,
				description: 'Blank space (padding) around signal image.'
			},
			trade_balance: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Balance trade success probabilities.',			
				default: true, 
				description: 'Balance trade success probabilities.'
			},
			probability_trade: {
				type: jsPsych.plugins.parameterType.FLOAT,
				pretty_name: 'P(trade success)',
				default: [.5, .5, .5],
				array:  true,
				description: 'Probability of successful trade for each planet.'
			},
			rewards: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Rewards',
				default: [100,100, 100],
				array: true,
				description: 'Rewards for each planet.'
			},
			show_ship: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Show ships',
				default: false,
				description: 'Show ships after planet signal response.'
			},
			show_ship_delay: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Show ship delay',			
				default: 2000,//1000,
				description: 'Duration between trade attempt mouseclick and appearance of ship.'
			},
			ship_balance: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Balance ship probabilities.',			
				default: true, 
				description: 'Balance ship appearance probabilities.'
			},
			probability_ship: {
				type: jsPsych.plugins.parameterType.FLOAT,
				pretty_name: 'Probability of ship appearance.',
				array: true,
				default: [.5, .5, .5],
				description: 'Probability the ship will appear when a planet button is clicked.'
			},
			ship_stimulus: {
				type: jsPsych.plugins.parameterType.IMAGE,
				pretty_name: 'Ship stimuli',
				default: null,
				array: true,
				description: 'Images for ships--one for each planet.'
			},
			ship_height: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Ship height',
				default: 200,
				description: 'Height of ship.'
			},
			ship_width: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Ship width',
				default: 300,
				description: 'Width of ship.'
			},
			show_ship_delay: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Show ship delay',
				default: 0,//1000,
				description: 'Duration between presentation of planet reward and appearance of ship.'
			},
			ship_attack_time: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Ship Time to Attack',
				default: 4000,
				description: 'Duration between ship appearance and attack.'
			},
			ship_attack_damage: {
				type: jsPsych.plugins.parameterType.FLOAT,
				pretty_name: 'Ship damage',
				array: true,
				default: [0, 100, 0.2],
				description: 'Array of ship damage values: [0 damage, 100 damage, 20% of total points]'
			},
			ship_hostile_idx: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Index of hostile ship',			
				default: 0,
				description: 'Index of hostile ship, can be 0 (left) or 1 (right), or 3'
			},
			shield_charging_time: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Shield charging duration',
				default: 2000, //2000
				description: 'Duration of shield charging prompt.'
			},
			probability_shield: {
				type: jsPsych.plugins.parameterType.FLOAT,
				pretty_name: 'Probability of shield',
				array: true,
				default: [0.5, 0.5],
				description: 'Probability of shield availability after charging for each ship.'
			},
			shield_prevent_trading: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Shield prevents trading when active',			
				default: true, 
				description: 'Shield prevents trading when active.'
			},
			shield_balance: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Balance shield probabilities.',			
				default: true, 
				description: 'Balance shield availability probabilities.'
			},

			shield_cost_toggle: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: 'Toggle shield activation cost',			
				default: true, 
				description: 'Toggle whether activating the shield incurs a cost.'
			},
			shield_cost_amount: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Shield activation cost',			
				default: 50, 
				description: 'Cost of shield activation (if shield_cost_toggle is true).'
			},
			cursor: {
				type: jsPsych.plugins.parameterType.IMAGE,
				pretty_name: 'Cursor images',
				array: true,
				default: ['img/cursor.png','img/cursordark.png'],
				description: '1st Element: default cursor; 2nd Element: mousedown cursor'
    		},
			signal_time_range: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: '[disabled]Signal duration range [currently disabled]',
				array: true,
				default: [2000,2000,2000],
				description: '[disabled] Range of duration of signal image above chosen planet, in ms.'
			},
			reset_planet_wait: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: '[disabled]Planet reset wait time',
				default: 2000,
				description: '[disabled]Time between end of last planet message and the resetting of planet choice.'
			},		
			reset_ship_wait: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: '[disabled]Ship reset wait time',
				default: 1000,
				description: '[disabled]Time between end of last ship outcome and ship disappearance.'
			},
	}
}





//Change CSS here for new UI split

	plugin.trial = function(display_element, trial) 
	{
		var html = ''
		html += '<div id="planets">'

		

		
		var display_wrapper = document.getElementsByClassName('jspsych-content-wrapper')[0]

		//Some general custom styles (cursor, text color, bgcolor)
		display_element.style.cursor = "url('" + trial.cursor[0] + "'),pointer"
		display_wrapper.style.backgroundColor = "black"
		display_element.style.color = "green"

		// Create general div structure: Planet | Ship+Shield | Planet
		if (Array.isArray(trial.stimulus)){
			for (var i = 0; i < trial.stimulus.length; i ++){
				// Set up space for score, signal, and planet
				html += '<div id="planet-div-' + i + '" style="display:inline-block;"> ';
				html += '<div class="clickid" id="planet-score-box-' + i +
					'"></div> ';

				//Write img tag
				html += '<img class="clickid" src="'+trial.stimulus[i] + '" ' +
					'id="planet-' + i + '" ' +
					'allowclick="1" ' +  //allow clicks?
					'style="' ;
				html += 'z-index: 20;';
				html += 'position: relative;';
				html += 'display: block;';
				if(trial.stimulus_height !== null){
					html += 'height:'+trial.stimulus_height+'px; '
					if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
						html += 'width: auto; ';
					}
				}
				if(trial.stimulus_width !== null){
					html += 'width:'+trial.stimulus_width+'px; '
					if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
						html += 'height: auto; ';
					}
				}
				html += '"' //End the style property quote
				html += 'data-choice="'+i + '" '
				//Make images undraggable
				html += 'draggable="false" ';
				html +='></img>'
				;
				
				//show planet names below the planet
				if (trial.prompt !== null) {
					html += '<div class="clickid" id="planet-prompt-' + i + '" style="font-size:25px">'
					html += trial.prompt[i];
					html += '</div>'
				}
				//Add signal box
				html += '<div class="clickid" id="planet-signal-box-' + i + '" style="display:block; height:100px; width:100px"></div> ';
				//Add select ring divs
				html += '<img id="planet-select-' + i + '" style="position:absolute;"> ';
				//End planet div
				html +='</div>';
				

	//Add ship div in between planets
	if (i+1 < trial.stimulus.length){
		html += '<div id="ship-div" style="display:inline-block; ' +
			'vertical-align: top; ' +
			'visibility:visible; ' +
			'width:' + trial.ship_space + 'px;">' +
			'<div class="clickid" id="total-score-box" style="height:50px;"></div>' +
			//'<div id="ship-score-box" style="height:50px;"></div>' +
			'<div id="ship-img-box"></div>' +
			'<div id="ship-shield-box" style="height:200px;"></div>' +
			'</div>'
	}
}
}
		html += '</div>'
		//Render basic div structure
		display_element.innerHTML = html;

		
		updateScore(trial.data.points)
		//Initialise middle div details
		display_element.querySelector('#ship-img-box').innerHTML = '<div id="ship-img-div" ' +
			'style="position:relative; top:0px; border: 0px; ' +
			'height: ' + trial.ship_height  + 'px ;' +
			'width: ' + trial.ship_width + 'px;" ' +
			'draggable="false" ' +
			'> ' +
			'</div>' +
			'<div class="ship" id="ship-attack-text" style="height:80px;width:300px;line-height:80px"></div>'+
			'<div class="ship" id="ship-status-text" style="height:10px;width:300px;"></div>';

		// Initialise response variable
		var response = {
			planets: {click_idx:[],select:[],time_select:[],outcome:[],time_outcome:[]},
			ships: {type:[],time_appear:[],shield_available:[],shield_activated:[],rt_shield_activated:[],outcome:[],time_outcome:[]},
			all_outcomes: {outcome:[],time_outcome:[],total: []},
			clicks: {
				idx: [],
				timestamp: [],
				loc: [],
				element:[],
			}
		};

		// These functions log mouseclicks throughout the experiment
		document.addEventListener('mousedown', getPositions)
		document.addEventListener('mouseup', resetCursor)

		// Important plugin-global variables
		var clickcnt = 0 // Track number of clicks
		var final_action = false // flag this as true when time is more than block_duration
		var shipVisible = false // Visibility state of ship img
		var shield_activated = null //Shield state
		
		//Define variables for balanced probability arrays
		if (trial.trade_balance){
			var tradeProbArrs = initProbArray(trial.probability_trade)
			var trade_orderbase = tradeProbArrs[0]  // Base set to randomise availability of trades
			var trade_log = tradeProbArrs[1] // Arr to read future trade success
			var trade_read = tradeProbArrs[2] // Arr to log trade success
		}
		if (trial.ship_balance){
			var shipProbArrs = initProbArray(trial.probability_ship)
			var ship_orderbase = shipProbArrs[0]
			var ship_log = shipProbArrs[1] 
			var ship_read = shipProbArrs[2]
		}
		if (trial.shield_balance){
			var shieldProbArrs = initProbArray(trial.probability_shield)
			var shield_orderbase = shieldProbArrs[0] 
			var shield_log = shieldProbArrs[1] 
			var shield_read = shieldProbArrs[2] 
		}
		
		// Go through each choice and implement conditional mouseclick events, also mouseover, and select ring
		for (var i = 0; i < trial.stimulus.length; i++) {
			var element = display_element.querySelector('#planet-' + i)
			var conditionStr = 'element.getAttribute("allowclick")=="1" && shield_activated!=true'//'response.option==null'
			var styleDef = ['opacity:1;'];
			var styleChange = ['opacity:.5;'];
			var result = after_response;
			var clickOnMouseDown = true; //activate click immediately on mousedown
			cond_click(element,result,conditionStr,styleDef,styleChange,clickOnMouseDown)
			//Handle mouseover
			//have to make mouseover imgs global
			element.addEventListener('mouseover', planet_mOver);
			element.addEventListener('mouseout', planet_mOut);
			//Disable selection of images
			element.addEventListener('click', function(e){});


			//Also fix width of scorebox
			var planetRect = element.getBoundingClientRect()
			var elementbx = display_element.querySelector('#planet-score-box-' + i)
			elementbx.style.display = 'block';
			elementbx.style.fontSize = '25px';
			elementbx.style.height = '50px';
			elementbx.style.padding = '20px 0px';
			elementbx.style.width = planetRect.width+'px';

			//Implement selectring positioning
			var planetRect = element.getBoundingClientRect() //fetch this a second time because the planet-score-box can mess with coordinates
			var selectring = display_element.querySelector('#planet-select-' + i)
			selectring.src = trial.stimulus_select;
			selectring.style.visibility = 'hidden';
			selectring.style.top = planetRect.top + 'px';
			selectring.style.left = planetRect.left + 'px';
			selectring.style.width = planetRect.width + 'px';
			selectring.style.height = planetRect.height + 'px';
			selectring.style.zIndex = '0';
		}

		// function to handle procedure following a valid planet-choice response
		function after_response(element) {
			// Lock clicking
			element.setAttribute('allowclick',0)
			var choice = element.getAttribute('data-choice')
			// measure timestamp
			var end_time = performance.now();
			var rt = end_time - start_time;
			var click_idx = response.clicks.idx.slice(-1)[0] //idx of this click is the last element in clicks
			//Since response.clicks.idx is updated only after this script though, add 1 to the number
			if(click_idx==null){
				click_idx = 0
			} else {
				click_idx++
			}
			// Log response details
			response.planets.select.push(Number(choice));
			response.planets.time_select.push(rt);
			response.planets.click_idx.push(click_idx)

			//Run trade procedure
			proceed_trade(choice);
		};
	

		// function to show the signal, run trade, then show outcome
		function proceed_trade(choice){
			//Get planet position
			var signalPadding = trial.signal_padding
			var planet = display_element.querySelector('#planet-' + choice)
			var planetWidth = planet.getBoundingClientRect().width
			var planetX = planet.getBoundingClientRect().x
			var signalLeft = planetWidth/2 - (trial.signal_width + signalPadding*2)/2
			//Display signal image and status
			document.querySelector('#planet-signal-box-'+choice).innerHTML = '<img src="img/signal1.png" ' +
				'id="planet-signal-img-' + choice + '" ' +
				'style="display:block; position: relative;' +
				'height: ' + (trial.signal_width-10) + 'px; ' +
				'width: ' + trial.signal_width + 'px; ' +
				'left:' + signalLeft + 'px;' +
				'padding: ' + signalPadding + 'px;' +
				'visibility: visible;' +
				'">'

			// Generate the duration the signal will be presented
			// var signal_time_diff = Math.abs(trial.signal_time_range[1] - trial.signal_time_range[0])
			// var signal_time = Math.random()*signal_time_diff + trial.signal_time_range[0]
			
			//Implement trade attempt message
			var signal_step_time = 250;
			var signal_int_id = setInterval(sigframe,signal_step_time);
			var signal_dot_count_max = 3;
			var signal_dot_count = Math.ceil(Math.random() * signal_dot_count_max);
			var signal_attempt_str = 'Attempting trade'
			var signalmsg = signal_attempt_str + colordots(signal_dot_count_max,0,'black',signalclr)// '.'.
			var signalclr = '#b4ba38' //some shade of yellow
			var signal_max_time = trial.signal_time+performance.now()
			//Also vars for signal img
			var signal_img_count_max = 4;
			var signal_img_count = Math.ceil(Math.random() * signal_img_count_max);
			var signalImg = display_element.querySelector('#planet-signal-img-' + choice)
			signalImg.src = 'img/signal' + signal_img_count + '.png'

			updateStatus(choice,signalmsg,signalclr )
			function sigframe() {
				var curr_time = performance.now()
				if (curr_time > signal_max_time) {
					clearInterval(signal_int_id);
				} else {
					var dots = colordots(signal_dot_count_max,signal_dot_count,'black',signalclr)// '.'.repeat(signal_dot_count)
					signal_dot_count ++
					if (signal_dot_count>  signal_dot_count_max){
						signal_dot_count = 0
					}
					signalmsg = signal_attempt_str + dots
					updateStatus(choice,signalmsg,signalclr )
					//Update signal img
					signal_img_count ++
					if (signal_img_count>  signal_img_count_max){
						signal_img_count = 1
					}
					var signalImg = display_element.querySelector('#planet-signal-img-' + choice)
					signalImg.src = 'img/signal' + signal_img_count + '.png'
				}
			}
			//This is an example of spending a little too much effort into a trivial detail...
			function colordots(totalct,colorct,baseclr,fontclr){
				outStr = ''
				for (var i=0; i<totalct; i++){
					if (i<colorct){
						var color = fontclr
					} else {
						var color = baseclr
					}
					outStr += '<font color="'+ color + ' ">.</font>'
				}
				return outStr
			}

			// Run trade

			if (trial.trade_balance){
				var tradeBalOut = balanceSuccess(trade_orderbase,trade_log,trade_read,choice,true,'trade')
				trade_success = tradeBalOut[0];
				trade_log = tradeBalOut[1];
				trade_read = tradeBalOut[2];

			} else {
				trade_success = Math.random() < trial.probability_trade[choice]
			}
			if (trade_success){
				//Add and display reward
				var displayScore = trial.rewards[choice]
				var statusmsg = 'Success! <br> <b>+' + displayScore + ' points </b>'
				var statusclr = '#05BF00' //some shade of green

			} else {
				//Display some fail state
				var displayScore = 0;
				var statusmsg = 'Trade attempt failed'
				var statusclr = 'yellow'
			}

			//Check time and disable planets if final_action was flagged previously
			checkTimeExceed()

			var show_ship_check = false
			var show_ship_samp = Math.random()
			if (trial.ship_balance){
				var shipBalOut = balanceSuccess(ship_orderbase,ship_log,ship_read,choice,true,'ship')
				show_ship_check = shipBalOut[0];
				ship_log = shipBalOut[1];
				ship_read = shipBalOut[2];
			} else {
				if (show_ship_samp < trial.probability_ship[choice]){
					show_ship_check = true
				}
			}
			console.log([show_ship_samp,show_ship_check])
			// Start timer for ship
			if (trial.show_ship && show_ship_check){
				setTimeout(function(){
					if (!shipVisible){
						show_ship(choice);
					}
				},trial.show_ship_delay);				
			}

			// Wait before showing outcome
			setTimeout(function(){
				//Compute total points
				trial.data.points += displayScore
				//Hide signal image
				document.querySelector('#planet-signal-img-'+choice).style.visibility = 'hidden'
				updateScore(trial.data.points)
				updateStatus(choice,statusmsg,statusclr)

				// //Proceed to next step (ship or end trial)				
				// if (trial.show_ship){
				// 	setTimeout(function(){
				// 		if (!shipVisible){
				// 			show_ship(choice);
				// 		}
				// 	},trial.show_ship_delay);
							   
				// }
				// Log response details
				var time_outcome = performance.now()-start_time
				response.planets.outcome.push(displayScore)
				response.planets.time_outcome.push(time_outcome)
				// Also update a single list of outcomes for easier tracking of each change in score
				response.all_outcomes.outcome.push(displayScore)
				response.all_outcomes.time_outcome.push(time_outcome)
				// Finally, update running total
				response.all_outcomes.total.push(trial.data.points)

				//reset planets after short delay
				setTimeout(function(){
					reset_planet(planet,choice)
				}, trial.feedback_duration)//trial.reset_planet_wait
			}, trial.signal_time)		  
			
		}


		// function to show ship img and subsequent procedure
		function show_ship(choice) {
			//Put stuff into the ship divs
			var shipDiv = display_element.querySelector('#ship-img-div');
			shipDiv.style.visibility = 'visible';
			shipDiv.innerHTML = '<img src="' + trial.ship_stimulus[choice] +  '" ' +
				'id="ship-img" ' +
				'class="ship"' +
				'height="' + trial.ship_height +'" ' +
				'width="' + trial.ship_width +'" ' +
				'style="position:relative; top:0px; border: 0px; visibility:visible;z-index:11;" ' +
				'draggable="false" ' +
				'> '
			shipVisible = true
			var shipImg = display_element.querySelector('#ship-img');
			logIDonMouseDown(shipImg)

			var shipStatTxt = display_element.querySelector('#ship-status-text');
			shipStatTxt.style.fontSize = '25px'
			shipStatTxt.style.color = 'red'
			shipStatTxt.style.visibility = 'visible'
			logIDonMouseDown(shipStatTxt)

			var shipAtTxt = display_element.querySelector('#ship-attack-text');
			shipAtTxt.style.fontSize = '25px'
			shipAtTxt.style.color = 'red'
			shipAtTxt.style.visibility = 'visible'
			var attack_int_id = setInterval(attframe,1000)
			var attack_countdown = trial.ship_attack_time/1000
			shipAtTxt.innerHTML = 'Encounter imminent ' + attack_countdown + ' s' //Show first frame
			function attframe() {
				if (attack_countdown <= 0) {
					clearInterval(attack_int_id);
				} else {
					attack_countdown --
					shipAtTxt.innerHTML = 'Encounter imminent ' + attack_countdown + ' s'
				}
			}
			logIDonMouseDown(shipAtTxt)

			var shieldBoxDiv = display_element.querySelector('#ship-shield-box');
			shieldBoxDiv.innerHTML = '<div class="ship" id="ship-shield-text"></div>' +
				'<div class="ship" id="ship-shield-button"></div>' +
				'<div class="ship" id="ship-shield-charger"></div>';
			//Style the text div
			var shieldTxtDiv = display_element.querySelector('#ship-shield-text');
			shieldTxtDiv.innerHTML = 'CHARGING SHIELD';
			shieldTxtDiv.style.fontSize = "25px";
			shieldTxtDiv.style.color = 'green';
			shieldTxtDiv.style.position = 'relative';
			shieldTxtDiv.style.top = '100px';
			logIDonMouseDown(shieldTxtDiv)

			//Style the button
			var shieldButton = display_element.querySelector('#ship-shield-button');
			//shieldButton.style.borderRadius = "10px"
			shieldButton.style.border = "2px solid green"
			shieldButton.draggable = false
			shieldButton.style.position = 'relative';
			shieldButton.style.top = '100px';
			shieldButton.style.fontSize = "40px";
			shieldButton.style.height = '50px';
			shieldButton.style.lineHeight = '50px';
			shieldButton.style.zIndex = '10';
			//shieldButton.style.verticalAlign = 'middle';
			logIDonMouseDown(shieldButton)

			//Style the charger div
			var shieldChgDiv = display_element.querySelector('#ship-shield-charger');
			shieldChgDiv.style.color = 'green';
			shieldChgDiv.style.backgroundColor = 'green';
			//shieldChgDiv.style.borderRadius = "10px"
			shieldChgDiv.style.border = "2px solid green"
			shieldChgDiv.draggable = false
			//Get button location and move chgdiv there
			var buttonrect = shieldButton.getBoundingClientRect()
			shieldChgDiv.style.position = 'absolute';
			shieldChgDiv.style.top = buttonrect.top + 1 + 'px';
			shieldChgDiv.style.left = buttonrect.left + 1 + 'px';
			shieldChgDiv.style.height = buttonrect.height - 5 + 'px';
			shieldChgDiv.style.width = 0 //buttonrect.width - 5 + 'px';
			shieldChgDiv.style.opacity = .5
			shieldButton.style.zIndex = '1';

			//Set shield charging timer and animation
			setTimeout(function(){
				proceed_shield(choice);
			},trial.shield_charging_time)
			//Charging box animation
			var int_steps = 5; //ms
			var charge_int_id = setInterval(chargeframe, int_steps);
			var chgwidth = 0
			var charge_nsteps = trial.shield_charging_time / int_steps
			var charge_stepwidth = buttonrect.width / charge_nsteps
			function chargeframe() {
				if (shieldChgDiv.getBoundingClientRect().width > buttonrect.width) {
					clearInterval(charge_int_id);
				} else {
					chgwidth += charge_stepwidth
					//console.log('frame')
					shieldChgDiv.style.width = chgwidth + 'px'
					/* code to change the element style */
				}
			}

			//Start timer for ship to attack and timeout
			setTimeout(function(){
				ship_attack(choice)
			},trial.ship_attack_time)

			//log ship appearance details
			response.ships.type.push(choice)
			response.ships.time_appear.push(performance.now() - start_time)
		}

		// function to update state of shield
		var shield_start_time = null
		function proceed_shield(choice){
			if (trial.shield_balance) {
				var shieldBalOut = balanceSuccess(shield_orderbase,shield_log,shield_read,choice,true,'shield')
				shield_success = shieldBalOut[0];
				shield_log = shieldBalOut[1];
				shield_read = shieldBalOut[2];
				// // First, check shield log
				// var baselength = shield_orderbase.length
				// var shield_length = shield_log[choice].length
				// var shield_next = shield_length
				// // Multiples of shield appearances have shield availability sampled from uniform random
				// if (shield_length/baselength == Math.round(shield_length/baselength)){
				// 	var shield_order = shuffleArray(shield_orderbase)
				// 	for (var ii=0; ii<shield_order.length; ii++){
				// 		shield_read[choice].push(shield_order[ii])
				// 	}
				// }
				// shield_success = Boolean(shield_read[choice][shield_next])
				// console.log('Shield read: ' + String(shield_read[0]) + '; ' + String(shield_read[1]))
				// console.log('Shield log: ' + String(shield_log[0]) + '; ' + String(shield_log[1]))

				// // Update shield log
				// shield_log[choice].push(Number(shield_success))
				// console.log('Shield log end: ' + String(shield_log[0]) + '; ' + String(shield_log[1]))
				
			} else {
				// Run shield gamble
				shield_success = Math.random() < trial.probability_shield[choice]
			}
			
			//Define elements
			var shieldTxtDiv = display_element.querySelector('#ship-shield-text');
			var shieldButton = display_element.querySelector('#ship-shield-button');
			// Log shield state
			response.ships.shield_available.push(shield_success)
			//Update display
			if (shield_success){
				shieldTxtDiv.innerHTML = 'SHIELD AVAILABLE'
				shieldButton.innerHTML = 'ACTIVATE!'
				var shieldButton = display_element.querySelector('#ship-shield-button')
				var conditionStr = 'shield_activated==null'
				var styleDef = ['background-color: ;','color: green;'];
				var styleChange = ['background-color: green;','color: black;'];
				var result = activate_shields;
				var clickOnMouseDown = false;
				cond_click(shieldButton,result,conditionStr,styleDef,styleChange,clickOnMouseDown)
				shield_start_time = performance.now();
			} else {
				shieldTxtDiv.innerHTML = 'SHIELD UNAVAILABLE'
				shieldButton.innerHTML = 'NO SHIELD'
				shieldButton.style.opacity = '.5'
			}
		}
		// Handle activation of shields
		function activate_shields(){
			//Log data
			var end_time = performance.now();
			var rt = end_time - shield_start_time;
			shield_activated = true;
			response.ships.rt_shield_activated.push(rt); //logging of activation state will be performed at time of ship attack

			//Modify Shieldbutton text
			var shieldButton = display_element.querySelector('#ship-shield-button')
			shieldButton.innerHTML = 'ACTIVE'
			shieldButton.style.color = '#1eff19'
			shieldButton.style.backgroundColor = '#196d17'

			//Add cost if specified
			var shieldTxt = display_element.querySelector('#ship-shield-text')
			var shieldTxtStr = 'Shield activated'
			if (trial.shield_cost_toggle){
				shieldTxtStr = 'Shield cost: -' + trial.shield_cost_amount + ' points'
				
				trial.data.points -= trial.shield_cost_amount				
				//Update score
				updateScore(trial.data.points)

				//log details
				var time_outcome = performance.now()-start_time
				response.all_outcomes.outcome.push(-trial.shield_cost_amount)
				response.all_outcomes.time_outcome.push(time_outcome)
				// Finally, update total
				response.all_outcomes.total.push(trial.data.points)
				//Xian todo 240620: Think about whether it makes sense to log the shield cost in
				// the all_outcomes data or its own var, or whether it's needed at all?
			}
			shieldTxt.innerHTML = shieldTxtStr
			
		}


		function ship_attack(choice){
            //Disable button if no response
            if (shield_activated==null){
                shield_activated = false
                response.ships.rt_shield_activated.push(null);
            }

            //Log shield response
            response.ships.shield_activated.push(shield_activated)

            // Calculate damage based on the attacking ship's index and the ship_attack_damage parameter
            const damageTypes = trial.ship_attack_damage;
     		const appliedDamage = typeof damageTypes[choice] === 'number' ? damageTypes[choice] :
      	 	 damageTypes[choice](trial.data.points);

            /**
             * Apply points loss depending on the choice and the shield activation
             */
			if (!shield_activated) {
				// Subtract the calculated damage from the points
				if (typeof appliedDamage === 'number' && appliedDamage % 1 !== 0) {
				  trial.data.points *= 1 - appliedDamage;
				} else {
				  trial.data.points -= appliedDamage;
				}
			
				//Update score
				updateScore(trial.data.points)

                //Update status
                var statusmsg = 'Ship engaged: <b>-' + appliedDamage + ' points</b>'
                var statusclr = 'grey' //some shade of red - optionally make this green/orange/red for tiers of damage for each damage level
            } else if (shield_activated) {
                var statusmsg = 'Shield successfully deflected attack'
                var statusclr = '#05BF00'
            }
            updateStatus('ship',statusmsg,statusclr)

            //log details
            var time_outcome = performance.now()-start_time
            response.ships.outcome.push(-appliedDamage)
            response.ships.time_outcome.push(time_outcome)
            // Also update a single list of outcomes for easier tracking of each change in score
            response.all_outcomes.outcome.push(-appliedDamage)
            response.all_outcomes.time_outcome.push(time_outcome)
            // Finally, update total
            response.all_outcomes.total.push(trial.data.points)

            //Visually disable button
            var shieldDiv = display_element.querySelector('#ship-shield-text')
            //shieldDiv.style.opacity = .5
            var shieldButton = display_element.querySelector('#ship-shield-button')
            if (!shield_activated){
                shieldButton.style.opacity = .5
                shieldButton.style.backgroundColor = ''
                shieldButton.style.color = 'green'
            }

            //Reset ship
            setTimeout(function(){
                reset_ship()
            },trial.feedback_duration)//trial.reset_ship_wait

            
            // Print hostil IDX to console
            // console.log("Hostile IDX:", choice);
        }


		// function to end trial when it is time
		function end_trial() {
			setTimeout(function(){
				// kill any remaining setTimeout handlers
				jsPsych.pluginAPI.clearAllTimeouts();

				//Remove tracking and logging of mouseclicks and related events
				document.removeEventListener('mousedown', getPositions)
				document.removeEventListener('mouseup',resetCursor)
				//Reset styles
				
				for (var i = 0; i < trial.stimulus.length; i++) {
					var planetEl = display_element.querySelector('#planet-' + i)							
					planetEl.removeEventListener('mouseout',planet_mOut)
				}
				//Reset styles				
				display_element.style.cursor = 'default'
				display_wrapper.style.backgroundColor = '#FFFFFF'
				display_element.style.color = "black"
				//Get viewport size
				var win = window,
					doc = document,
					docElem = doc.documentElement,
					body = doc.getElementsByTagName('body')[0],
					vpWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
					vpHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
				//Get location of main div
				var dpRect = display_element.getBoundingClientRect(),
					dpx = dpRect.left,
					dpy = dpRect.top

				// gather the data to store for the trial
				var trial_data = {
					"stimuli": {planets:trial.stimulus,
								ships:trial.ship_stimulus
							},	
					"planets": response.planets,
					"ships": response.ships,
					"all_outcomes": response.all_outcomes,
					"all_clicks": response.clicks,
					"points_total": trial.data.points,
					"block_type": trial.data.block_type,
					"block_number": trial.data.block_number,
					"trial_number": trial.data.trial_number,
					"viewport_size": [vpWidth,vpHeight],
					"display_loc": [dpx,dpy],
					"block_duration": trial.block_duration,
					"feedback_duration": trial.feedback_duration,
					"signal_time": trial.signal_time,
					"probability_trade": trial.probability_trade,
					"rewards": trial.rewards,
					"show_ship": trial.show_ship,
					"show_ship_delay": trial.show_ship_delay,
					"probability_ship": trial.probability_ship,
					"show_ship_delay": trial.show_ship_delay,
					"ship_attack_time": trial.ship_attack_time,
					"ship_attack_damage": trial.ship_attack_damage,
					"shield_charging_time": trial.shield_charging_time,
					//"shield_success": trial.shield_success,
					"probability_shield": trial.probability_shield,
					"shield_prevent_trading": trial.shield_prevent_trading,
					"shield_cost_toggle": trial.shield_cost_toggle,
					"shield_cost_amount": trial.shield_cost_amount
				};

				// clear the display
				display_element.innerHTML = '';

				// move on to the next trial
				console.log(trial_data)
				jsPsych.finishTrial(trial_data);
			}, trial.end_trial_wait)
		};


		//After everything has loaded, loop through all elements and add an eventlistener to fetch id on mousedown
		var allDOM = display_element.getElementsByClassName("clickid");
		for (var i=0, max=allDOM.length; i < max; i++) {
			element = allDOM[i]
			logIDonMouseDown(element)
		}

		//Start block timer
		timer_end(trial.block_duration)
		//Save timestamp at start
		var start_time = performance.now();

		////
		//// General but plugin-specific functions
		////

		function updateScore(points){
			//Update total score
			if (trial.show_total_points){
				scoreDiv = display_element.querySelector('#total-score-box')
				//scoreDiv.style.color = 'green'
				scoreDiv.style.fontSize = '30px'
				scoreDiv.innerHTML = 'Total points: ' + points
			}
		}

		function updateStatus(choice,msg,color){
			//Update planet status with some message and in some colour
			if(choice=='ship'){
				var statusDiv = display_element.querySelector('#ship-status-text')
			} else {
				var statusDiv = display_element.querySelector('#planet-score-box-'+choice)
			}
			statusDiv.innerHTML = msg
			statusDiv.style.color = color
		}

		// Track mouse events
		function getPositions(ev) {
			// Function to record all mouseclicks
			if (ev == null) {
				ev = window.event
			}
			_mouseX = ev.clientX;
			_mouseY = ev.clientY;
			console.log("X: " + _mouseX + " Y: " + _mouseY)
			log_click([_mouseX,_mouseY])
		}
		function log_click(cursor_loc){
			//Save mouse coords into data structure, along time and with time
			response.clicks.idx.push(clickcnt)
			response.clicks.timestamp.push(performance.now()-start_time)
			response.clicks.loc.push(cursor_loc)
			clickcnt ++
			console.log(response.clicks)
			display_element.style.cursor = "url('" + trial.cursor[1] + "'),pointer" //"url('cursordark.png'),pointer"
		}
		function logIDonMouseDown(element){
			// Log id on mousedown
			element.addEventListener('mousedown', function(e){
				console.log(e.currentTarget.id)
				//Only log element if not hidden
				if(e.currentTarget.style.visibility=='hidden'){
					response.clicks.element[clickcnt] = undefined
				} else {
					response.clicks.element[clickcnt] = e.currentTarget.id
				}
				//clicks.element.push(e.currentTarget.id)
			});
		}
		function resetCursor(){
			//Reset cursor to default style
			display_element.style.cursor = "url('" + trial.cursor[0] + "'),pointer"
		}

		function planet_mOver(e){
			// Implement planet mouseover effects
			var ct = e.currentTarget
			var choice = ct.getAttribute('data-choice')
			var cSelect = document.getElementById('planet-select-'+choice) //current selectring
			cSelect.style.visibility = 'visible'
			//Highlight planet names
			var cp = document.getElementById('planet-prompt-'+choice) //current prompt
			var currtext = cp.innerHTML
			cp.innerHTML = '<font color="#05BF00">' + currtext + '</font>' //dis brite gre3n
		}
		function planet_mOut(e){
			// Implement planet mouseout effects
			var ct = e.currentTarget
			var choice = ct.getAttribute('data-choice')
			var cSelect = document.getElementById('planet-select-'+choice) //current selectring
			cSelect.style.visibility = 'hidden'
			//Reset planet name format
			var cp = document.getElementById('planet-prompt-'+choice) //current prompt
			cp.innerHTML = cp.innerHTML.replace(/<font.*">/,'')
			cp.innerHTML = cp.innerHTML.replace('</font>','')
		}

		function cond_click(element,result,conditionStr,styleDef,styleChanges,clickOnMouseDown){
			// General function to add conditional mouseclicks to an element
			// Also do one for mousedown events
			element.addEventListener('mousedown', function(e){
				var condition = eval(conditionStr)
				if (condition){
					var ct = e.currentTarget
					replaceStyle(element,styleChanges)
				}
			});
			element.addEventListener('mouseleave', function(e){
				var condition = true//eval(conditionStr)
				if (condition){
					var ct = e.currentTarget
					replaceStyle(element,styleDef)
				}
			});
			element.addEventListener('mouseup', function(e){
				var condition = true
				if (condition){
					var ct = e.currentTarget
					replaceStyle(element,styleDef)
				}
			});
			if (clickOnMouseDown){
				var eventStr = 'mousedown';
			} else {
				var eventStr = 'click';
			}
			element.addEventListener(eventStr, function(e){
				var condition = eval(conditionStr) //eval is necessary for the condition to be checked only when event is triggered
				if (condition){
					var ct = e.currentTarget;
					result(ct);
				}
			});
		}
		function replaceStyle(element,styleChange){
			//Handle find and replace in style attribute
			for (var i = 0; i<styleChange.length; i++){
				//Make pattern, extract style name and value
				var newPatt = new RegExp('(.*?):(.*?);')
				var styleFull = styleChange[i]
				var styleMatch = styleFull.match(newPatt)
				var styleName = styleMatch[1]
				var styleValue = styleMatch[2]
				var findPatt = new RegExp(';\\s*'+styleName + '\\s*:.*?;')
				var findPattStart = new RegExp('^' + styleName + '\\s*:.*?;')
				//Get current style
				var currStyle = element.getAttribute('style')
				//Add to style changes, check if at the start first
				if (currStyle.search(findPattStart) > 0 ){
					var newStyle = currStyle.replace(findPattStart,styleFull)
				} else if (currStyle.search(findPatt) > 0 ){
					var newStyle = currStyle.replace(findPatt,'; ' + styleFull);
				} else {
					var newStyle = currStyle + styleFull
				}
				element.setAttribute('style',newStyle);
			}
		}

		//Resetting functions
		function reset_planet(planet,choice){
			//Check if block time is up, else reset planet choice
			//Reset some display elements
			if(!final_action){
				planet.setAttribute('allowclick',1)
			}
			updateStatus(choice,'','')
			if(!trial.show_ship || final_action){
				if (check_end()){
					end_trial()
				}
			}
		}
		function reset_ship(){
			//Function to reset ship div
			//Hide ship div
			var shipEls = display_element.getElementsByClassName('ship')
			for (var i = 0; i < shipEls.length; i++){
				shipEls[i].style.visibility = 'hidden'
			}
			shipVisible = false
			//Clear ship status text
			var shipStatTxt = display_element.querySelector('#ship-status-text');
			shipStatTxt.innerHTML = ''
			//Reset shield
			var shieldButton = display_element.querySelector('#ship-shield-button')
			shieldButton.style.opacity = 1.
			shieldButton.style.backgroundColor = ''
			shieldButton.style.color = 'green'
			shieldButton.innerHTML = ''
			shield_activated = null

			//Check if can end block
			if (check_end()){
				end_trial()
			}

		}
		
		function checkTimeExceed(){
			// Check if time exceeded, and if so, disable choices
			var checkTime = (performance.now() - start_time) >= trial.block_duration
			if (checkTime){
				final_action = true
			}
			if(final_action){
				for(var i=0; i<trial.stimulus.length; i++){
					var planetEl = display_element.querySelector('#planet-' + i)
					planetEl.setAttribute('allowclick',0)
					planetEl.removeEventListener('mouseover',planet_mOver)
					//planetEl.removeEventListener('mouseout',planet_mOut)
				}
			}

		}
		function check_end(){
			// Check all end_trial conditions
			//Check that time is up
			var checkTime = (performance.now() - start_time) >= trial.block_duration
			//Check that no planet statuses are active
			var check_count = 0
			var checkStr = []
			for (var i=0; i<trial.stimulus.length; i++){
				var el = display_element.querySelector('#planet-score-box-' + i)
				if(el.innerHTML != ''){
					checkStr.push('Planet ' + i + ' ' + el.innerHTML)
					check_count++
				}
			}
			if (check_count>0){
				var checkPlanet = false
				//console.log(checkStr)
			} else {
				var checkPlanet = true
			}

			var checkShip = true
			if (trial.show_ship){
				checkShip = false
				if(!shipVisible){
					checkShip = true
				}
			}
			console.log('ct ' + checkTime + ' cp ' + checkPlanet + ' cs ' + checkShip + ' fa ' + final_action)

			//Flag final action for next check
			checkTimeExceed()
			return (checkTime && checkPlanet && checkShip)
		}
		function timer_end(duration){
			//Timer to end trial after block_duration
			setTimeout(function(){
				//Check if can end block
				if (check_end()){
					end_trial()
				}
			},duration)
		}

	};

		// ---------------------------------------------------------------------
	  // Miscellaneous utility functions
	function roundTo(n, digits) {
		if (digits === undefined) {
			digits = 0;
		}

		var multiplicator = Math.pow(10, digits);
		n = parseFloat((n * multiplicator).toFixed(11));
		var test =(Math.round(n) / multiplicator);
		return +(test.toFixed(digits));
	}
	
	//function genOrderBase(probSuccess,maxlength=10){
	window.genOrderBase = function(probSuccess,maxlength=10){
		//Function to generate a finite array of 1 (success) and (0) fails that closely approximates (if not exact) to some probability.
		// So if probSuccess is .5, this should return [0,1].
		// For a given max array length, generate all floating point numbers for all possible proportions
		var outarr = []
		var numList = []
		var denList = []
		var floatList = []
		var diffList = []
		for (var i=0;i<maxlength;i++){
			var denom = i + 1;
			for (var ii=0; ii<maxlength;ii++){
				var numer = ii+1;
				if (numer>denom){
					//Ignore float values greater than 1
					continue
				}
				var flt = numer/denom
				var diff = Math.abs(flt-probSuccess)
				numList.push(numer)
				denList.push(denom)
				floatList.push(flt)
				diffList.push(diff)
			}						
		}

		//Find float with smallest difference from specified probSuccess
		var minDiff = Math.min(...diffList)
		// Get indices of the smallest differences
		var minIdx = indexOfAll(diffList,minDiff)
		// Pick the one with lowest denominator		
		var minDens = []
		var minNums = []
		for (var i=0;i<minIdx.length;i++){
			var mini = minIdx[i]
			minDens.push(denList[mini])
			minNums.push(numList[mini])
		}
		var minDen = Math.min(...minDens)
		//Get index of minDen and extract corresponding numerator
		var minDenIdx = minDens.indexOf(minDen)
		var minNum = minNums[minDenIdx]
		//Generate array of zeros (denom-numer)  and ones (numer)
		var zeros = []; for (var i=0; i < minDen-minNum; i++){zeros.push(0)};
		var ones = []; for (var i=0; i < minNum; i++){ones.push(1)};
		var outarray = zeros.concat(ones)
		return outarray
	};

	
	function balanceSuccess(orderbase,arr_log,arr_read,choice,verbose=false,vstr=''){
		//Function to output single samples from semi-random series of booleans
		// First, check shield arr_log
		var baselength = orderbase[choice].length
		var arr_length = arr_log[choice].length
		var arr_next = arr_length
		// Multiples of shield appearances have shield availability sampled from uniform random
		if (arr_length/baselength == Math.round(arr_length/baselength)){
			var arr_order = shuffleArray(orderbase[choice])
			for (var ii=0; ii<arr_order.length; ii++){
				arr_read[choice].push(arr_order[ii])
			}
		}
		arr_success = Boolean(arr_read[choice][arr_next])
		if (verbose){
			// console.log(vstr + ' array read: ' + String(arr_read[0]) + '; ' + String(arr_read[1]))
			// console.log(vstr + ' array log (before event): ' + String(arr_log[0]) + '; ' + String(arr_log[1]))
		}
		
		// Update log
		arr_log[choice].push(Number(arr_success))
		if (verbose){
			// console.log(vstr + ' array log (after event): ' + String(arr_log[0]) + '; ' + String(arr_log[1]))
		}
		//Return arguments
		return([arr_success,arr_log,arr_read])

	}

	// initialise variables for balanced probability arrays
	function initProbArray(probSuccess){
		var numOptions = 3; //determines number of planets 3 = 3 planets
		var orderbase = [];
		var arr_log = [];
		var arr_read = [];
		for (var i=0; i<numOptions; i++){
			orderbase.push(genOrderBase(probSuccess[i]))
			arr_log.push([])
			arr_read.push([])
		}
		return([orderbase,arr_log,arr_read])
	}
	
	// indexOf that returns all matches
	function indexOfAll(array, searchItem) {
		var i = array.indexOf(searchItem),
			indices = [];
		while (i !== -1) {
			indices.push(i);
			i = array.indexOf(searchItem, ++i);
		}
		return indices;
	}
	
	function shuffleArray(array) {
		let curId = array.length;
		// There remain elements to shuffle
		while (0 !== curId) {
			// Pick a remaining element
			let randId = Math.floor(Math.random() * curId);
			curId -= 1;
			// Swap it with the current element.
			let tmp = array[curId];
			array[curId] = array[randId];
			array[randId] = tmp;
		}
		return array;
	}
	

	return plugin;
})();
