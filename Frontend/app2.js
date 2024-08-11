/* 
//----------------------------------------------------------------------------
// Experiment Parameters
//----------------------------------------------------------------------------
  Randomises the participant's group and sample. Also sets up the randomised
  position of the punished planet, left-right assignment of planets and ships,
  global variables, and the images list.  */
// Text/string based variables are imported through text.js via the global scope.

// Participant Sample Selection
let groups = ["early_0.1", "early_0.4", "late_0.1", "late_0.4"];
let group = jsPsych.randomization.sampleWithReplacement(groups, 1);
let samples = ["ProA", "others"];
let sample = samples[0];  

// randomise position of planets (left/middle/right as 0/1/2)
let num_planets = 3;
let planet_sides = [...Array(num_planets).keys()].map(x => x.toString());
let planet_side = jsPsych.randomization.sampleWithReplacement(planet_sides, 1)[0];

// Stimulus and image Initialization
// Ship and stim lists in original order
const stim_list_original = ['img/planet_p.png','img/planet_o.png', 'img/planet_b.png'];
const ship_list_original = ['img/ship1.png','img/ship2.png','img/ship3.png'];
// Ship and stim lists in randomised order
const stim_list = jsPsych.randomization.repeat(stim_list_original, 1);
const ship_list = jsPsych.randomization.repeat(ship_list_original, 1);

const stim_selector_highlight = 'img/selectring.png';
const images = [
  'img/signal1.png','img/signal2.png','img/signal3.png','img/signal4.png',
  'img/ship1.png','img/ship2.png', 'img/planet_p.png',
  'img/planet_b.png','img/planet_o.png',
  'img/cursor.png','img/cursordark.png', 'img/selectring.png',
  'img/win100.png', 'img/lose.png',
  'img/arrow.jpg', 'img/blank_lose.jpg', 'img/blank_arrow.jpg'
];
const planetColors = {
  'img/planet_p.png': 'pink',
  'img/planet_o.png': 'orange',
  'img/planet_b.png': 'blue',
};

// Independent Variables Definition
const probability_trade = [[.5], [.5], [.5]];
const probability_shield = [[.5], [.5], [.5]];
let ship_attack_damage = [0, 100, 0.2];
ship_attack_damage = jsPsych.randomization.shuffle(ship_attack_damage); //randomises the order of the ship damage array (ship_attack_damage)
//const block_duration = 180 * 1000; // in milliseconds (3 mins) // sets the length of planet-response trials.
const block_duration = 25 * 1000; // shorter duration for testing
var probability_ship = [[1],[1],[1]]; //how likely is there to be a ship for each planet, [1,1,1] means 100% of clicks will result in a ship.

// Global Variables Definition
let block_number = 0;
let trial_number = 0;
let points = 0;
const iti = 1000;
const inf_stim_height = 80;
const inf_slider_width = 500;
const main_stim_height = 250;
const feedback_duration = 2500;
const rf_ship_delay = 1500;

const reset_planet_wait_const = 1000;
const ship_attack_time_const = 6000;
const shield_charging_time_const = (ship_attack_time_const / 2);
const nBlocks_p1 = 1;
let nBlocks_p2 = 1;
let nBlocks_p3 = 1;
let planet_labels = ['Planet A','Planet B','Planet C'];



//ship attack variable labels
const win_100_text = "<img src='./img/win_100_text.png'>";
const ship_outcome_1_unshielded = "<img src='./img/ship_outcome_1_unshielded.png' height='31px'>";
const ship_outcome_2_unshielded = "<img src='./img/ship_outcome_2_unshielded.png' height='31px'>";
const ship_outcome_3_unshielded = "<img src='./img/ship_outcome_3_unshielded.png' height='32px'>";
const ship_outcome_3_shielded = "<img src='./img/ship_outcome_3_shielded.png' height='84px'>";
// const ship_outcome_3_shielded = "<img src='./img/ship_outcome_3_shielded_alt.png' height='84px'>";

// // manipulate response-ship Rft rate
// if (group[0].includes("0.1")) {
//   var probability_ship = [[0.1],[0.1],[0.1]]; 
// } else if (group[0].includes("0.4")) {
//   var probability_ship = [[0.4],[0.4],[0.4]];
// } else (console.error("ERROR: group is not defined as 0.1 or 0.4"))

// // manipulate early/late instruction by block sizes of phase 2/3
// if (group[0].includes("early")) {
//   nBlocks_p2 = 2;
//   nBlocks_p3 = 3;
// } else if (group[0].includes("late")) {
//   nBlocks_p2 = 3;
//   nBlocks_p3 = 4;
// } else (console.log("ERROR: group is not defined as early or late"))


// var probability_ship = probability_ship;
//Continious or discreete testing phases
let continuousResp = true;
let nTrialspBlk = 5; //if continuousResp is true though, this doesnt matter
if (continuousResp){
    let nTrialspBlk = 1;
}

//----------------------------------------------------------------------------
/* functions */

// Define a function to add blocks to the timeline
function addBlocksToTimeline(timeline, blockConfig, nBlocks, nTrialsPerBlock) {
  for (let i = 0; i < nBlocks; i++) {
    let block = {
      timeline: [blockConfig],
      repetitions: nTrialsPerBlock,
      data: {
          phase: 'phase1'
      }
    };
    console.log(block);
    timeline.push(block);
  }
}

  // force full screen
  let fullscreen = {
      type: 'fullscreen',
      fullscreen_mode: true
    };

//----------------------------------------------------------------------------
// ----- Participant instructions -----

// Define instruction check block

let instructionCheckWithFeedback = {
  type: 'survey-multi-catch',
  instructions: [pretrain1, pretrain2, pretrain3],
  questions: questions.map(q => ({
    prompt: q.prompt,
    options: q.options,
    required: true
  })),
  correct_answers: questions.reduce((obj, q, index) => {
    obj[`Q${index}`] = q.correct;
    return obj;
  }, {})
};

//----------------------------------------------------------------------------
// ----- Phase 1 -----

// define task blocks with no ships
let planet_noship = {
  type: 'planet-response-command',
  show_ship: false,
  ship_hostile_idx: planet_side,
  prompt: planet_labels,
  stimulus: stim_list,
  stimulus_select: stim_selector_highlight,
  ship_stimulus: ship_list,              
  reset_planet_wait: reset_planet_wait_const,
  shield_charging_time: shield_charging_time_const,
  ship_attack_time: ship_attack_time_const,
  ship_attack_damage: ship_attack_damage,
  block_duration: block_duration,
  data: {
    phase: 'phase1',
    block_type: 'planet_noship'
  },
  on_start: function(trial) {
    trial.data.points = points;
    trial.data.block_number = block_number;
    trial.data.trial_number = trial_number;
  },
  on_finish: function(data){
    points = data.points_total;
    trial_number = data.trial_number;
    trial_number++;
    // Script for continuous response block
    if (continuousResp) {
      jsPsych.endCurrentTimeline();
      block_number = data.block_number;
      block_number++;
      console.log('Block ' + block_number);
    } else {
      if (trial_number >= nTrialspBlk) {
        trial_number = 0;
        block_number = data.block_number;
        block_number++;
        console.log('Block ' + block_number);
      }
    }
  }
};



//----------------------------------------------------------------------------
// ----- Phase 1  valance and inference checks-----

    // valence check
      const valence_q = `How do you feel about each of these game elements: `;
  
      // phase 1, winning $100 image/text
      var inf_img_p1_winning100 = [
        {
          stimulus: 'img/win100.png',
          text: "Winning $100"
        }
      ];
  
      // // phase 1, winning $100 image/text make this loosing
      // var inf_img_p1_winning100 = [
      //   {
      //     stimulus: 'img/win100.png',
      //     text: "Winning $100"
      //   }
      // ];
  
  
    //* inference and valence checks end *-----------------

    // Inference and valence checks end

var i = 1;

// Define ship outcome variables



const valence_p1 = {
  type: 'valence-check',
  prompt: valence_q,
  stimuli_and_text: [
    ['img/win100.png', 'Winning $100'],
    [stim_list[0], 'Planet A (left)'],
    [stim_list[1], 'Planet B (middle)'],
    [stim_list[2], 'Planet C (right)']
  ],
  labels: valence_labels,
  button_label: 'Continue',
  stimulus_height: inf_stim_height,
  slider_width: inf_slider_width,
  require_movement: false,
  data: {
    phase: 'val_check_5',
    block_number: i
  }
};



let blockNumber = 1;


        //p1 (planet A)
        var infer_p1_A = {
          type: 'inference-check',
          main_stimulus: stim_list[0],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[0],
          stimuli_and_text: [
            [inf_img_p1_winning100[0].stimulus, inf_img_p1_winning100[0].text]
          ],
          slider_text_top: contingency_q[0],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_1_A',
            block_number: i
          }
        };

        // inference check p1 (planet B)
        var infer_p1_B = {
          type: 'inference-check',
          main_stimulus: stim_list[1],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[1],
          stimuli_and_text: [
            [inf_img_p1_winning100[0].stimulus, inf_img_p1_winning100[0].text]
          ],
          slider_text_top: contingency_q[1],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_1_B',
            block_number: i
          }
        };


        // inference check p1 (planet C)
        var infer_p1_C = {
          type: 'inference-check',
          main_stimulus: stim_list[2],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[2],
          stimuli_and_text: [
            [inf_img_p1_winning100[0].stimulus, inf_img_p1_winning100[0].text]
          ],
          slider_text_top: contingency_q[2],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_1_C',
            block_number: i
          }
        };


   //* inference and valence checks end *-----------------
    
      //NEW: slider response Qs - images
      var slider_img_left = [{
        stimulus: stim_list[0],
        text: "Planet A (left)"
      }]
    
      var slider_img_right = [{
        stimulus: stim_list[1],
        text: "Planet B (right)"
      }]


//////////////////////

// define phase 2 instructions
var phaseTwoInstructions = {
  type: 'instructions',
  pages: [
    phase2_instructions
    ],
  allow_keys: false,
  show_clickable_nav: true,
  post_trial_gap: iti,
  data: {
    phase: 'instructions'
  }
};

//----------------------------------------------------------------------------
// ----- Phase 2 -----

// define task blocks with ships
let planet_ship = {
  type: 'planet-response-command',
  show_ship: true,
  ship_hostile_idx: planet_side,
  prompt: planet_labels,
  stimulus: stim_list,
  stimulus_select: stim_selector_highlight,
  ship_stimulus: ship_list,              
  reset_planet_wait: reset_planet_wait_const,
  shield_charging_time: shield_charging_time_const,
  ship_attack_time: ship_attack_time_const,
  ship_attack_damage: ship_attack_damage,
  block_duration: block_duration,
  probability_trade: probability_trade,
  probability_ship: probability_ship,
  probability_shield: probability_shield,
  ship_outcome_1_unshielded: ship_outcome_1_unshielded,
  ship_outcome_2_unshielded: ship_outcome_2_unshielded,
  ship_outcome_3_unshielded: ship_outcome_3_unshielded,
  ship_outcome_3_shielded: ship_outcome_3_shielded,
  win_100_text: win_100_text,
  data: {
      phase: 'phase2',
      block_type: 'planet_ship'
  },
  on_start: function(trial) {
      trial.data.points = points;
      trial.data.block_number = block_number;
      trial.data.trial_number = trial_number;
  },
  on_finish: function(data){
      points = data.points_total;
      trial_number = data.trial_number;
      trial_number++;
      // script for continuous response block
      if (continuousResp) {
          jsPsych.endCurrentTimeline();
          block_number = data.block_number;
          block_number++
          console.log('Block ' + block_number)
      } else {
          if (trial_number >= nTrialspBlk) {
              trial_number = 0
              block_number = data.block_number;
              block_number++
              console.log('Block ' + block_number)
          }
      }
  }
}

//----------------------------------------------------------------------------
// ----- Phase 2 valance and inference-----

//p2 valance 8 items
  const val_img_p2 = [
    {
      stimulus: 'img/win100.png',
      text: "Winning $100"
    },
    {
      stimulus: 'img/lose.png',
      text: "Losing $"
    },
    {
      stimulus: stim_list[0],
      text: "Planet A (left)"
    },
    {
      stimulus: stim_list[1],
      text: "Planet B (middle)"
    },
    {
      stimulus: stim_list[2],
      text: "Planet C (right)"
    },
    {
      stimulus: 'img/ship1.png',
      text: "Ship 1"
    },
    {
      stimulus: 'img/ship2.png',
      text: "Ship 2"
    }
    ,
    {
      stimulus: 'img/ship3.png',
      text: "Ship 3"
    }
    ];


      // phase 2, planet A
      var inf_img_p2_A = [
        {
          stimulus: 'img/win100.png',
          text: "Winning $100"
        },
        {
          stimulus: 'img/lose.png',
          text: "Losing $"
        },
        {
          stimulus: ship_list[0],
          text: "Ship 1"
        },
        {
          stimulus: ship_list[1],
          text: "Ship 2"
        },
        {
          stimulus: ship_list[2],
          text: "Ship 3"
        },
      ];


        // value check p2
        var valence_p2 = {
          type: 'valence-check',
          prompt: valence_q,
          stimuli_and_text: [
            [win_100_text, null],
            [ship_outcome_1_unshielded, null],
            [ship_outcome_2_unshielded, null],
            [val_img_p2[2].stimulus, val_img_p2[2].text],
            [val_img_p2[3].stimulus, val_img_p2[3].text],
            [val_img_p2[4].stimulus, val_img_p2[4].text],
            [val_img_p2[5].stimulus, val_img_p2[5].text],
            [val_img_p2[6].stimulus, val_img_p2[6].text],
            [val_img_p2[7].stimulus, val_img_p2[7].text]
          ],
          labels: valence_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'val_check_2',
            block_number: i + nBlocks_p1
          }
        };

        var infer_p2_A = {
          type: 'inference-check',
          main_stimulus: stim_list[0],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[0],
          stimuli_and_text: [
            [win_100_text, ''],
            [ship_outcome_1_unshielded, ''],
            [ship_outcome_2_unshielded, ''],
            [val_img_p2[5].stimulus, inf_img_p2_A[2].text],
            [val_img_p2[6].stimulus, inf_img_p2_A[3].text],
            [val_img_p2[7].stimulus, inf_img_p2_A[4].text],
          ],
          slider_text_top: contingency_q[0],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_A',
            block_number: i + nBlocks_p1
          }
        };
        var infer_p2_B = {
          type: 'inference-check',
          main_stimulus: stim_list[1],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[1],
          stimuli_and_text: [
            [win_100_text, ''],
            [ship_outcome_1_unshielded, ''],
            [ship_outcome_2_unshielded, ''],
            [val_img_p2[5].stimulus,inf_img_p2_A[2].text,],
            [val_img_p2[6].stimulus,inf_img_p2_A[3].text,],
            [val_img_p2[7].stimulus,inf_img_p2_A[4].text,]
          ],
          slider_text_top: contingency_q[1],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_B',
            block_number: i + nBlocks_p1
          }
        };
        
        var infer_p2_C = {
          type: 'inference-check',
          main_stimulus: stim_list[2],
          main_stimulus_height: main_stim_height,
          prompt: inference_prompt[2],
          stimuli_and_text: [
            [win_100_text,''],
            [ship_outcome_1_unshielded,''],
            [ship_outcome_2_unshielded,''],
            [inf_img_p2_A[2].stimulus,inf_img_p2_A[2].text],
            [inf_img_p2_A[3].stimulus,inf_img_p2_A[3].text],
            [inf_img_p2_A[4].stimulus,inf_img_p2_A[4].text]
          ],
          slider_text_top: contingency_q[2],
          labels_top: contingency_labels,
          stimulus_height: inf_stim_height,
          slider_width: inf_slider_width,
          require_movement: false,
          data: {
            phase: 'inf_check_2_C',
            block_number: i + nBlocks_p1
          }
        };
    // inference check p2 (ship 1)
var infer_p2_ship1 = {
  type: 'inference-check',
  main_stimulus: 'img/ship1.png',
  main_stimulus_height: main_stim_height,
  prompt: inference_prompt[3],
  stimuli_and_text: [
    [ship_outcome_1_unshielded, ''],
    [ship_outcome_2_unshielded, '']
  ],
  slider_text_top: contingency_q[3],
  slider_text_bottom: contingency_q[4],
  labels_top: contingency_labels,
  labels_bottom: contingency_labels,
  stimulus_height: inf_stim_height,
  slider_width: inf_slider_width,
  require_movement: false,
  data: {
    phase: 'inf_check_2_ship1',
    block_number: i + nBlocks_p1
  }
};

// inference check p2 (ship 2)
var infer_p2_ship2 = {
  type: 'inference-check',
  main_stimulus: 'img/ship2.png',
  main_stimulus_height: main_stim_height,
  prompt: inference_prompt[4],
  stimuli_and_text: [
    [ship_outcome_1_unshielded,''],
    [ship_outcome_2_unshielded,'']
  ],
  slider_text_top: contingency_q[4],
  slider_text_bottom: contingency_q[5],
  labels_top: contingency_labels,
  labels_bottom: contingency_labels,
  stimulus_height: inf_stim_height,
  slider_width: inf_slider_width,
  require_movement: false,
  data: {
    phase: 'inf_check_2_ship2',
    block_number: i + nBlocks_p1
  }
};

// inference check p2 (ship 3)
var infer_p2_ship3 = {
  type: 'inference-check',
  main_stimulus: 'img/ship3.png',
  main_stimulus_height: main_stim_height,
  prompt: inference_prompt[5],
  stimuli_and_text: [
    [ship_outcome_1_unshielded,''],
    [ship_outcome_2_unshielded,'']
  ],
  slider_text_top: contingency_q[5],
  slider_text_bottom: contingency_q[6],
  labels_top: contingency_labels,
  labels_bottom: contingency_labels,
  stimulus_height: inf_stim_height,
  slider_width: inf_slider_width,
  require_movement: false,
  data: {
    phase: 'inf_check_2_ship3',
    block_number: i + nBlocks_p1
  }
};
// NEW: slider questions p2
// NEW: define slider Qs variables
var left_label = "";
var right_label = "";

// Question 3
var p1_q3_triangle = {
  type: 'html-slider-triangle',
  prompt: "Reflecting back on what you did in the <b>most recent block</b>, <p>what proportion of your recent interactions were with each planet:",
  stimulus_all: stim_list,
  planetColors: planetColors,
  stimulus_height: 250,
  slider_width: 900,
  labels: ["100%/0%/0%<p>(only click Planet A)</p>", "66%/33%/0%", "50%/50%/0%<p>(click all equally)</p>", "33%/66%/0%", "0%/100%/0%<p>(only click Planet B)</p>", "0%/0%/100%<p>(only click Planet C)</p>"],
  require_movement: false,
  data: {
    phase: 'slider-response_p1_q3',
    block_number: i + nBlocks_p1,
  }
};

// Question 4
var p1_q4_triangle = {
  type: 'html-slider-triangle',
  prompt: "To maximise your points in the <b>previous block</b>, <p>what proportion of interactions would you allocate for each planet?",
  stimulus_all: stim_list,
  planetColors: planetColors,
  stimulus_height: 250,
  slider_width: 900, // Increased width to accommodate more space for labels
  labels: ["100%/0%/0%<p>(only click Planet A)</p>", "66%/33%/0%", "50%/50%/0%<p>(click all equally)</p>", "33%/66%/0%", "0%/100%/0%<p>(only click Planet B)</p>", "0%/0%/100%<p>(only click Planet C)</p>"],
  require_movement: false,
  data: {
    phase: 'slider-response_p1_q4',
    block_number: i + nBlocks_p1,
  }
};

// Question 3
var p2_q3_triangle = {
  type: 'html-slider-triangle',
  prompt: "Reflecting back on what you did in the <b>most recent block</b>, <p>what proportion of your recent interactions were with each planet:",
  stimulus_left: stim_list[0],
  stimulus_right: stim_list[1],
  stimulus_top: stim_list[2],
  stimulus_height: 250,
  slider_width: 900, // Increased width to accommodate more space for labels
  labels: ["100%/0%/0%<p>(only click Planet A)</p>", "66%/33%/0%", "50%/50%/0%<p>(click all equally)</p>", "33%/66%/0%", "0%/100%/0%<p>(only click Planet B)</p>", "0%/0%/100%<p>(only click Planet C)</p>"],
  require_movement: false,
  data: {
    phase: 'slider-response_p2_q3',
    block_number: i + nBlocks_p1,
  }
};

// Question 4
var p2_q4_triangle = {
  type: 'html-slider-triangle',
  prompt: "To maximise your points in the <b>previous block</b>, <p>what proportion of interactions would you allocate for each planet?",
  stimulus_left: stim_list[0],
  stimulus_right: stim_list[1],
  stimulus_top: stim_list[2],
  stimulus_height: 250,
  slider_width: 900, // Increased width to accommodate more space for labels
  labels: ["100%/0%/0%<p>(only click Planet A)</p>", "66%/33%/0%", "50%/50%/0%<p>(click all equally)</p>", "33%/66%/0%", "0%/100%/0%<p>(only click Planet B)</p>", "0%/0%/100%<p>(only click Planet C)</p>"],
  require_movement: false,
  data: {
    phase: 'slider-response_p2_q4',
    block_number: i + nBlocks_p1,
  }
};


//----------------------------------------------------------------------------
// --- Phase 3

var contingenciescorrect = false;

var cont_catch = {
  
  type: 'survey-multi-catch-image',
  
  // Array of HTML strings representing the content for each instruction page
  pages: [
    '<p>Local intel has determined where the pirates are coming from!<br>Click Next to view this intel.</p>',
    `
      <div style="display: flex; flex-direction: column;">
        <div style="display: grid; grid-template-columns: 1fr; grid-gap: 20px;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <p>Your signals to the left planet have been attracting neutral ships.</p>
            <div style="display: flex; flex-direction: row; align-items: center;">
              <img src="${stim_list[0]}" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <p>Planet A:</p>
              <img src="img/arrow.jpg" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <img src="${ship_list[0]}" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <p>Your signals to the middle planet have been attracting pirate ships, that have been stealing <b>lots of</b> your points!</p>
            <div style="display: flex; flex-direction: row; align-items: center;">
              <img src="${stim_list[1]}" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <p>Planet B:</p>
              <img src="img/arrow.jpg" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <img src="${ship_list[1]}" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <img src="img/arrow.jpg" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <div style="margin-top: 5px;">${ship_outcome_1_unshielded}</div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <p>Your signals to the right planet have been attracting pirate ships, that have been stealing <b>some of</b> of your points!</p>
            <div style="display: flex; flex-direction: row; align-items: center;">
              <img src="${stim_list[2]}" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <p>Planet C:</p>
              <img src="img/arrow.jpg" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <img src="${ship_list[2]}" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <img src="img/arrow.jpg" style="width: 100px; height: 100px; object-fit: contain; margin-right: 10px;">
              <div style="margin-top: 5px;">${ship_outcome_2_unshielded}</div>
            </div>
          </div>
        </div>
      </div>
    `,
    // Keep the third page content unchanged
  ],

  
  // Array of HTML strings representing the question prompts
  question_prompts: [
    `Which planet leads to this attack? ${ship_outcome_1_unshielded}`,
    `Which ship leads to this attack? ${ship_outcome_1_unshielded}`,
    `Which planet leads to this attack? ${ship_outcome_2_unshielded}`,
    `Which ship leads to this attack?  ${ship_outcome_2_unshielded}`,
  ],
  planet_options: stim_list_original,
  ship_option_1: ship_list_original[0],
  ship_option_2: ship_list_original[1],
  ship_option_3: ship_list_original[2],
  correct_answers: [
    stim_list[1],
    ship_list[1],
    stim_list[2], 
    ship_list[2] 
  ],
  
  // Object representing the mapping between ships and planets
  ship_planet_mapping: {
    'img/ship1.png': 'Planet B',
    'img/ship2.png': 'Planet C'
  },
  
  // HTML-formatted string representing the text for winning 100 points
  win_text: win_100_text,
  
  // HTML-formatted string representing the first attack text
  attack_text_1: ship_outcome_1_unshielded,

  // HTML-formatted string representing the second attack text
  attack_text_2: ship_outcome_2_unshielded,
  
  // Array of integers representing the attack damage for each ship
  ship_attack_damage: ship_attack_damage,
  
  // HTML-formatted string containing the instructions to display when an incorrect answer is given
  instructions: '<p>Your answer is incorrect. Please review the information provided and try again.</p>',
  
  // Boolean indicating whether to display "Previous" and "Next" buttons for navigation
  show_clickable_nav: true,
  
  // The label for the "Previous" button
  button_label_previous: 'Back',
  
  // The label for the "Next" button
  button_label_next: 'Next',
  
  // Boolean indicating whether to disable keyboard navigation
  allow_keys: false,
  
  // Custom callback function that is called when the trial finishes
  on_finish: function(data) {
    data.contingencies_correct = data.contingencies_correct;
    data.responses = JSON.stringify(data.responses);
  },
  
  // Object to store any additional data associated with the trial
  data: {
    phase: 'contingency quiz'
  },
  
  // Custom callback function that is called when the trial loads
  on_load: function() {
    // Add custom CSS for styling
    var style = document.createElement('style');
    style.innerHTML = `
      .jspsych-instructions-advanced-container {
        display: flex;
        flex-direction: column;
      }
      .jspsych-instructions-advanced-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .jspsych-instructions-advanced-cell {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .jspsych-instructions-advanced-image {
        width: 100px;
        height: 100px;
        object-fit: contain;
        margin-right: 10px;
      }
      .jspsych-instructions-advanced-text {
        display: flex;
        flex-direction: column;
        margin-right: 10px;
      }
      .jspsych-instructions-advanced-outcome {
        margin-top: 5px;
      }
      .jspsych-survey-multi-catch-options {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 20px;
      }
      .option-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 10px;
      }
      .option-image {
        width: 100px;
        height: 100px;
        object-fit: contain;
        margin-bottom: 5px;
      }
    `;
    document.head.appendChild(style);
  }
};


//----------------------------------------------------------------------------
// --- Debrief and experiment end

// debrief
var debrief_block = {
  type: 'instructions',
  pages: [
    debrief
    ],
  button_label_next: "I acknowledge that I have received this debriefing information",
  show_clickable_nav: true,
  post_trial_gap: iti,
  data: {
    phase: 'debrief'
  }

};

var contact_block = {
  type: 'survey-text',
  questions: [
    {
      prompt: contact,
      rows: 2,
      columns: 80
    }
  ],
  data: {
    phase: 'contact'
  }
};

var exit_experiment = {
  type: 'instructions',
  pages: [
    'The experiment has concluded.'
  ]
};
//


//CFI

var cfi_catch_flag = false;

var cfi_block = {
  type: 'survey-likert-catch',
  preamble: cfi.prompt,
  catch_handling: "abort",
  questions: [
    {prompt: cfi.items[0], name: 'item1', labels: cfi.labels, required: true},
    {prompt: cfi.items[1], name: 'item2', labels: cfi.labels, required: true},
    {prompt: cfi.items[2], name: 'item3', labels: cfi.labels, required: true},
    {prompt: cfi.items[3], name: 'item4', labels: cfi.labels, required: true},
    {prompt: cfi.items[4], name: 'item5', labels: cfi.labels, required: true},
    {prompt: cfi.items[5], name: 'item6', labels: cfi.labels, required: true},
    {prompt: cfi.items[6], name: 'catch', labels: cfi.labels, required: true, catch: true, catch_response: 0},
    {prompt: cfi.items[7], name: 'item7', labels: cfi.labels, required: true},
    {prompt: cfi.items[8], name: 'item8', labels: cfi.labels, required: true},
    {prompt: cfi.items[9], name: 'item9', labels: cfi.labels, required: true},
    {prompt: cfi.items[10], name: 'item10', labels: cfi.labels, required: true},
    {prompt: cfi.items[11], name: 'item11', labels: cfi.labels, required: true},
    {prompt: cfi.items[12], name: 'item12', labels: cfi.labels, required: true},
    {prompt: cfi.items[13], name: 'item13', labels: cfi.labels, required: true},
    {prompt: cfi.items[14], name: 'item14', labels: cfi.labels, required: true},
    {prompt: cfi.items[15], name: 'item15', labels: cfi.labels, required: true},
    {prompt: cfi.items[16], name: 'item16', labels: cfi.labels, required: true},
    {prompt: cfi.items[17], name: 'item17', labels: cfi.labels, required: true},
    {prompt: cfi.items[18], name: 'item18', labels: cfi.labels, required: true},
    {prompt: cfi.items[19], name: 'item19', labels: cfi.labels, required: true},
    {prompt: cfi.items[20], name: 'item20', labels: cfi.labels, required: true}
  ],
  scale_width: inf_slider_width,
  post_trial_gap: iti,
  data: {
    phase: 'ques_cfi'
  },
  on_finish: function(data) {
    console.log(data.responses); //can delete afterwards
    var obj_cfi = JSON.parse(data.responses);
    console.log(obj_cfi); //can delete afterwards
    console.log(data.catch_failed); //can delete afterwards
    cfi_catch_flag = data.catch_failed;
    console.log(cfi_catch_flag); //can delete afterwards
  }
};


var htq_block = {
  type: 'survey-likert-catch',
  preamble: htq.prompt,
  questions: [
    {prompt: htq.items[0], name: 'item1', labels: htq.labels, required: true},
    {prompt: htq.items[1], name: 'item2', labels: htq.labels, required: true},
    {prompt: htq.items[2], name: 'item3', labels: htq.labels, required: true},
    {prompt: htq.items[3], name: 'item4', labels: htq.labels, required: true},
    {prompt: htq.items[4], name: 'item5', labels: htq.labels, required: true},
    {prompt: htq.items[5], name: 'item6', labels: htq.labels, required: true},
    {prompt: htq.items[6], name: 'item7', labels: htq.labels, required: true},
    {prompt: htq.items[7], name: 'item8', labels: htq.labels, required: true},
    {prompt: htq.items[8], name: 'item9', labels: htq.labels, required: true},
    {prompt: htq.items[9], name: 'item10', labels: htq.labels, required: true},
    {prompt: htq.items[10], name: 'item11', labels: htq.labels, required: true}
  ],
  scale_width: inf_slider_width,
  post_trial_gap: iti,
  data: {
    phase: 'ques_htq'
  }
};

var audit_catch_flag = false;

var audit_block = {
  type: 'survey-likert-catch',
  catch_handling: "abort",
  preamble: audit.prompt,
  questions: [
    {prompt: audit.items[0], name: 'item1', labels: audit.labels1, required: true},
    {prompt: audit.items[1], name: 'item2', labels: audit.labels2, required: true},
    {prompt: audit.items[2], name: 'item3', labels: audit.labels3_9, required: true},
    {prompt: audit.items[3], name: 'item4', labels: audit.labels3_9, required: true},
    {prompt: audit.items[4], name: 'item5', labels: audit.labels3_9, required: true},
    {prompt: audit.items[5], name: 'item6', labels: audit.labels3_9, required: true},
    {prompt: audit.items[6], name: 'catch', labels: audit.labels3_9, required: true, catch: true, catch_response: 3},
    {prompt: audit.items[7], name: 'item7', labels: audit.labels3_9, required: true},
    {prompt: audit.items[8], name: 'item8', labels: audit.labels3_9, required: true},
    {prompt: audit.items[9], name: 'item9', labels: audit.labels10_11, required: true},
    {prompt: audit.items[10], name: 'item10', labels: audit.labels10_11, required: true}
  ],
  scale_width: inf_slider_width,
  post_trial_gap: iti,
  data: {
    phase: 'ques_audit'
  },
  on_finish: function(data) {
    console.log(data.responses); //can delete afterwards
    var obj_audit = JSON.parse(data.responses);
    console.log(obj_audit); //can delete afterwards
    console.log(data.catch_failed); //can delete afterwards
    audit_catch_flag = data.catch_failed;
    console.log(audit_catch_flag); //can delete afterwards
    catchcorrect = !cfi_catch_flag && !audit_catch_flag;
    console.log(catchcorrect); //can delete afterwards
  }
};




//TODO: cont instructions, 3 triangle for q1/q2 replacement, UI updates


var contingency_catch = {
  type: 'survey-multi-catch-image',
  preamble: '<h2>Catch Questions</h2>',
  questions: [
    {
      prompt: "What is the correct answer to question 1?",
      options: ["Option A", "Option B", "Option C"],
      required: true,
      name: 'Q1'
    },
    {
      prompt: "What is the correct answer to question 2?",
      options: ["Option X", "Option Y", "Option Z"],
      required: true,
      name: 'Q2'
    }
  ],
  correct_answers: {
    'Q1': 'Option B',
    'Q2': 'Option Y'
  },
  instructions: '<p>Please review the instructions and try again.</p>',
  max_attempts: 2,
  images: ['image1.jpg', 'image2.jpg']
};


// ---- Timeline creation ----
let timeline = []; // This is the master timeline, the experiment runs sequentially based on the objects pushed into this array.


// // Induction
// timeline.push(fullscreen);
// timeline.push(consent_block);
// timeline.push(demographics_block);
// timeline.push(instructionCheckWithFeedback);

// // Attention check
// timeline.push(cfi_block);
// timeline.push(htq_block);
// timeline.push(audit_block);

// // Phase 1, no ships
// addBlocksToTimeline(timeline, planet_noship, nBlocks_p1, nTrialspBlk);
// timeline.push(valence_p1);
// timeline.push(infer_p1_A);
// timeline.push(infer_p1_B);
// timeline.push(infer_p1_C);

// timeline.push(p1_q3_triangle);
// timeline.push(p1_q4_triangle);


// // Phase2, ships
// timeline.push(phaseTwoInstructions);
addBlocksToTimeline(timeline, planet_ship, nBlocks_p2, nTrialspBlk);
// timeline.push(valence_p2);
// timeline.push(infer_p2_A);
// timeline.push(infer_p2_B);
// timeline.push(infer_p2_C);
// timeline.push(infer_p2_ship1);
// timeline.push(infer_p2_ship2);
// timeline.push(infer_p2_ship3);
// timeline.push(p1_q3_triangle);
// timeline.push(p1_q4_triangle);

// Phase3, contingencies
// timeline.push(cont_catch);

// Phase3, ships
// addBlocksToTimeline(timeline, planet_ship, nBlocks_p3, nTrialspBlk);
// timeline.push(valence_p2);
// timeline.push(infer_p2_A);
// timeline.push(infer_p2_B);
// timeline.push(infer_p2_C);
// timeline.push(p1_q3_triangle);
// timeline.push(p1_q4_triangle);


//Debrief
// timeline.push(debrief_block);

//Disabled blocks
//timeline.push(contact_block); // disabled

//Exit experiment (uncomment to hide JSON data at program end)
// timeline.push(exit_experiment);

// Run the experiment
{
  let subject_id = jsPsych.data.getURLVariable('Subject_id');
  if (subject_id === undefined) {
    subject_id = null;
  }

  jsPsych.data.addProperties({
    subject_id: subject_id,
    group: group,
    sample: sample,
    planet_side: planet_side,
    pun_planet: stim_list[planet_side],
    pun_ship: ship_list[planet_side],
  });

  
  jsPsych.init({
    timeline: timeline,
    preload_images: images,
    on_finish: function() {
      jsPsych.data.displayData();
    }
  });
} 