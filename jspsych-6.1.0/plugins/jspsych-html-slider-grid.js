jsPsych.plugins['html-slider-grid'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'html-slider-grid',
    description: 'A plugin for creating a 3D triangle slider',
    parameters: {
      stimulus_all: {
        type: jsPsych.plugins.parameterType.ARRAY,
        pretty_name: 'Stimulus all',
        default: [],
        description: 'Array of stimulus image paths'
      },
      planetColors: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Planet colors',
        default: null,
        description: 'Object mapping image paths to their respective colors'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed above the triangle slider.'
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider width',
        default: 500,
        description: 'Width of the triangle slider in pixels.'
      },
      slider_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Slider height',
        default: 400,
        description: 'Height of the triangle slider in pixels.'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus height',
        default: 100,
        description: 'Height of the stimulus images in pixels.'
      },
      labels: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Labels',
        default: [],
        array: true,
        description: 'Labels to display on the triangle slider.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      }
    }
  };

  // Helper functions
  // =================

  function getImagePosition(index, sliderWidth, sliderHeight, stimulusHeight) {
    switch (index) {
      case 0:
        return `top: 0; left: 0; transform: translate(-50%, -${0 + stimulusHeight / 2}%);`;
      case 1:
        return `top: 0; right: 0; transform: translate(50%, -${0 + stimulusHeight / 2}%);`;
      case 2:
        return `bottom: 0; left: 50%; transform: translate(-50%, ${0 + stimulusHeight / 2}%);`;
      default:
        return '';
    }
  }

  function getLabelPosition(index) {
    switch (index) {
      case 0:
        return 'top: 0; left: 0; transform: translate(-50%, -100%);';
      case 1:
        return 'top: 0; right: 0; transform: translate(50%, -100%);';
      case 2:
        return 'bottom: 0; left: 50%; transform: translate(-50%, 100%);';
      default:
        return '';
    }
  }

  function getDefaultProportion(index) {
    return 33; // Equal proportions for all three planets
  }

  function getPieChartGradient(planetColors, planetOrder, proportions = [33, 33, 34]) {
    var colorStops = [];
    var cumulativePercentage = 0;

    for (var i = 0; i < planetOrder.length; i++) {
      var planet = planetOrder[i];
      var color = planetColors[planet];
      var percentage = proportions[i];

      colorStops.push(`${color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`);
      cumulativePercentage += percentage;
    }

    return `conic-gradient(${colorStops.join(', ')})`;
  }

  // Trial function
  // ==============

  plugin.trial = function(display_element, trial) {
    var planetOrder = trial.stimulus_all;

    // HTML structure
    // =============

    var html = `
      <div id="jspsych-html-slider-triangle-wrapper" style="position: relative; width: ${trial.slider_width}px; height: ${trial.slider_height}px;">
        <div style="position: absolute; top: -400px; left: 50%; transform: translateX(-50%);">
          ${trial.prompt}
        </div>

        <div id="jspsych-html-slider-triangle-stimulus" style="position: relative; width: 100%; height: 100%;">
          ${planetOrder.map((planet, index) => `
            <img src="${planet}" style="position: absolute; ${getImagePosition(index, trial.slider_width, trial.slider_height, trial.stimulus_height)}; width: ${trial.stimulus_height}px; height: ${trial.stimulus_height}px;"/>
          `).join('')}

          ${planetOrder.map((planet, index) => `
            <div id="planet-${index}-label" style="position: absolute; ${getLabelPosition(index)}; color: ${trial.planetColors[planet]};">Planet ${String.fromCharCode(65 + index)} (${getDefaultProportion(index)}%)</div>
          `).join('')}

          <div id="jspsych-html-slider-triangle" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${trial.slider_width * 0.6}px; height: ${trial.slider_height * 0.6}px; clip-path: polygon(50% 100%, 0 0, 100% 0); background-color: #ddd;"></div>

          <div id="jspsych-html-slider-triangle-handle" style="position: absolute; width: ${trial.slider_width * 0.6}px; height: ${trial.slider_height * 0.6}px; clip-path: polygon(50% 100%, 0 0, 100% 0); pointer-events: none;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 10px; height: 10px; background-color: #000; border-radius: 50%;"></div>
          </div>
        </div>

        <div id="jspsych-html-slider-triangle-pie-chart" style="position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 150px; height: 150px; border-radius: 50%; background-image: ${getPieChartGradient(trial.planetColors, planetOrder)}"></div>
      </div>

      <button id="jspsych-html-slider-triangle-continue" class="jspsych-btn" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);">Continue</button>
    `;

    display_element.innerHTML = html;

    // DOM elements
    // ============

    var triangle = display_element.querySelector('#jspsych-html-slider-triangle');
    var handle = display_element.querySelector('#jspsych-html-slider-triangle-handle');
    var pieChart = display_element.querySelector('#jspsych-html-slider-triangle-pie-chart');
    var continueButton = display_element.querySelector('#jspsych-html-slider-triangle-continue');

    // State variables
    // ===============

    var isDragging = false;
    var proportions = [33, 33, 34]; // Initialize with default proportions

    // Response object
    // ===============

    var response = {
      proportions: proportions,
      clicked: false,
      rt: null,
      timestamps: {
        start: null,
        end: null,
        clicks: []
      },
      locations: {
        clicks: [],
      },
      stimulus_all: trial.stimulus_all,
      planetColors: trial.planetColors
    };

    // Record the start timestamp
    response.timestamps.start = performance.now();

    // Calculate the coordinates of the triangle corners relative to the document
    var triangleRect = triangle.getBoundingClientRect();
    var topLeftCorner = { x: triangleRect.left, y: triangleRect.top };
    var topRightCorner = { x: triangleRect.right, y: triangleRect.top };
    var bottomCorner = { x: triangleRect.left + triangleRect.width / 2, y: triangleRect.bottom };

    // Calculate the equilateral triangle height based on the width
    var triangleHeight = triangleRect.width * (Math.sqrt(3) / 2);

    // Update the triangle dimensions to ensure an equilateral triangle
    triangle.style.height = `${triangleHeight}px`;
    triangle.style.clipPath = `polygon(50% ${triangleHeight}px, 0 0, ${triangleRect.width}px 0)`;

    // Calculate the proportions based on handle position using indexing
    function calculateProportions(x, y) {
      var triangleWidth = triangleRect.width;
      var triangleHeight = triangleRect.height;
      var numRows = 10;
      var numCols = 10;
      var cellWidth = triangleWidth / numCols;
      var cellHeight = triangleHeight / numRows;

      var row = Math.floor(y / cellHeight);
      var col = Math.floor(x / cellWidth);

      var topProportion = ((numRows - row - 1) * (numCols - col)) / (numRows * numCols) * 100;
      var rightProportion = ((numRows - row - 1) * col) / (numRows * numCols) * 100;
      var bottomProportion = (row * numCols) / (numRows * numCols) * 100;

      return [topProportion, rightProportion, bottomProportion];
    }

    // Update handle position and proportions based on mouse position
    function updateHandlePosition(mouseX, mouseY) {
      var x = mouseX - triangleRect.left;
      var y = mouseY - triangleRect.top;

      handle.style.left = `${x}px`;
      handle.style.top = `${y}px`;

      proportions = calculateProportions(x, y);

      // Update the labels with the new proportions
      planetOrder.forEach((planet, index) => {
        var label = display_element.querySelector(`#planet-${index}-label`);
        label.textContent = `Planet ${String.fromCharCode(65 + index)} (${Math.round(proportions[index])}%)`;
      });

      // Update the pie chart rendering
      pieChart.style.backgroundImage = getPieChartGradient(trial.planetColors, planetOrder, proportions);
    }

    // Event listeners
    // ==============

    triangle.addEventListener('mousemove', function(event) {
      if (isDragging) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        updateHandlePosition(mouseX, mouseY);
      }
    });

    triangle.addEventListener('mousedown', function(event) {
      if (event.button === 0) {
        isDragging = true;
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        updateHandlePosition(mouseX, mouseY);
        response.clicked = true;
        var timestamp = performance.now();
        response.timestamps.clicks.push(timestamp);
        response.locations.clicks.push({
          x: mouseX,
          y: mouseY,
          proportions: proportions
        });
      }
    });

    document.addEventListener('mouseup', function(event) {
      if (event.button === 0) {
        isDragging = false;
      }
    });

    triangle.addEventListener('mouseleave', function(event) {
      isDragging = false;
    });

    // Function to end the trial
    var end_trial = function() {
      // Remove event listeners
      triangle.removeEventListener('mousemove', updateHandlePosition);
      triangle.removeEventListener('mousedown', updateHandlePosition);
      document.removeEventListener('mouseup', updateHandlePosition);
      triangle.removeEventListener('mouseleave', updateHandlePosition);

      // Set the final proportions
      response.proportions = proportions;

      // Set the end timestamp and reaction time
      response.timestamps.end = performance.now();
      response.rt = response.timestamps.end - response.timestamps.start;

      // Prepare the trial data
      var trial_data = {
        response: response
      };

      // Clear the display
      display_element.innerHTML = '';

      // End the trial
      jsPsych.finishTrial(trial_data);
    };

    // Event listener for the continue button
    continueButton.addEventListener('click', end_trial);
  };

  return plugin;
})();