jsPsych.plugins["instructions-advanced"] = (function () {
  var plugin = {};

  plugin.info = {
    name: "instructions-advanced",
    description:
      "A plugin for displaying instructions with a grid of images and associated data.",
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Pages",
        default: null,
        array: true,
        description:
          "Each element of the array is the content for a single page.",
      },
      key_forward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: "Key forward",
        default: "rightarrow",
        description:
          "The key the subject can press in order to advance to the next page.",
      },
      key_backward: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: "Key backward",
        default: "leftarrow",
        description:
          "The key that the subject can press to return to the previous page.",
      },
      allow_backward: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Allow backward",
        default: true,
        description:
          "If true, the subject can return to the previous page of the instructions.",
      },
      allow_keys: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Allow keys",
        default: true,
        description:
          "If true, the subject can use keyboard keys to navigate the pages.",
      },
      show_clickable_nav: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Show clickable nav",
        default: false,
        description:
          'If true, then a "Previous" and "Next" button will be displayed beneath the instructions.',
      },
      show_page_number: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: "Show page number",
        default: false,
        description:
          "If true, and clickable navigation is enabled, then Page x/y will be shown between the nav buttons.",
      },
      button_label_previous: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label previous",
        default: "Previous",
        description: "The text that appears on the button to go backwards.",
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label next",
        default: "Next",
        description: "The text that appears on the button to go forwards.",
      },

      image_data: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Image Data",
        default: null,
        description:
          "An object containing image data, such as ship type, damage value, and associated images.",
      },
      stim_list: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Planet Stimuli",
        default: null,
        array: true,
        description: "An array of planet image paths.",
      },
      ship_list: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Ship Stimuli",
        default: null,
        array: true,
        description: "An array of ship image paths.",
      },
      damage: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Damage",
        default: null,
        array: true,
        description: "An array of damage values for each planet-ship pair.",
      },
      arrows: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Arrow Images",
        default: null,
        array: true,
        description: "An array of arrow image paths.",
      },
      planet_names: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Planet Names",
        default: null,
        array: true,
        description: "An array of planet names.",
      },
      ship_names: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Ship Names",
        default: null,
        array: true,
        description: "An array of ship names.",
      },
      outcomes: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: "Outcome Images",
        default: null,
        array: true,
        description: "An array of outcome image paths.",
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    var current_page = 0;
    var view_history = [];
    var start_time = performance.now();
    var last_page_update_time = start_time;

    // Function to handle button click navigation
    function btnListener(evt) {
      evt.target.removeEventListener("click", btnListener);
      if (this.id === "jspsych-instructions-back") {
        back();
      } else if (this.id === "jspsych-instructions-next") {
        next();
      }
    }

    // Function to display the current page
    function show_current_page() {
      var html = trial.pages[current_page];

      var pagenum_display = "";
      if (trial.show_page_number) {
        pagenum_display =
          "<span style='margin: 0 1em;' class='" +
          "jspsych-instructions-pagenum'>Page " +
          (current_page + 1) +
          "/" +
          trial.pages.length +
          "</span>";
      }

      if (trial.show_clickable_nav) {
        var nav_html =
          "<div class='jspsych-instructions-nav' style='padding: 10px 0px;'>";
        if (trial.allow_backward) {
          var allowed = current_page > 0 ? "" : "disabled='disabled'";
          nav_html +=
            "<button id='jspsych-instructions-back' class='jspsych-btn' style='margin-right: 5px;' " +
            allowed +
            ">&lt; " +
            trial.button_label_previous +
            "</button>";
        }
        if (trial.pages.length > 1 && trial.show_page_number) {
          nav_html += pagenum_display;
        }
        nav_html +=
          "<button id='jspsych-instructions-next' class='jspsych-btn'" +
          "style='margin-left: 5px;'>" +
          trial.button_label_next +
          " &gt;</button></div>";

        html += nav_html;
      } else {
        if (trial.show_page_number && trial.pages.length > 1) {
          html +=
            "<div class='jspsych-instructions-pagenum'>" +
            pagenum_display +
            "</div>";
        }
      }

      // Generate the HTML for the image grid
      html += '<div class="jspsych-instructions-advanced-grid">';
      for (var i = 0; i < trial.images.length; i++) {
        var ship = trial.image_data.ships[i];
        var planet = trial.image_data.planets[i];
        var damage = trial.image_data.damage[i];
        var arrow = trial.image_data.arrows[i];
        var outcome =
          damage === 0 ? trial.image_data.win100 : trial.image_data.lose;

        html += '<div class="jspsych-instructions-advanced-row">';
        html +=
          '<img src="' +
          planet +
          '" class="jspsych-instructions-advanced-image">';
        html +=
          '<img src="' +
          arrow +
          '" class="jspsych-instructions-advanced-image">';
        html +=
          '<img src="' +
          ship +
          '" class="jspsych-instructions-advanced-image">';
        html +=
          '<img src="' +
          arrow +
          '" class="jspsych-instructions-advanced-image">';
        html +=
          '<img src="' +
          outcome +
          '" class="jspsych-instructions-advanced-image">';
        html += "</div>";
      }
      html += "</div>";

      display_element.innerHTML = html;

      if (
        current_page !== 0 &&
        trial.allow_backward &&
        trial.show_clickable_nav
      ) {
        display_element
          .querySelector("#jspsych-instructions-back")
          .addEventListener("click", btnListener);
      }

      if (trial.show_clickable_nav) {
        display_element
          .querySelector("#jspsych-instructions-next")
          .addEventListener("click", btnListener);
      }
    }

    // Function to move to the next page
    function next() {
      add_current_page_to_view_history();
      current_page++;

      if (current_page >= trial.pages.length) {
        endTrial();
      } else {
        show_current_page();
      }
    }

    // Function to move to the previous page
    function back() {
      add_current_page_to_view_history();
      current_page--;
      show_current_page();
    }

    // Function to add the current page to the view history
    function add_current_page_to_view_history() {
      var current_time = performance.now();
      var page_view_time = current_time - last_page_update_time;
      view_history.push({
        page_index: current_page,
        viewing_time: page_view_time,
      });
      last_page_update_time = current_time;
    }

    // Function to end the trial
    function endTrial() {
      if (trial.allow_keys) {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
      }

      display_element.innerHTML = "";

      var trial_data = {
        view_history: JSON.stringify(view_history),
        rt: performance.now() - start_time,
        images: JSON.stringify(trial.images),
        image_data: JSON.stringify(trial.image_data),
      };

      jsPsych.finishTrial(trial_data);
    }

    // Function to handle keyboard navigation
    var after_response = function (info) {
      keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: "performance",
        persist: false,
        allow_held_key: false,
      });

      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_backward)) {
        if (current_page !== 0 && trial.allow_backward) {
          back();
        }
      }

      if (jsPsych.pluginAPI.compareKeys(info.key, trial.key_forward)) {
        next();
      }
    };

    // Display the first page
    show_current_page();

    // Set up keyboard navigation listener
    if (trial.allow_keys) {
      var keyboard_listener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.key_forward, trial.key_backward],
        rt_method: "performance",
        persist: false,
      });
    }
  };

  return plugin;
})();
