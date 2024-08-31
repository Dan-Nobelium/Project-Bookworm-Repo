/**
 * Adapted from jspsych-image-button-response, and planet response by Legacy author: Josh de Leeuw
 *Planet-response-command was developed by Daniel Noble
 * plugin for displaying a stimulus and getting a mouseclick response (in the indexed order of displayed images)
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["planet-response-command"] = (function() {
  var plugin = {};
  jsPsych.pluginAPI.registerPreload("planet-response", "stimulus", "image");
  plugin.info = {
    name: "planet-response-command",
    description: "",
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Stimulus planets",
        array: true,
        default: undefined,
        description: "The planets (img files) to be displayed.",
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image height",
        default: null,
        description: "Set the image height in pixels",
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Image width",
        default: null,
        description: "Set the image width in pixels",
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Maintain aspect ratio",
        default: true,
        description: "Maintain the aspect ratio after setting width or height",
      },
      stimulus_select: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Selection image",
        default: undefined,
        description: "Stimulus selection image on mouseover.",
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Prompt",
        default: ["Planet A", "Planet B", "Planet C"], //setup for 3 planets
        array: true,
        description: "Any content here will be displayed under the option.",
      },
      show_total_points: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Total Points",
        default: true,
        description: "Show points accumulated up to this point",
      },
      ship_space: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Spacer between stimuli",
        default: 300,
        description: "Set the space between stimuli in pixels",
      },
      block_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Block duration (ms)",
        default: 240 * 1000,
        description: "Duration of continuous block in ms.",
      },
      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Feedback duration (ms)",
        default: 3000,
        description: "Duration of trade(planet) and ship feedback.",
      },
      signal_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Signal duration",
        default: 2000,
        description: "Duration of signal image above chosen planet, in ms.",
      },
      signal_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Signal height",
        default: 100,
        description: "Height of signal image.",
      },
      signal_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Signal duration",
        default: 80,
        description: "Width of signal image.",
      },
      signal_padding: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Signal image padding",
        default: 10,
        description: "Blank space (padding) around signal image.",
      },
      trade_balance: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Balance trade success probabilities.",
        default: true,
        description: "Balance trade success probabilities.",
      },
      probability_trade: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: "P(trade success)",
        default: [0.5, 0.5, 0.5],
        array: true,
        description: "Probability of successful trade for each planet.",
      },
      rewards: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Rewards",
        default: [100, 100, 100],
        array: true,
        description: "Rewards for each planet.",
      },
      show_ship: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Show ships",
        default: false,
        description: "Show ships after planet signal response.",
      },
      show_ship_delay: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Show ship delay",
        default: 2000, //1000,
        description:
          "Duration between trade attempt mouseclick and appearance of ship.",
      },
      ship_balance: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Balance ship probabilities.",
        default: true,
        description: "Balance ship appearance probabilities.",
      },
      probability_ship: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: "Probability of ship appearance.",
        array: true,
        default: [0.5, 0.5, 0.5],
        description:
          "Probability the ship will appear when a planet button is clicked.",
      },
      ship_stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Ship stimuli",
        default: null,
        array: true,
        description: "Images for ships--one for each planet.",
      },
      ship_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Ship height",
        default: 200,
        description: "Height of ship.",
      },
      ship_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Ship width",
        default: 300,
        description: "Width of ship.",
      },
      show_ship_delay: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Show ship delay",
        default: 0, //1000,
        description:
          "Duration between presentation of planet reward and appearance of ship.",
      },
      ship_attack_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Ship Time to Attack",
        default: 4000,
        description: "Duration between ship appearance and attack.",
      },
      ship_attack_damage: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: "Ship damage",
        array: true,
        default: [
          [0, "points"],
          [100, "points"],
          [20, "percent"],
        ],
        description:
          "Array of ship damage values: [0 damage, 100 damage, 20% of total points]",
      },
      shield_charging_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Shield charging duration",
        default: 2000, //2000
        description: "Duration of shield charging prompt.",
      },
      probability_shield: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: "Probability of shield",
        array: true,
        default: [0.5, 0.5],
        description:
          "Probability of shield availability after charging for each ship.",
      },
      shield_prevent_trading: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Shield prevents trading when active",
        default: true,
        description: "Shield prevents trading when active.",
      },
      shield_balance: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Balance shield probabilities.",
        default: true,
        description: "Balance shield availability probabilities.",
      },

      shield_cost_toggle: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Toggle shield activation cost",
        default: true,
        description: "Toggle whether activating the shield incurs a cost.",
      },
      shield_cost_amount: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Shield activation cost",
        default: 50,
        description:
          "Cost of shield activation (if shield_cost_toggle is true).",
      },
      cursor: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Cursor images",
        array: true,
        default: ["./assets/cursor.png", "./assets/cursordark.png"],
        description:
          "1st Element: default cursor; 2nd Element: mousedown cursor",
      },
      signal_time_range: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "[disabled]Signal duration range [currently disabled]",
        array: true,
        default: [2000, 2000, 2000],
        description:
          "[disabled] Range of duration of signal image above chosen planet, in ms.",
      },
      reset_planet_wait: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "[disabled]Planet reset wait time",
        default: 2000,
        description:
          "[disabled]Time between end of last planet message and the resetting of planet choice.",
      },
      reset_ship_wait: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "[disabled]Ship reset wait time",
        default: 1000,
        description:
          "[disabled]Time between end of last ship outcome and ship disappearance.",
      },
      ship_outcome_1_unshielded: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship outcome 1 unshielded",
        default: "",
        description: "The text for ship outcome 1 when unshielded.",
      },
      ship_outcome_2_unshielded: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship outcome 2 unshielded",
        default: "",
        description: "The text for ship outcome 2 when unshielded.",
      },
      ship_outcome_3_unshielded: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship outcome 3 unshielded",
        default: "",
        description: "The text for ship outcome 3 when unshielded.",
      },
      ship_outcome_3_shielded: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship outcome 3 shielded",
        default: "",
        description: "The text for ship outcome 3 when shielded.",
      },
      ship_outcome_3_shielded_alt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship outcome 3 shielded (alternative)",
        default: "",
        description:
          "Alternative version of the text for ship outcome 3 when shielded.",
      },
      show_whether_shield_blocked_attack_or_bonus: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Toggle use of "Shield prevented a bonus" image',
        default: false,
        description:
          "Toggle whether the user is told that the shield blocked a bonus (true), or is just told that it blocked an attack regardless of whether it was an attack or a bonus (false; default).",
      },
    },
  };

  var cssString = `
    /* Shield styles */
    .ship-shield {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .ship-shield-bar {
        width: 200px; /* Adjust this value to set the desired width of the charging bar */
        height: 20px;
        background-color: #ccc;
        position: relative;
        overflow: hidden;
    }
    .ship-shield-bar-fill {
        height: 100%;
        background-color: green;
        animation: shieldChargeBar 6s linear forwards;
    }
    @keyframes shieldChargeBar {
        0% {
            width: 0;
        }
        100% {
            width: 100%;
        }
    }
    .ship-shield-text {
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: bold;
    }
    @keyframes shieldChargeText {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`;

  // Create a style element and append the CSS string to it
  var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.innerHTML = cssString;
  document.head.appendChild(styleElement);

  plugin.trial = function(display_element, trial) {
    var html = "";
    html += '<div id="game-container">';
    html += '<div><div class="clickid" id="total-score-box"></div>';
    html += '<div id="planet-row">';

    var display_wrapper = document.getElementsByClassName(
      "jspsych-content-wrapper",
    )[0];

    //Some general custom styles (cursor, text color, bgcolor)
    display_element.style.cursor = "url('" + trial.cursor[0] + "'),pointer";
    display_wrapper.style.backgroundColor = "black";
    display_element.style.color = "green";

    // Create general div structure: Planet Row | Command Info
    if (Array.isArray(trial.stimulus)) {
      for (var i = 0; i < trial.stimulus.length; i++) {
        // Set up space for score, signal, and planet
        html += '<div id="planet-div-' + i + '" class="planet-div"> ';
        html +=
          '<div class="clickid planet-score-box" id="planet-score-box-' +
          i +
          '"></div><style>.planet-score-box img {width: 100%;}</style>';
        html += '<div class="planet-wrapper" style="position: relative; padding: 4px;">';
        //Write img tag
        html +=
          '<img class="planet-img clickid" src="' +
          trial.stimulus[i] +
          '" ' +
          'id="planet-' +
          i +
          '" ' +
          'allowclick="1" ' + //allow clicks?
          'style="';
        html += "z-index: 20;";
        html += "position: relative;";
        html += "display: block;";
        html += "width: 100%;";
        if (trial.stimulus_height !== null) {
          html += "height:" + trial.stimulus_height + "px; ";
          if (trial.stimulus_width == null && trial.maintain_aspect_ratio) {
            html += "width: auto; ";
          }
        }
        if (trial.stimulus_width !== null) {
          html += "width:" + trial.stimulus_width + "px; ";
          if (trial.stimulus_height == null && trial.maintain_aspect_ratio) {
            html += "height: auto; ";
          }
        }
        html += '"'; //End the style property quote
        html += 'data-choice="' + i + '" ';
        //Make images undraggable
        html += 'draggable="false" ';
        html += "></img>";
        //Add select ring
        html += '<img class="planet-select" id="planet-select-' + i + '"> ';
        html += "</div>";

        //show planet names below the planet
        if (trial.prompt !== null) {
          html +=
            '<div class="clickid planet-prompt" id="planet-prompt-' +
            i +
            '" style="position:relative; font-size: 24px;">';
          html += trial.prompt[i];
          html += "</div>";
        }
        //Add signal box
        html +=
          '<div class="clickid planet-signal-box" id="planet-signal-box-' +
          i +
          '" style="position:absolute; top:100px;"></div> ';
        //End planet div
        html += "</div>";
      }
    }

    html += "</div></div>";
    html += '<div id="command-info">';
    html += '<div id="ship-placeholder" style="height: 380px; width: 100%;"></div>';
    html += '<div id="shield-placeholder" style="height: 92px; width: 100%;"></div>';
    html += "</div>";
    html += "</div>";

    //Render basic div structure
    display_element.innerHTML = html;

    // Apply CSS grid to the game container
    var gameContainer = display_element.querySelector("#game-container");
    gameContainer.style.display = "grid";
    gameContainer.style.gridTemplateColumns = "2fr 1fr"; // Allocate 2/3 width to planet row and 1/3 to command info
    gameContainer.style.maxWidth = "1500px";
    gameContainer.style.marginInline = "auto";

    // Position planets and command info elements in the grid
    var planetsDiv = display_element.querySelector("#planet-row");
    planetsDiv.style.display = "grid";
    planetsDiv.style.gridTemplateColumns = "1fr 1fr 1fr";
    planetsDiv.style.gap = "1rem";
    planetsDiv.style.paddingInline = "1rem";

    var commandInfo = display_element.querySelector("#command-info");
    commandInfo.style.display = "grid";
    commandInfo.style.justifyItems = "center";
    commandInfo.style.border = "2rem solid grey";
    commandInfo.style.borderRadius = "8px";

    // Update planet creation to include planet name within the planet element
    var planetDivs = display_element.querySelectorAll(".planet-div");
    planetDivs.forEach(function(planetDiv, i) {
      // var planetImg = planetDiv.querySelector('.planet-img');
      // var selectionRing = planetDiv.querySelector('.planet-select');
      var planetName = planetDiv.querySelector(".planet-prompt");

      // planetDiv.appendChild(selectionRing);
      planetDiv.appendChild(planetName);
    });

    // Update ship creation to include ship image and shield elements within the ship placeholder
    var shipPlaceholder = display_element.querySelector("#ship-placeholder");
    shipPlaceholder.innerHTML =
      '<div id="ship-img-div" ' +
      'style="position:relative; top:0px; border: 0px; ' +
      "height: " +
      trial.ship_height +
      "px ;" +
      'draggable="false" ' +
      "> " +
      '<img src="' +
      trial.ship_stimulus[0] +
      '" ' +
      'id="ship-img" ' +
      'class="ship"' +
      'height="' +
      trial.ship_height +
      '" ' +
      'width="' +
      trial.ship_width +
      '" ' +
      'style="position:relative; top:0px; border: 0px; visibility:hidden;z-index:11;" ' + // Set initial visibility to hidden
      'draggable="false" ' +
      "> " +
      "</div>" +
      '<div class="ship" id="ship-attack-text"></div>' +
      '<div class="ship" id="ship-status-image" style="overflow: visible; height: 64px; position: relative; top: 28px;"></div>' +
      '<div class="ship" id="ship-status-text" style="width: 100%; height: 40px; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; position: relative; top: 28px;"></div>';
      

    const ship_attack_image_divs = [null,null,null,null,null];
    let index = 0;
    for (img of [trial.ship_outcome_1_unshielded, trial.ship_outcome_2_unshielded, trial.ship_outcome_3_unshielded, trial.ship_outcome_3_shielded, trial.ship_outcome_3_shielded_alt]) {
      ship_attack_image_divs[index] = document.createElement('div');
      ship_attack_image_divs[index].innerHTML = img;
      ship_attack_image_divs[index].style.position = "absolute";
      ship_attack_image_divs[index].style.display = "flex";
      ship_attack_image_divs[index].style.width = "100%";
      ship_attack_image_divs[index].style.height = "40px";
      ship_attack_image_divs[index].style.justifyContent = "center";
      ship_attack_image_divs[index].style.alignItems = "centre";
      ship_attack_image_divs[index].style.top = "0";
      ship_attack_image_divs[index].style.left = "0";
      ship_attack_image_divs[index].style.opacity = "0";
      ship_attack_image_divs[index].style.overflow = "visible";
      document.querySelector("#ship-status-image").appendChild(ship_attack_image_divs[index]);
      index += 1;
    }   
    const outcome_1_unshielded = ship_attack_image_divs[0];
    const outcome_2_unshielded = ship_attack_image_divs[1];
    const outcome_3_unshielded = ship_attack_image_divs[2];
    const outcome_3_shielded = ship_attack_image_divs[3];
    const outcome_3_shielded_alt = ship_attack_image_divs[4];

    function show_status_image(outcome) {
      for (div of ship_attack_image_divs) {
        if (div === outcome) {
          div.style.opacity = "1";
        }
        else {
          div.style.opacity = "0";
        }
      }
    }
    
    // Create shield elements and append them to the shield placeholder
    var shieldPlaceholder = display_element.querySelector(
      "#shield-placeholder",
    );

    updateScore(trial.data.points);

    // Initialise response variable
    var response = {
      planets: {
        click_idx: [],
        select: [],
        time_select: [],
        outcome: [],
        time_outcome: [],
      },
      ships: {
        type: [],
        time_appear: [],
        shield_available: [],
        shield_activated: [],
        rt_shield_activated: [],
        outcome: [],
        time_outcome: [],
      },
      all_outcomes: { outcome: [], time_outcome: [], total: [] },
      clicks: {
        idx: [],
        timestamp: [],
        loc: [],
        element: [],
      },
    };

    // These functions log mouseclicks throughout the experiment
    document.addEventListener("mousedown", getPositions);
    document.addEventListener("mouseup", resetCursor);

    // Important plugin-global variables
    var clickcnt = 0; // Track number of clicks
    var final_action = false; // flag this as true when time is more than block_duration
    var shipVisible = false; // Visibility state of ship img
    var shield_activated = null; //Shield state

    //Define variables for balanced probability arrays
    if (trial.trade_balance) {
      var tradeProbArrs = initProbArray(trial.probability_trade);
      var trade_orderbase = tradeProbArrs[0]; // Base set to randomise availability of trades
      var trade_log = tradeProbArrs[1]; // Arr to read future trade success
      var trade_read = tradeProbArrs[2]; // Arr to log trade success
    }
    if (trial.ship_balance) {
      var shipProbArrs = initProbArray(trial.probability_ship);
      var ship_orderbase = shipProbArrs[0];
      var ship_log = shipProbArrs[1];
      var ship_read = shipProbArrs[2];
    }
    if (trial.shield_balance) {
      var shieldProbArrs = initProbArray(trial.probability_shield);
      var shield_orderbase = shieldProbArrs[0];
      var shield_log = shieldProbArrs[1];
      var shield_read = shieldProbArrs[2];
    }

    console.log("Shield orderbase:", shield_orderbase);
    console.log("Shield log:", shield_log);
    console.log("Shield read:", shield_read);

    // Go through each choice and implement conditional mouseclick events, also mouseover, and select ring
    for (var i = 0; i < trial.stimulus.length; i++) {
      var element = display_element.querySelector("#planet-" + i);
      var conditionStr =
        'element.getAttribute("allowclick")=="1" && shield_activated!=true'; //'response.option==null'
      var styleDef = ["opacity:1;"];
      var styleChange = ["opacity:.5;"];
      var result = after_response;
      var clickOnMouseDown = true; //activate click immediately on mousedown
      cond_click(
        element,
        result,
        conditionStr,
        styleDef,
        styleChange,
        clickOnMouseDown,
      );
      //Handle mouseover
      //have to make mouseover imgs global
      element.addEventListener("mouseover", planet_mOver);
      element.addEventListener("mouseout", planet_mOut);
      //Disable selection of images
      element.addEventListener("click", function(e) { });

      //Also fix width of scorebox
      var planetRect = element.getBoundingClientRect();
      var elementbx = display_element.querySelector("#planet-score-box-" + i);
      elementbx.style.display = "block";
      elementbx.style.fontSize = "25px";
      elementbx.style.height = "50px";
      elementbx.style.padding = "20px 0px";

      //Implement selectring positioning
      var planetRect = element.getBoundingClientRect(); //fetch this a second time because the planet-score-box can mess with coordinates
      var selectring = display_element.querySelector("#planet-select-" + i);
      selectring.src = trial.stimulus_select;
      selectring.style.visibility = "hidden";
      selectring.style.position = "absolute";
      selectring.style.top = "0";
      selectring.style.left = "0";
      selectring.style.zIndex = "0";
      selectring.style.width = "100%";
    }

    // function to handle procedure following a valid planet-choice response
    function after_response(element) {
      // Lock clicking
      element.setAttribute("allowclick", 0);
      var choice = element.getAttribute("data-choice");
      // measure timestamp
      var end_time = performance.now();
      var rt = end_time - start_time;
      var click_idx = response.clicks.idx.slice(-1)[0]; //idx of this click is the last element in clicks
      //Since response.clicks.idx is updated only after this script though, add 1 to the number
      if (click_idx == null) {
        click_idx = 0;
      } else {
        click_idx++;
      }
      // Log response details
      response.planets.select.push(Number(choice));
      response.planets.time_select.push(rt);
      response.planets.click_idx.push(click_idx);

      console.log("Planet selected:", choice);
      console.log("Response time:", rt);
      console.log("Click index:", click_idx);

      //Run trade procedure
      proceed_trade(choice);
    }

    // function to show the signal, run trade, then show outcome
    function proceed_trade(choice) {
      //Get planet position
      var signalPadding = trial.signal_padding;
      var planet = display_element.querySelector("#planet-" + choice);
      var planetWidth = planet.getBoundingClientRect().width;
      var planetX = planet.getBoundingClientRect().x;
      var signalLeft =
        planetWidth / 2 - (trial.signal_width + signalPadding * 2) / 2;

      // Get the position of the planet prompt
      var planetPrompt = display_element.querySelector(
        "#planet-prompt-" + choice,
      );
      var promptRect = planetPrompt.getBoundingClientRect();

      //Display signal image and status
      document.querySelector("#planet-signal-box-" + choice).innerHTML =
        '<img src="./assets/signal1.png" ' +
        'id="planet-signal-img-' +
        choice +
        '" ' +
        'style="display:block; position: relative;' +
        "height: " +
        (trial.signal_width - 10) +
        "px; " +
        "width: " +
        trial.signal_width +
        "px; " +
        "left:" +
        signalLeft +
        "px;" +
        "top:" +
        (promptRect.bottom + 1) +
        "px;" +
        "padding: " +
        signalPadding +
        "px;" +
        "visibility: visible;" +
        '">';

      //Implement trade attempt message
      var signal_step_time = 250;
      var signal_int_id = setInterval(sigframe, signal_step_time);
      var signal_dot_count_max = 3;
      var signal_dot_count = Math.ceil(Math.random() * signal_dot_count_max);
      var signal_attempt_str = "Attempting trade";
      var signalmsg =
        signal_attempt_str +
        colordots(signal_dot_count_max, 0, "black", signalclr); // '.'.
      var signalclr = "#b4ba38"; //some shade of yellow
      var signal_max_time = trial.signal_time + performance.now();
      //Also vars for signal img
      var signal_img_count_max = 4;
      var signal_img_count = Math.ceil(Math.random() * signal_img_count_max);
      var signalImg = display_element.querySelector(
        "#planet-signal-img-" + choice,
      );
      signalImg.src = "./assets/signal" + signal_img_count + ".png";

      updateStatus(choice, signalmsg, signalclr);
      function sigframe() {
        var curr_time = performance.now();
        if (curr_time > signal_max_time) {
          clearInterval(signal_int_id);
        } else {
          var dots = colordots(
            signal_dot_count_max,
            signal_dot_count,
            "black",
            signalclr,
          ); // '.'.repeat(signal_dot_count)
          signal_dot_count++;
          if (signal_dot_count > signal_dot_count_max) {
            signal_dot_count = 0;
          }
          signalmsg = signal_attempt_str + dots;
          updateStatus(choice, signalmsg, signalclr);
          //Update signal img
          signal_img_count++;
          if (signal_img_count > signal_img_count_max) {
            signal_img_count = 1;
          }
          var signalImg = display_element.querySelector(
            "#planet-signal-img-" + choice,
          );
          signalImg.src = "./assets/signal" + signal_img_count + ".png";
        }
      }
      //This is an example of spending a little too much effort into a trivial detail...
      function colordots(totalct, colorct, baseclr, fontclr) {
        outStr = "";
        for (var i = 0; i < totalct; i++) {
          if (i < colorct) {
            var color = fontclr;
          } else {
            var color = baseclr;
          }
          outStr += '<font color="' + color + ' ">.</font>';
        }
        return outStr;
      }
      // Run trade
      if (trial.trade_balance) {
        var tradeBalOut = balanceSuccess(
          trade_orderbase,
          trade_log,
          trade_read,
          choice,
          true,
          "trade",
        );
        trade_success = tradeBalOut[0];
        trade_log = tradeBalOut[1];
        trade_read = tradeBalOut[2];
      } else {
        trade_success = Math.random() < trial.probability_trade[choice];
      }

      console.log("Trade success:", trade_success);

      if (trade_success) {
        //Add and display reward
        var displayScore = trial.rewards[choice];
        var statusmsg = win_100_text; // + displayScore + ' points';
        console.log("Trade success message:", statusmsg);
      } else {
        //Display some fail state
        var displayScore = 0;
        var statusmsg = "Trade attempt failed";
        var statusclr = "yellow";
        console.log("Trade failure message:", statusmsg);
      }

      //Check time and disable planets if final_action was flagged previously
      checkTimeExceed();

      // Skip ship-related code if show_ship is false
      if (!trial.show_ship) {
        // Wait before showing outcome
        setTimeout(function() {
          //Compute total points
          trial.data.points += displayScore;
          //Hide signal image
          document.querySelector(
            "#planet-signal-img-" + choice,
          ).style.visibility = "hidden";
          updateScore(trial.data.points);
          updateStatus(choice, statusmsg, statusclr);

          // Log response details
          var time_outcome = performance.now() - start_time;
          response.planets.outcome.push(displayScore);
          response.planets.time_outcome.push(time_outcome);
          // Also update a single list of outcomes for easier tracking of each change in score
          response.all_outcomes.outcome.push(displayScore);
          response.all_outcomes.time_outcome.push(time_outcome);
          // Finally, update running total
          response.all_outcomes.total.push(trial.data.points);

          console.log("Outcome:", displayScore);
          console.log("Outcome time:", time_outcome);
          console.log("Total points:", trial.data.points);

          //reset planets after short delay
          setTimeout(function() {
            reset_planet(planet, choice);
          }, trial.feedback_duration);
        }, trial.signal_time);

        return; // Exit the function if show_ship is false
      }

      // Ship-related code
      var show_ship_check = false;
      var show_ship_samp = Math.random();
      if (trial.ship_balance) {
        var shipBalOut = balanceSuccess(
          ship_orderbase,
          ship_log,
          ship_read,
          choice,
          true,
          "ship",
        );
        show_ship_check = shipBalOut[0];
        ship_log = shipBalOut[1];
        ship_read = shipBalOut[2];
      } else {
        if (show_ship_samp < trial.probability_ship[choice]) {
          show_ship_check = true;
        }
      }
      console.log("Show ship check:", show_ship_check);
      console.log("Show ship sample:", show_ship_samp);

      // Start timer for ship
      if (show_ship_check) {
        setTimeout(function() {
          if (!shipVisible) {
            show_ship(choice);
          }
        }, trial.show_ship_delay);
      }

      // Wait before showing outcome
      setTimeout(function() {
        //Compute total points
        trial.data.points += displayScore;
        //Hide signal image
        document.querySelector(
          "#planet-signal-img-" + choice,
        ).style.visibility = "hidden";
        updateScore(trial.data.points);
        updateStatus(choice, statusmsg, statusclr);

        // Log response details
        var time_outcome = performance.now() - start_time;
        response.planets.outcome.push(displayScore);
        response.planets.time_outcome.push(time_outcome);
        // Also update a single list of outcomes for easier tracking of each change in score
        response.all_outcomes.outcome.push(displayScore);
        response.all_outcomes.time_outcome.push(time_outcome);
        // Finally, update running total
        response.all_outcomes.total.push(trial.data.points);

        console.log("Outcome:", displayScore);
        console.log("Outcome time:", time_outcome);
        console.log("Total points:", trial.data.points);

        //reset planets after short delay
        setTimeout(function() {
          reset_planet(planet, choice);
        }, trial.feedback_duration); //trial.reset_planet_wait
      }, trial.signal_time);
    }

    // Function to update the state of the shield
    var shield_start_time = null;
    var shield_success = Math.random() > trial.probability_shield[0]; // Initialize based on the first element of trial.probability_shield

    function proceed_shield(choice) {
      if (trial.shield_balance) {
        var shieldBalOut = balanceSuccess(
          shield_orderbase,
          shield_log,
          shield_read,
          choice,
          true,
          "shield",
        );
        shield_success = shieldBalOut[0];
        shield_log = shieldBalOut[1];
        shield_read = shieldBalOut[2];
      } else {
        // Run shield gamble
        shield_success = Math.random() < trial.probability_shield[choice];
      }

      // Update the shield UI based on shield availability
      updateShieldUI(shield_success);

      // Log shield state
      response.ships.shield_available.push(shield_success);

      if (shield_success) {
        shield_start_time = performance.now();
      }
    }
    function createShieldHTML() {
      var shieldBoxDiv = display_element.querySelector("#shield-placeholder");
      shieldBoxDiv.innerHTML = `
        <div class="ship-shield">
            <div class="ship-shield-text" id="ship-shield-text"></div>
            <div class="ship-shield-bar">
                <div class="ship-shield-bar-fill" id="ship-shield-bar-fill"></div>
            </div>
        </div>
        <div class="ship" id="ship-shield-button"></div>
    `;
    }

    function updateShieldUI(shield_success) {
      var shieldTxtDiv = display_element.querySelector(".ship-shield-text");
      var shieldButton = display_element.querySelector("#ship-shield-button");

      if (shield_success) {
        shieldTxtDiv.textContent = "SHIELD AVAILABLE";
        shieldButton.textContent = "ACTIVATE!";
        shieldButton.style.opacity = "1";
        shieldButton.addEventListener("click", activateShield);

        // Add green rectangle over the shield button
        shieldButton.style.border = "2px solid #1eff19";
        shieldButton.style.boxShadow = "0 0 5px #1eff19";

        console.log("Shield UI updated: SHIELD AVAILABLE");
      } else {
        shieldTxtDiv.textContent = "SHIELD UNAVAILABLE";
        shieldButton.textContent = "NO SHIELD";
        shieldButton.style.opacity = "1";

        // Remove green rectangle from the shield button
        shieldButton.style.border = "none";
        shieldButton.style.boxShadow = "none";

        console.log("Shield UI updated: SHIELD UNAVAILABLE");
      }
    }

    // Handle activation of shields
    function activateShield() {
      // Log data
      var end_time = performance.now();
      var rt = end_time - shield_start_time;
      shield_activated = true;
      response.ships.rt_shield_activated.push(rt); // Logging of activation state will be performed at the time of ship attack

      console.log("Shield activated");
      console.log("Shield activation time:", rt);

      // Update shield text and button
      var shieldTxtDiv = display_element.querySelector(".ship-shield-text");
      var shieldButton = display_element.querySelector("#ship-shield-button");
      shieldTxtDiv.textContent = "SHIELD ACTIVATED";
      shieldButton.textContent = "ACTIVE";
      shieldButton.style.color = "#1eff19";
      shieldButton.style.backgroundColor = "#196d17";

      // Add cost if specified
      var shieldTxtStr = "Shield activated";
      if (trial.shield_cost_toggle) {
        shieldTxtStr = "Shield cost: -" + trial.shield_cost_amount + " points";
        trial.data.points -= trial.shield_cost_amount;

        console.log("Shield cost applied:", trial.shield_cost_amount);

        // Update score
        updateScore(trial.data.points);

        // Log details
        var time_outcome = performance.now() - start_time;
        response.all_outcomes.outcome.push(-trial.shield_cost_amount);
        response.all_outcomes.time_outcome.push(time_outcome);
        response.all_outcomes.total.push(trial.data.points);
      }
      shieldTxtDiv.textContent = shieldTxtStr;
    }

    // function to show ship img and subsequent procedure
    // Function to show the ship image and subsequent procedure

    function show_ship(choice) {
      // Put stuff into the ship divs
      var shipImgDiv = display_element.querySelector("#ship-img-div");
      shipImgDiv.style.visibility = "visible"; // Update visibility to visible when the ship is activated
      // ...
      shipImgDiv.innerHTML =
        '<img src="' +
        trial.ship_stimulus[choice] +
        '" ' +
        'id="ship-img" ' +
        'class="ship"' +
        'height="' +
        trial.ship_height +
        '" ' +
        'width="' +
        trial.ship_width +
        '" ' +
        'style="position:relative; top:0px; border: 0px; visibility:visible;z-index:11;" ' +
        'draggable="false" ' +
        "> ";
      shipVisible = true;
      var shipImg = display_element.querySelector("#ship-img");
      logIDonMouseDown(shipImg);

      var shipStatTxt = display_element.querySelector("#ship-status-text");
      shipStatTxt.style.fontSize = "25px";
      shipStatTxt.style.color = "red";
      shipStatTxt.style.visibility = "visible";
      logIDonMouseDown(shipStatTxt);

      var shipAtTxt = display_element.querySelector("#ship-attack-text");
      shipAtTxt.style.fontSize = "25px";
      shipAtTxt.style.color = "red";
      shipAtTxt.style.visibility = "visible";
      var attack_int_id = setInterval(attframe, 1000);
      var attack_countdown = trial.ship_attack_time / 1000;
      shipAtTxt.innerHTML = "Encounter imminent " + attack_countdown + " "; // Show first frame
      function attframe() {
        if (attack_countdown <= 0) {
          clearInterval(attack_int_id);
        } else {
          attack_countdown--;
          shipAtTxt.innerHTML = "Encounter imminent " + attack_countdown + " s";
        }
      }
      logIDonMouseDown(shipAtTxt);

      // Create the shield HTML structure
      createShieldHTML();

      // Update the shield UI based on shield availability
      updateShieldUI(shield_success);

      // Start timer for ship to attack and timeout
      setTimeout(function() {
        ship_attack(choice);
      }, trial.ship_attack_time);

      // Log ship appearance details
      response.ships.type.push(choice);
      response.ships.time_appear.push(performance.now() - start_time);

      console.log("Ship appeared:", choice);
      console.log("Ship appearance time:", performance.now() - start_time);
    }
    function formatShipOutcomeText(outcomeText, damage) {
      if (typeof damage != "number") {
        console.log("invalid damage value passed to formatShipOutcomeText");
        return;
      }
      let gain = -damage;
      return (
        outcomeText +
        '<span style="font-weight: bold;font-size: 36px; color: inherit;">' +
        (gain > 0 ? "+" : "") +
        gain +
        " points</span>"
      );
    }

    function ship_attack(choice) {
      // Disable button if no response
      if (shield_activated == null) {
        shield_activated = false;
        response.ships.rt_shield_activated.push(null);
      }

      // Log shield response
      response.ships.shield_activated.push(shield_activated);
      console.log("Shield activated:", shield_activated);

      console.log(trial.ship_attack_damage[choice]);

      // Calculate damage based on the attacking ship's index and the ship_attack_damage parameter
      const damageValue = trial.ship_attack_damage[choice][0];
      const damageType = trial.ship_attack_damage[choice][1];
      const pointsLost =
        damageType == "percent"
          ? Math.round(trial.data.points * (damageValue / 100))
          : damageValue;
      //const appliedDamage = typeof damageTypes[choice] === 'number' ? damageTypes[choice] : damageTypes[choice](trial.data.points);
      console.log("Damage:", pointsLost);

      // Check if the applied damage is not equal to 0 before proceeding with the attack
      if (pointsLost !== 0) {
        statusmsg = "";
        // Apply points loss depending on the choice and the shield activation
        if (!shield_activated) {
          // Subtract the calculated damage from the points
          const initialPoints = trial.data.points; // Store the initial points before damage
          trial.data.points -= pointsLost;
          if (damageType == "percent") {
            if (pointsLost >= 0) {
              show_status_image(outcome_2_unshielded);
              statusmsg = formatShipOutcomeText("", pointsLost);
              statusclr = "darkorange";
              console.log("INDEX 2, points lost:", pointsLost);
            } else {
              show_status_image(outcome_3_unshielded);
              statusmsg = formatShipOutcomeText("", pointsLost);
              statusclr = "yellow";
              console.log("INDEX 2, points gained:", -pointsLost);
            }
          } else {
            if (pointsLost >= 0) {
              show_status_image(outcome_1_unshielded);
              statusmsg = formatShipOutcomeText("", pointsLost);
              statusclr = "red";
              console.log("INDEX 1, damage:", pointsLost);
            } else {
              show_status_image(outcome_3_unshielded);
              statusmsg = formatShipOutcomeText("", pointsLost);
              statusclr = "yellow";
              console.log("INDEX 2, bonus:", -pointsLost);
            }
          }
          const pointsDifference = initialPoints - trial.data.points; // Calculate the points difference
          console.log("Initial points:", initialPoints);
          console.log("Updated points:", trial.data.points);
          console.log("Points difference:", pointsDifference);
          document.querySelector("#ship-status-image").style.visibility = "visible";
          console.log("Status message:", statusmsg);

          // Update score
          updateScore(trial.data.points);
        } else if (shield_activated) {
          console.log("Shield activated, setting status message");
          if (
            damageValue > 0 ||
            !trial.show_whether_shield_blocked_attack_or_bonus
          ) {
            show_status_image(outcome_3_shielded);
            statusclr = "grey";
          } else {
            show_status_image(outcome_3_shielded_alt);
            statusclr = "yellow";
          }
          console.log("Status message:", statusmsg);
          console.log("Status color:", statusclr);
          document.querySelector("#ship-status-image").style.visibility = "visible";
        }

        console.log("Updating ship status");
        updateStatus("ship", statusmsg, statusclr);
      }

      // Log details
      var time_outcome = performance.now() - start_time;
      response.ships.outcome.push(-pointsLost);
      response.ships.time_outcome.push(time_outcome);
      // Also update a single list of outcomes for easier tracking of each change in score
      response.all_outcomes.outcome.push(-pointsLost);
      response.all_outcomes.time_outcome.push(time_outcome);
      // Finally, update total
      response.all_outcomes.total.push(trial.data.points);
      console.log("Updated total points:", trial.data.points);

      // Visually disable button
      var shieldDiv = display_element.querySelector("#ship-shield-text");
      var shieldButton = display_element.querySelector("#ship-shield-button");
      console.log("Shield div:", shieldDiv);
      console.log("Shield button:", shieldButton);
      if (!shield_activated) {
        console.log("Shield not activated, disabling button");
        shieldButton.style.opacity = ".5";
        shieldButton.style.backgroundColor = "";
        shieldButton.style.color = "green";
      }

      // Reset ship
      setTimeout(function() {
        reset_ship();
        // Hide the ship outcome div when resetting the ship
        //   shipOutcomeDiv.style.visibility = 'hidden';
      }, trial.feedback_duration);

      // Print hostile IDX to console
      console.log("Hostile IDX:", choice);
    }

    // function to end trial when it is time
    function end_trial() {
      setTimeout(function() {
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        //Remove tracking and logging of mouseclicks and related events
        document.removeEventListener("mousedown", getPositions);
        document.removeEventListener("mouseup", resetCursor);
        //Reset styles

        for (var i = 0; i < trial.stimulus.length; i++) {
          var planetEl = display_element.querySelector("#planet-" + i);
          planetEl.removeEventListener("mouseout", planet_mOut);
        }
        //Reset styles
        display_element.style.cursor = "default";
        display_wrapper.style.backgroundColor = "#FFFFFF";
        display_element.style.color = "black";
        //Get viewport size
        var win = window,
          doc = document,
          docElem = doc.documentElement,
          body = doc.getElementsByTagName("body")[0],
          vpWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
          vpHeight =
            win.innerHeight || docElem.clientHeight || body.clientHeight;
        //Get location of main div
        body.style.background = "black";
        var dpRect = display_element.getBoundingClientRect(),
          dpx = dpRect.left,
          dpy = dpRect.top;
        proceed_shield;
        // gather the data to store for the trial
        var trial_data = {
          stimuli: { planets: trial.stimulus, ships: trial.ship_stimulus },
          planets: response.planets,
          ships: response.ships,
          all_outcomes: response.all_outcomes,
          all_clicks: response.clicks,
          points_total: trial.data.points,
          block_type: trial.data.block_type,
          block_number: trial.data.block_number,
          trial_number: trial.data.trial_number,
          viewport_size: [vpWidth, vpHeight],
          display_loc: [dpx, dpy],
          block_duration: trial.block_duration,
          feedback_duration: trial.feedback_duration,
          signal_time: trial.signal_time,
          probability_trade: trial.probability_trade,
          rewards: trial.rewards,
          show_ship: trial.show_ship,
          show_ship_delay: trial.show_ship_delay,
          probability_ship: trial.probability_ship,
          show_ship_delay: trial.show_ship_delay,
          ship_attack_time: trial.ship_attack_time,
          ship_attack_damage: trial.ship_attack_damage,
          shield_charging_time: trial.shield_charging_time,
          shield_success: trial.shield_success,
          probability_shield: trial.probability_shield,
          shield_prevent_trading: trial.shield_prevent_trading,
          shield_cost_toggle: trial.shield_cost_toggle,
          shield_cost_amount: trial.shield_cost_amount,
        };

        console.log("Trial data:", trial_data);

        // clear the display
        display_element.innerHTML = "";

        // move on to the next trial
        console.log(trial_data);
        jsPsych.finishTrial(trial_data);
      }, trial.end_trial_wait);
    }

    //After everything has loaded, loop through all elements and add an eventlistener to fetch id on mousedown
    var allDOM = display_element.getElementsByClassName("clickid");
    for (var i = 0, max = allDOM.length; i < max; i++) {
      element = allDOM[i];
      logIDonMouseDown(element);
    }

    //Start block timer
    timer_end(trial.block_duration);
    //Save timestamp at start
    var start_time = performance.now();

    ////
    //// General but plugin-specific functions
    ////

    function updateScore(points) {
      //Update total score
      if (trial.show_total_points) {
        scoreDiv = display_element.querySelector("#total-score-box");
        //scoreDiv.style.color = 'green'
        scoreDiv.style.fontSize = "30px";
        scoreDiv.innerHTML = "Total points: " + points;

        console.log("Updated score:", points);
      }
    }

    function updateStatus(choice, msg, color) {
      //Update planet status with some message and in some colour
      var statusDiv;
      if (choice == "ship") {
        statusDiv = display_element.querySelector("#ship-status-text");
        statusDiv.innerHTML = msg;
      } else {
        statusDiv = display_element.querySelector(
          "#planet-score-box-" + choice,
        );
        statusDiv.innerHTML = msg;
      }
      statusDiv.style.color = color;

      console.log("Updated status:", msg, statusDiv.cloneNode(true));
    }

    // Track mouse events
    function getPositions(ev) {
      // Function to record all mouseclicks
      if (ev == null) {
        ev = window.event;
      }
      _mouseX = ev.clientX;
      _mouseY = ev.clientY;
      console.log("X: " + _mouseX + " Y: " + _mouseY);
      log_click([_mouseX, _mouseY]);
    }
    function log_click(cursor_loc) {
      //Save mouse coords into data structure, along time and with time
      response.clicks.idx.push(clickcnt);
      response.clicks.timestamp.push(performance.now() - start_time);
      response.clicks.loc.push(cursor_loc);
      clickcnt++;
      console.log(response.clicks);
      display_element.style.cursor = "url('" + trial.cursor[1] + "'),pointer"; //"url('cursordark.png'),pointer"
    }
    function logIDonMouseDown(element) {
      // Log id on mousedown
      element.addEventListener("mousedown", function(e) {
        console.log(e.currentTarget.id);
        //Only log element if not hidden
        if (e.currentTarget.style.visibility == "hidden") {
          response.clicks.element[clickcnt] = undefined;
        } else {
          response.clicks.element[clickcnt] = e.currentTarget.id;
        }
        //clicks.element.push(e.currentTarget.id)
      });
    }
    function resetCursor() {
      //Reset cursor to default style
      display_element.style.cursor = "url('" + trial.cursor[0] + "'),pointer";
    }

    function planet_mOver(e) {
      // Implement planet mouseover effects
      var ct = e.currentTarget;
      var choice = ct.getAttribute("data-choice");
      var cSelect = document.getElementById("planet-select-" + choice); //current selectring
      cSelect.style.visibility = "visible";
      //Highlight planet names
      var cp = document.getElementById("planet-prompt-" + choice); //current prompt
      var currtext = cp.innerHTML;
      cp.innerHTML = '<font color="#05BF00">' + currtext + "</font>"; //dis brite gre3n
    }
    function planet_mOut(e) {
      // Implement planet mouseout effects
      var ct = e.currentTarget;
      var choice = ct.getAttribute("data-choice");
      var cSelect = document.getElementById("planet-select-" + choice); //current selectring
      cSelect.style.visibility = "hidden";
      //Reset planet name format
      var cp = document.getElementById("planet-prompt-" + choice); //current prompt
      cp.innerHTML = cp.innerHTML.replace(/<font.*">/, "");
      cp.innerHTML = cp.innerHTML.replace("</font>", "");
    }

    function cond_click(
      element,
      result,
      conditionStr,
      styleDef,
      styleChanges,
      clickOnMouseDown,
    ) {
      // General function to add conditional mouseclicks to an element
      // Also do one for mousedown events
      element.addEventListener("mousedown", function(e) {
        var condition = eval(conditionStr);
        if (condition) {
          var ct = e.currentTarget;
          replaceStyle(element, styleChanges);
        }
      });
      element.addEventListener("mouseleave", function(e) {
        var condition = true; //eval(conditionStr)
        if (condition) {
          var ct = e.currentTarget;
          replaceStyle(element, styleDef);
        }
      });
      element.addEventListener("mouseup", function(e) {
        var condition = true;
        if (condition) {
          var ct = e.currentTarget;
          replaceStyle(element, styleDef);
        }
      });
      if (clickOnMouseDown) {
        var eventStr = "mousedown";
      } else {
        var eventStr = "click";
      }
      element.addEventListener(eventStr, function(e) {
        var condition = eval(conditionStr); //eval is necessary for the condition to be checked only when event is triggered
        if (condition) {
          var ct = e.currentTarget;
          result(ct);
        }
      });
    }
    function replaceStyle(element, styleChange) {
      //Handle find and replace in style attribute
      for (var i = 0; i < styleChange.length; i++) {
        //Make pattern, extract style name and value
        var newPatt = /(.+?):(.+?);/;
        var styleFull = styleChange[i];
        var styleMatch = styleFull.match(newPatt);
        if (styleMatch) {
          var styleName = styleMatch[1];
          var styleValue = styleMatch[2];
          var findPatt = new RegExp(";s*" + styleName + "s*:.+?;");
          var findPattStart = new RegExp("^" + styleName + "s*:.+?;");
          //Get current style
          var currStyle = element.getAttribute("style") || "";
          //Add to style changes, check if at the start first
          if (currStyle.search(findPattStart) >= 0) {
            var newStyle = currStyle.replace(findPattStart, styleFull);
          } else if (currStyle.search(findPatt) >= 0) {
            var newStyle = currStyle.replace(findPatt, "; " + styleFull);
          } else {
            var newStyle = currStyle + styleFull;
          }
          element.setAttribute("style", newStyle);
        }
      }
    }

    //Resetting functions
    function reset_planet(planet, choice) {
      //Check if block time is up, else reset planet choice
      //Reset some display elements
      if (!final_action) {
        planet.setAttribute("allowclick", 1);
      }
      updateStatus(choice, "", "");
      if (!trial.show_ship || final_action) {
        if (check_end()) {
          end_trial();
        }
      }
    }
    function reset_ship() {
      // Hide ship div
      var shipEls = display_element.getElementsByClassName("ship");
      for (var i = 0; i < shipEls.length; i++) {
        shipEls[i].style.visibility = "hidden";
      }
      shipVisible = false;
      // Clear ship status text
      var shipStatTxt = display_element.querySelector("#ship-status-text");
      shipStatTxt.innerHTML = "";
      // Reset shield
      var shieldDiv = display_element.querySelector(".ship-shield");
      var shieldTxtDiv = display_element.querySelector(".ship-shield-text");
      var shieldButton = display_element.querySelector("#ship-shield-button");
      var shieldBar = display_element.querySelector("#ship-shield-bar-fill");
      shieldDiv.style.visibility = "hidden"; // Hide the shield div
      shieldTxtDiv.textContent = "";
      shieldButton.textContent = "ACTIVATE!"; // Reset shield button text
      shieldButton.style.opacity = 1;
      shieldButton.style.backgroundColor = "";
      shieldButton.style.color = "green";
      shieldBar.style.width = "0%"; // Reset the shield bar width
      shield_activated = null;

      console.log("Ship reset");

      // Check if can end block
      if (check_end()) {
        end_trial();
      }
    }
    function checkTimeExceed() {
      // Check if time exceeded, and if so, disable choices
      var checkTime = performance.now() - start_time >= trial.block_duration;
      if (checkTime) {
        final_action = true;
      }
      if (final_action) {
        for (var i = 0; i < trial.stimulus.length; i++) {
          var planetEl = display_element.querySelector("#planet-" + i);
          planetEl.setAttribute("allowclick", 0);
          planetEl.removeEventListener("mouseover", planet_mOver);
          //planetEl.removeEventListener('mouseout',planet_mOut)
        }
      }

      console.log("Time exceeded:", checkTime);
      console.log(trial.block_duration);
      console.log("Final action:", final_action);
    }
    function check_end() {
      // Check all end_trial conditions
      //Check that time is up
      var checkTime = performance.now() - start_time >= trial.block_duration;
      //Check that no planet statuses are active
      var check_count = 0;
      var checkStr = [];
      for (var i = 0; i < trial.stimulus.length; i++) {
        var el = display_element.querySelector("#planet-score-box-" + i);
        if (el.innerHTML != "") {
          checkStr.push("Planet " + i + " " + el.innerHTML);
          check_count++;
        }
      }
      if (check_count > 0) {
        var checkPlanet = false;
        //console.log(checkStr)
      } else {
        var checkPlanet = true;
      }

      var checkShip = true;
      if (trial.show_ship) {
        checkShip = false;
        if (!shipVisible) {
          checkShip = true;
        }
      }
      console.log(
        "ct " +
        checkTime +
        " cp " +
        checkPlanet +
        " cs " +
        checkShip +
        " fa " +
        final_action,
      );

      //Flag final action for next check
      checkTimeExceed();
      return checkTime && checkPlanet && checkShip;
    }
    function timer_end(duration) {
      //Timer to end trial after block_duration
      setTimeout(function() {
        //Check if can end block
        if (check_end()) {
          end_trial();
        }
      }, duration);
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
    var test = Math.round(n) / multiplicator;
    return +test.toFixed(digits);
  }

  //function genOrderBase(probSuccess,maxlength=10){
  window.genOrderBase = function(probSuccess, maxlength = 10) {
    //Function to generate a finite array of 1 (success) and (0) fails that closely approximates (if not exact) to some probability.
    // So if probSuccess is .5, this should return [0,1].
    // For a given max array length, generate all floating point numbers for all possible proportions
    var outarr = [];
    var numList = [];
    var denList = [];
    var floatList = [];
    var diffList = [];
    for (var i = 0; i < maxlength; i++) {
      var denom = i + 1;
      for (var ii = 0; ii < maxlength; ii++) {
        var numer = ii + 1;
        if (numer > denom) {
          //Ignore float values greater than 1
          continue;
        }
        var flt = numer / denom;
        var diff = Math.abs(flt - probSuccess);
        numList.push(numer);
        denList.push(denom);
        floatList.push(flt);
        diffList.push(diff);
      }
    }

    //Find float with smallest difference from specified probSuccess
    var minDiff = Math.min(...diffList);
    // Get indices of the smallest differences
    var minIdx = indexOfAll(diffList, minDiff);
    // Pick the one with lowest denominator
    var minDens = [];
    var minNums = [];
    for (var i = 0; i < minIdx.length; i++) {
      var mini = minIdx[i];
      minDens.push(denList[mini]);
      minNums.push(numList[mini]);
    }
    var minDen = Math.min(...minDens);
    //Get index of minDen and extract corresponding numerator
    var minDenIdx = minDens.indexOf(minDen);
    var minNum = minNums[minDenIdx];
    //Generate array of zeros (denom-numer)  and ones (numer)
    var zeros = [];
    for (var i = 0; i < minDen - minNum; i++) {
      zeros.push(0);
    }
    var ones = [];
    for (var i = 0; i < minNum; i++) {
      ones.push(1);
    }
    var outarray = zeros.concat(ones);
    return outarray;
  };

  function balanceSuccess(
    orderbase,
    arr_log,
    arr_read,
    choice,
    verbose = false,
    vstr = "",
  ) {
    //Function to output single samples from semi-random series of booleans
    // First, check shield arr_log
    var baselength = orderbase[choice].length;
    var arr_length = arr_log[choice].length;
    var arr_next = arr_length;
    // Multiples of shield appearances have shield availability sampled from uniform random
    if (arr_length / baselength == Math.round(arr_length / baselength)) {
      var arr_order = shuffleArray(orderbase[choice]);
      for (var ii = 0; ii < arr_order.length; ii++) {
        arr_read[choice].push(arr_order[ii]);
      }
    }
    arr_success = Boolean(arr_read[choice][arr_next]);
    if (verbose) {
      // console.log(vstr + ' array read: ' + String(arr_read[0]) + '; ' + String(arr_read[1]))
      // console.log(vstr + ' array log (before event): ' + String(arr_log[0]) + '; ' + String(arr_log[1]))
    }

    // Update log
    arr_log[choice].push(Number(arr_success));
    if (verbose) {
      // console.log(vstr + ' array log (after event): ' + String(arr_log[0]) + '; ' + String(arr_log[1]))
    }
    //Return arguments
    return [arr_success, arr_log, arr_read];
  }

  // initialise variables for balanced probability arrays
  function initProbArray(probSuccess) {
    var numOptions = 3; //determines number of planets 3 = 3 planets
    var orderbase = [];
    var arr_log = [];
    var arr_read = [];
    for (var i = 0; i < numOptions; i++) {
      orderbase.push(genOrderBase(probSuccess[i]));
      arr_log.push([]);
      arr_read.push([]);
    }
    return [orderbase, arr_log, arr_read];
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
