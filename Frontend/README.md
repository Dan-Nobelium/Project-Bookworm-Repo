# Planets Task

Planets Task is a JavaScript-based application for conducting studies related to decision-making and probability. In this task, participants interact with a simulated environment where they can click on planets to receive probabilistic rewards and encounter various events like pirate attacks.

## Installation

This project does not require any specific package manager for installation. Simply clone the repository from the code repo and include the JavaScript files in your project as needed.

## Usage

Here's how you can use the Planets Task in your project:

// Include the planet-response.js or planet-responseELife.js in your HTML file
// Configure the parameters as per your study's requirement

// Example configuration:
var config = {
stimulus: ['img/planet1.png', 'img/planet2.png'], // array of planet image files
stimulus_height: 200, // height of planet images
stimulus_width: 200, // width of planet images
// ...  
};

## Table of Contents

    Installation
    Usage
    File Structure
    Dependencies
    Configuration
    Experiment Structure
    Custom Plugins
    Utility Functions
    Contributing
    License

## File Structure

The project has the following file structure:

planets-and-pirates/
├── app2.js
├── index2.html
├── text.js
├── jspsych-6.1.0/
│ ├── css/
│ │ └── jspsych.css
│ ├── jspsych.js
│ └── plugins/
└── img/

app2.js: The main JavaScript file containing the game logic and experiment structure.
index2.html: The HTML file that serves as the entry point for the game.
text.js: A JavaScript file containing text content used in the game.
jspsych-6.1.0/: Directory containing the jsPsych library files.
css/: Directory containing the jsPsych CSS file.
jspsych.js: The core jsPsych library file.
plugins/: Directory containing jsPsych plugin files.
img/: Directory containing image files used in the game.

## Dependencies

The game relies on the following dependencies:

    jsPsych (version 6.1.0): A JavaScript library for creating behavioral experiments.
    jQuery: A JavaScript library for DOM manipulation and event handling.

The necessary files for these dependencies are included in the project repository.

## Configuration

The game can be configured by modifying the variables and parameters in the app2.js file. Some notable configuration options include:

    groups: An array of group names for randomizing participant groups.
    samples: An array of sample names for randomizing participant samples.
    stim_list: An array of image file paths for the planet stimuli.
    ship_list: An array of image file paths for the ship stimuli.
    block_duration: The duration of each block in milliseconds.
    probability_trade: The probability of successful trades for each planet.
    probability_shield: The probability of successful shield activation for each planet.

Please refer to the comments in the app2.js file for a complete list of configuration options.

## Experiment Structure

The experiment consists of multiple phases and blocks. The main phases are:

    Instructions: Participants are shown instructions and must pass a comprehension check to proceed.
    Phase 1: Participants interact with planets without the presence of ships.
    Phase 2: Participants interact with planets while ships appear and can attack.
    Phase 3: Participants are informed about the contingencies between planets and ships.

Each phase consists of multiple blocks, and each block contains a specified number of trials. The experiment timeline is constructed dynamically based on the configuration options.

## Custom Plugins

The game utilizes several custom jsPsych plugins to implement specific functionality. These plugins are located in the jspsych-6.1.0/plugins/ directory. Some notable custom plugins include:

    planet-response.js: A plugin for displaying planets and handling participant responses.
        Parameters:
            stimulus: An array of image file paths for the planet stimuli.
            prompt: An array of labels for each planet.
            show_ship: A boolean indicating whether to display ships.
            ship_stimulus: An array of image file paths for the ship stimuli.
            ship_attack_damage: An array specifying the attack damage for each ship.
            block_duration: The duration of each block in milliseconds.
        Function: Displays the planets and handles participant interactions, including trading, shield activation, and ship attacks.
    jspsych-inference-check-1.js: A plugin for collecting inference ratings for a single stimulus.
        Parameters:
            main_stimulus: The image file path for the main stimulus.
            stimulus_1: The image file path for the first additional stimulus.
            stim_text_1: Text to display with the first additional stimulus.
            slider_text_top: Text to display above the rating slider.
            labels_top: Labels for the rating slider.
        Function: Displays the main stimulus, an additional stimulus, and a rating slider to collect inference ratings.
    jspsych-valence-check-3.js: A plugin for collecting valence ratings for three stimuli.
        Parameters:
            stimulus_1, stimulus_2, stimulus_3: Image file paths for the three stimuli.
            stim_text_1, stim_text_2, stim_text_3: Text to display with each stimulus.
            labels: Labels for the valence rating sliders.
        Function: Displays three stimuli and corresponding valence rating sliders to collect valence ratings.
    jspsych-survey-multi-catch-image.js: A plugin for multiple-choice survey questions with instruction looping and error catching.
        Parameters:
            options: An array of HTML strings representing the answer options.
            correct_answers: An object specifying the correct answers for each question.
            instructions: Instructions to display when an incorrect answer is given.
        Function: Presents multiple-choice questions with images and handles instruction looping and error catching.

Please refer to the respective plugin files for more details on their functionality and parameters.

## Utility Functions

The app2.js file contains several utility functions that are used throughout the game. These functions perform tasks such as adding blocks to the timeline, initializing variables for balanced probability arrays, and shuffling arrays.

Some notable utility functions include:

    addBlocksToTimeline: Adds blocks to the experiment timeline based on the provided configuration.
    initProbArray: Initializes variables for balanced probability arrays.
    shuffleArray: Shuffles the elements of an array randomly.

Please refer to the comments in the app2.js file for more details on each utility function.

## Contributing

Contributions to the Planets and Pirates game are welcome! If you find any bugs, have suggestions for improvements, or want to add new features, please open an issue or submit a pull request on the GitHub repository.

When contributing, please adhere to the existing code style and conventions. Make sure to test your changes thoroughly before submitting a pull request.

## License

The Planets and Pirates game is open-source software licensed under the MIT License. You are free to use, modify, and distribute the game as per the terms of the license.

## Contribution

### Contact

If you have any questions, suggestions, or feedback regarding the Planets Task, please feel free to contact the project maintainer:

    Daniel Noble (daniel.nobelium@gmail.com)

### Acknowledgments

We would like to acknowledge the contributions of the following individuals to the Planets Task project:

    Dr. Philip Jean-Richard Dit Bressel
    Josh de Leeuw
    Jessica C. Lee
    Shi Xian Liew

### License

The Project Planets Task is open-source software licensed under the MIT License. You are free to use, modify, and distribute the project in accordance with the terms and conditions of the license.
