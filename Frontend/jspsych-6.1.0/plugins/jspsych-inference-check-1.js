/**
 * jspsych-inference-check-1
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

 // Modified by JL (2020)
 // Inference check for 1 stimulus (contingency and confidence ratings)


jsPsych.plugins['inference-check-1'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('inference-check-1', 'stimulus', 'image');

  plugin.info = {
    name: 'inference-check-1',
    description: '',
    parameters: {
      main_stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Main stimulus',
        default: undefined,
        description: 'The large image to be displayed'
      },
      main_stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Main image height',
        default: null,
        description: 'Set the main image height in pixels'
      },
      main_stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Main image width',
        default: null,
        description: 'Set the main image width in pixels'
      },
      stimulus_1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus 1',
        default: undefined,
        description: 'The first image to be displayed'
      },
      stim_text_1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus text 1',
        default: null,
        description: 'Any content here will be displayed with stimulus 1.'
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
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Slider starting value',
				default: 50,
				description: 'Sets the starting value of the slider',
			},
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      slider_text_top: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Top slider text',
        default: null,
        description: 'Any content here will be displayed with the top slider.'
      },
      slider_text_bottom: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Bottom slider text',
        default: null,
        description: 'Any content here will be displayed with the bottom slider.'
      },
      labels_top: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the top slider.',
      },
      labels_bottom: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the bottom slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name:'Slider width',
        default: null,
        description: 'Width of the slider in pixels.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed at the top of the screen.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '<div id="jspsych-inference-check-1-wrapper" style="margin: 100px 0px;">';

    // main stimulus
    html += '<div id="jspsych-inference-check-1-stimulus">';
    html += '<img src="'+trial.main_stimulus+'" style="';
    if(trial.main_stimulus_height !== null){
      html += 'height:'+trial.main_stimulus_height+'px; '
      if(trial.main_stimulus_width == null && trial.maintain_aspect_ratio){
        html += 'width: auto; ';
      }
    }
    if(trial.main_stimulus_width !== null){
      html += 'width:'+trial.main_stimulus_width+'px; '
      if(trial.main_stimulus_height == null && trial.maintain_aspect_ratio){
        html += 'height: auto; ';
      }
    }

    html += '"></img>';
    html += '</div>';

    // prompt
    if (trial.prompt !== null){
      html += trial.prompt + '<br><br><br><br>';
    }

    // -------------------------------- image 1 --------------------------------

    html += '<div id="jspsych-inference-check-1-stimulus">';
    html += '<img src="'+trial.stimulus_1+'" style="';
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

    html += '"></img>';
    html += '</div>';

    // stimulus text
    if (trial.stim_text_1 !== null){
      html += trial.stim_text_1;
    }
    html += '<br><br>';

    // ------------------------------ top slider -------------------------------

    // slider question
    if (trial.slider_text_top !== null){
      html += trial.slider_text_top;
    }

    // slider
    html += '<div class="jspsych-inference-check-1-container" style="position:relative; margin: 0 auto 3em auto; ';
    if(trial.slider_width !== null){
      html += 'width:'+trial.slider_width+'px;';
    }
    html += '">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-inference-check-1-response"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels_top.length; j++){
      var width = 100/(trial.labels_top.length-1);
      var left_offset = (j * (100 /(trial.labels_top.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels_top[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // ----------------------------- bottom slider -----------------------------

    // slider question
    //if (trial.slider_text_bottom !== null){
      //html += trial.slider_text_bottom;
    //}

    // slider
    //html += '<div class="jspsych-inference-check-1-container" style="position:relative; margin: 0 auto 3em auto; ';
    //if(trial.slider_width !== null){
      //html += 'width:'+trial.slider_width+'px;';
    //}
    //html += '">';
    //html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-inference-check-1-response2"></input>';
    //html += '<div>'
    //for(var j=0; j < trial.labels_bottom.length; j++){
      //var width = 100/(trial.labels_bottom.length-1);
      //var left_offset = (j * (100 /(trial.labels_bottom.length - 1))) - (width/2);
     //html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      //html += '<span style="text-align: center; font-size: 80%;">'+trial.labels_bottom[j]+'</span>';
      //html += '</div>'
    //}
    //html += '</div>';
    //html += '</div>';
    //html += '</div>';
    //html += '<br><br>';

    // -------------------------------------------------------------------------

    // add submit button
    html += '<button id="jspsych-inference-check-1-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    var response = {
      rt: null,
      rate_1: null
      //conf_1: null
    };

    if(trial.require_movement){
      display_element.querySelector('#jspsych-inference-check-1-response').addEventListener('change', function(){
      display_element.querySelector('#jspsych-inference-check-1-next').disabled = false;
      })
    }

    display_element.querySelector('#jspsych-inference-check-1-next').addEventListener('click', function() {
      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.response = display_element.querySelector('#jspsych-inference-check-1-response').value;
      // response.response2 = display_element.querySelector('#jspsych-inference-check-1-response2').value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-inference-check-1-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "rate_1": response.response,
        //"conf_1": response.response2
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-inference-check-1-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = performance.now();
  };

  return plugin;
})();
