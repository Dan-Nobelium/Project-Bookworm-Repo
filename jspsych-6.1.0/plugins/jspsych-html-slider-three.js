/**
 * jspsych-html-slider-response
 * a jspsych plugin for free response survey questions
 *
 * original author: Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

 // Modified by LZ (2023)
 // Slider questions presented at the end of each experimental phase

 jsPsych.plugins['html-slider-response-three'] = (function() {

    var plugin = {};
  
    jsPsych.pluginAPI.registerPreload('html-slider-response-three', 'stimulus', 'image');
  
    plugin.info = {
      name: 'html-slider-response-three',
      description: '',
      parameters: {
        left_stimulus: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'left stimulus',
          default: undefined,
          description: 'Stimulus image on LHS'
        },
        right_stimulus: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'right stimulus',
          default: undefined,
          description: 'Stimulus image on RHS'
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
        labels: {
          type: jsPsych.plugins.parameterType.HTML_STRING,
          pretty_name:'Labels',
          default: [],
          array: true,
          description: 'Labels of the slider.',
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
          default: true,
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
  
      var html = '<div id="jspsych-html-slider-response-wrapper" style="margin: 100px 0px;">';
  
      // prompt
      if (trial.prompt !== null){
        html += trial.prompt + '<br><br><br><br>';
      }
  
      // -------------------------------- stimulus --------------------------------
      // left stimulus
      html += '<div id="jspsych-html-slider-response-left-stimulus" style="float:left;">';
      html += '<img src="'+trial.left_stimulus+'" style="';
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
      html += '<div style="margin-top: 5px;">'+trial.left_stim_text+'</div>';
      html += '</div>';

      // right stimulus
      html += '<div id="jspsych-html-slider-response-right-stimulus" style="float:right;">';
      html += '<img src="'+trial.right_stimulus+'" style="';
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
      html += '<div style="margin-top: 5px;">'+trial.right_stim_text+'</div>';
      html += '</div>';

      // text_stim_left
      // if (trial.left_stim_text !== null){
      //  html += trial.left_stim_text;
      // }
      // html += '<br><br>';

      // text_stim_right
      // if (trial.right_stim_text !== null){
      //   html += trial.right_stim_text;
      // }
      // html += '<br><br>';

      // slider
      html += '<div class="jspsych-html-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
      if(trial.slider_width !== null){
        html += 'width:'+trial.slider_width+'px;';
      }
      else {
        html +="width:auto;";
      }
      html += '">';
      html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-html-slider-response-response"></input>';
      html += '<div>'
      for(var j=0; j < trial.labels.length; j++){
        var width = 100/(trial.labels.length-1);
        var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
        html += '</div>'
      }
      html += '</div>';
      html += '</div>';
      html += '</div>';
      html += '<br><br><br><hr><br><br><br>';
  
  
      // add submit button
      html += '<button id="jspsych-html-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';
  
      display_element.innerHTML = html;
  
      var response = {
        rt: null,
        val: null
      };
  
      if(trial.require_movement){
        display_element.querySelector('#jspsych-html-slider-response-response').addEventListener('change', function(){
          display_element.querySelector('#jspsych-html-slider-response-next').disabled = false;
        })
      }
  
      display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
        // measure response time
        var endTime = performance.now();
        response.rt = endTime - startTime;
        response.response = display_element.querySelector("#jspsych-html-slider-response-response").valueAsNumber;
              if (trial.response_ends_trial) {
                  end_trial();
              }
              else {
                  display_element.querySelector("#jspsych-html-slider-response-next").disabled = true;
              }
          });
          if (trial.stimulus_duration !== null) {
            this.jsPsych.pluginAPI.setTimeout(() => {
                display_element.querySelector("#jspsych-html-slider-response-stimulus").style.visibility = "hidden";
            }, trial.stimulus_duration);
        }
  
      function end_trial(){
  
        jsPsych.pluginAPI.clearAllTimeouts();
  
        // save data
        var trialdata = {
          "rt": response.rt,
          "val": response.response,
        };
  
        display_element.innerHTML = '';
  
        // next trial
        jsPsych.finishTrial(trialdata);
      }
  
      if (trial.stimulus_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-slider-response-stimulus').style.visibility = 'hidden';
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