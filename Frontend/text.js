//This file containts text variables which are placed into the Global Scope. (As resources allow these will be locally scoped).
const demographics_block = {
  type: 'survey-html-form-data-validation',
  preamble: '<p><b>Please fill in your demographic details</b></p>',
  html: 
  '<p> Gender: ' +
  '<input type="radio" name="gender" value="male" required/> Male &nbsp; ' +
  '<input type="radio" name="gender" value="female" required/> Female &nbsp;' +
  '<input type="radio" name="gender" value="other" required/> Other<br>' + '<br>' +
  '<p> Age: <input name="age" type="number" min="1" max="99" required/> </p>' + '<br>' +
  '<p> Native language: <select name="language" type="text" id="languageDropdown" required/> </select> </p>' + '<br>',
  data: {
    phase: 'demographics'
  },
  language_data_file: './assets/languages.json'
};

var consent_block = {
  type: 'html-button-response',
  stimulus:   '<img src= "assets/logo.png"></img>' +
  '<p>Welcome to the experiment!</p>' +
  '<p>Before you begin, please read the information sheet carefully.</p>' +
  '<br>' +
  '<p><b>PARTICIPANT INFORMATION STATEMENT AND CONSENT</b></p>' +
    '<embed src="assets/PIS_SONA_3385.pdf" type="application/pdf" width="800px" height="2100px" />' +
  '<p>By continuing, you are making a decision whether or not to participate. Clicking the button below indicates that, having read the information provided on the participant information sheet, you consent to the above.' +
  '<br></p>',
  choices: ['I consent to participate'],
  data: {
  phase: 'consent'
  },
  }   

  preques = [
      '<p>WELCOME TO THE EXPERIMENT!</p>' +
      '<p>To ensure high-quality data and minimise fatigue, we ask that you make a concerted effort to complete the study <b>within 45 minutes </b>. Please keep in mind that those who take significantly longer may be timed out and they may not be eligible to complete the remainder of the study. </p>' +
      '<p>Before commencing the game, we will ask you a couple of questions about yourself. Please read each item carefully and answer as accurately as possible. This would take 5-10 minutes to complete. </p>'
    ];
    
    pretrain1 = [
      '<p>EXPERIMENT PHASE BEGINS</p>' +
      '<p>Throughout the experiment, please <b>read all instructions carefully</b> and click on the buttons to go forward or back. You may need to scroll down on some pages. </p>' +
      '<p>Please complete the experiment in ONE sitting in FULL SCREEN mode <b>on a computer or a tablet (not a phone).</b></p>'
    ];
  
    pretrain2 = [
      '<p>In this experiment you will be playing a game over 6 blocks. </p>' +
      '<p>In this game, you are an intergalactic trader in space. You will be situated between two planets that you can trade with. You can send a signal to each planet by clicking on them. Sometimes locals on these planets will receive the signal and be willing to trade. Each successful trade will give you points. </p>' +
      '<p><b>Your goal is to gain as many points as possible. </b></p>'
      // '<p><b>Note:</b> Whatever you earn in-game will be converted into real money for you at the end of the experiment. The more you earn in-game, the more you make in real life. You can earn more points by trading with both planets. </p>'
    ];
  
    pretrain3 = [
      '<p>You can click on each of the planets as many times as you like. Just remember, the aim is to get as many points as possible! </p>' +
      '<p>There are multiple blocks in this experiment. Between each block we will ask you some questions about each of the game elements. </p>' +
      '<p>Please do your best to engage in the task and answer all questions to the best of your ability. </p>' +
      '<p><b>There will be monetary prizes for participants with high scores (top 10% of the cohort) and <i>timely</i> answers </b>, so try do your best! </p>'
    ];

  const questions = [
      {
        prompt: "<b>Question 1:</b> The aim of the task is to:",
        options: ["Get as many points as possible", "Battle the aliens on the planets"],
        correct: "Get as many points as possible"
      },
      {
        prompt: "<b>Question 2:</b> Clicking on each planet will:",
        options: ["Make the planet disappear", "Sometimes result in a successful trade, earning me points"],
        correct: "Sometimes result in a successful trade, earning me points"
      },
      {
        prompt: "<b>Question 3:</b> There will be multiple blocks in this experiment, with questions in between each block.",
        options: ["FALSE", "TRUE"],
        correct: "TRUE"
      },
      {
        prompt: "<b>Question 4:</b> The top 10% performers at the end of the task will receive:",
        options: ["An additional monetary prize", "Extra course credit"],
        correct: "An additional monetary prize"
      }
    ];


    phase2_instructions = [
      '<p>There have been reports of local pirates stealing from trading ships. Watch out! </p>' +
      // '<p>In the next few blocks, trading with a planet might result in the arrival of a pirate ship. </p>' +
      '<p>Your ship has a shield that can keep these pirates from stealing from you, but the shield will not always be available. If available, you can activate the shield by pressing the ACTIVATE button. </p>' +
      '<p>Remember, your goal is still to <b> gain as many points as possible! </b></p>'
    ];
    

    debrief = [
      '<p>Please confirm that you have read the debriefing questions below: </p>' +
      
      '<p><b><i>What are the research questions?</i></b></p>' + 
      '<p>Our behaviour changes in response to experienced rewards and losses. This study asks how behaviour and accompanying beliefs change when these outcomes have varying degrees of relationship to our behaviour. </p>' +
      
      '<p><b><i>How does this study extend on previous research on this topic?</i></b></p>' +
      '<p>Existing research suggests that stronger relationships between behaviours and outcomes will influence behaviour more. For example, behaviours that earn immediate and regular rewards are more likely to be reinforced than behaviours with a weaker relationship to rewards. We extend this by examining how dependent these changes are on beliefs and personality traits. </p>' +
      
      '<p><b><i>What are some potential real-world implications of this research?</i></b></p>' +
      '<p>We learn about our environments through experience. Understanding how beliefs develop with this experience to change behaviour can help us better understand and predict adaptive/maladaptive decision-making. A potential outcome of this understanding is the development of more effective strategies to improve learning and decision-making. </p>' +
      
      '<p><b><i>Describe a potential issue or limitation of the study (e.g., ethical, design etc.), or opportunities for future work that extends this study.</i></b></p>' +
      '<p>Participants might have prior experience or beliefs that would affect performance in the task. We have attempted to control for this by using a cover-story to help participants understand and engage in the task. Future studies could vary this cover-story to assess how this affects learning and decision-making in the task. </p>' +
      
      '<p><b><i>Describe the study methodology (e.g., design, dependent/independent variables, stimulus presentation).</i></b></p>' +
      '<p>Participants are given the opportunity to click on “planets” to earn point rewards. In addition to this, “ships” that may or may not result in point loss are presented. The key independent variable is the programmed strength of the relationship between particular actions and point outcomes (weak vs. strong relationship). The key dependent variables are clicking behaviour, valuations of task elements, and inferred relationships between task elements. Personality traits are also assessed to observe how these relate to behaviour and beliefs. </p>' +
      
      '<p><b><i>Further reading: </i></b></p>' +
      '<p> Lovibond, P.F., & Shanks, D.R. (2002). The role of awareness in Pavlovian conditioning: Empirical evidence and theoretical implications. Journal of Experimental Psychology: Animal Behavior Processes, 28, 3. </p>'
      ];
      
      contact = [ 'If you would like to receive a copy of the study results via email, please provide your email address below. Your email address will be used for this purpose only, and will not be stored alongside your data.'
      
      ];

      var valence_labels = [
        'Very <br>negative',
        'Slightly <br>negative',
        'Neutral',
        'Slightly <br>positive',
        'Very <br>positive'
      ];

      var contingency_labels = [
        '<p>' + 'Never' + '<br>(0%)</p>',
        '<p>' + 'Sometimes' + '</p>',
        '<p>' + 'Every time' + '<br>(100%)</p>'
      ];

      
  // inference check prompt
  var inference_prompt = [
    'Please answer the following questions with respect to <b>Planet A</b> (left planet):',
    'Please answer the following questions with respect to <b>Planet B</b> (middle planet):',
    'Please answer the following questions with respect to <b>Planet C</b> (right planet):',
    'Please answer the following questions with respect to <b>Ship 1</b>:',
    'Please answer the following questions with respect to <b>Ship 2</b>:',
    'Please answer the following questions with respect to <b>Ship 3</b>:',
  ];

  // contingency question
  var contingency_q = [
    'How OFTEN did interacting with <b>planet A</b> lead to the above outcome?',
    'How OFTEN did interacting with <b>planet B</b> lead to the above outcome?',
    'How OFTEN did interacting with <b>planet C</b> lead to the above outcome?',
    'How OFTEN did interacting with <b>Ship 1</b> lead to the above outcome?',
    'How OFTEN did interacting with <b>Ship 2</b> lead to the above outcome?',
    'How OFTEN did interacting with <b>Ship 3</b> lead to the above outcome?',
  ];

  const cfi = {};
cfi.prompt = '<b>Please rate how much you agree with the following statements. There are no right or wrong answers.</b>';
cfi.labels = ['strongly<br>disagree', 'disagree', 'somewhat<br>disagree', 'neutral', 'somewhat<br>agree', 'agree', 'strongly<br>agree'];

cfi.items = [
"I am good at \"sizing up\" situations.",
"I have a hard time making decisions when faced with difficult situations.",
"I consider multiple options making a decision.",
"When I encounter difficult situations, I feel like I am losing control.",
"I like to look at difficult situations from many different angles.",
"I seek additional information not immediately available before attributing causes to behaviour.",
"Select the left-most option, strongly disagree, for this question.",
"When encountering difficult situations, I become so stressed that I can not think of a way to resolve the situation.",
"I try to think about things from another person's point of view.", 
"I find it troublesome that there are so many different ways to deal with difficult situations.",
"I am good at putting myself in others' shoes.",
"When I encounter difficult situations, I just don't know what to do.",
"It is important to look at difficult situations from many angles.",
"When in difficult situations, I consider multiple options before deciding how to behave.",
"I often look at a situation from different view-points.",
"I am capable of overcoming the difficulties in life that I face.",
"I consider all the available facts and information when attributing causes to behaviour.",
"I feel I have no power to change things in difficult situations.",
"When I encounter difficult situations, I stop and try to think of several ways to resolve it.",
"I can think of more than one way to resolve a difficult situation I'm confronted with.",
"I consider multiple options before responding to difficult situations."
];

const htq = {};
htq.prompt = '<b>Please rate how much you agree with the following statements. There are no right or wrong answers.</b>';
htq.labels = ['strongly<br>disagree', 'disagree', 'somewhat<br>disagree', 'neutral', 'somewhat<br>agree', 'agree', 'strongly<br>agree'];

htq.items = [
"I tend to dwell on the same issues.",
"I mentally fixate on certain issues and can't move on.",
"The same thoughts often keep going through my mind over and over again.",
"I tend to repeat actions because I keep doubting that I have done them properly.",
"I like to have a regular, unchanging schedule.",
"There is comfort in regularity.",
"A good job has clear guidelines on what to do and how to do it.",
"I hate it when my routines are disrupted.",
"I look forward to new experiences.",
"Life is boring if you never take risks and always play it safe.",
"When eating at restaurants, I like to try new dishes rather than ones I have tried before."
];

const audit = {};
audit.prompt = '<b>Please answer the following questions about your alcohol use during the <b>past 12 months</b>.</b>';
audit.items = [
"How often do you have a drink containing alcohol?",
"How many drinks containing alcohol do you have on a typical day when you are drinking?",
"How often do you have six or more standard drinks on one occasion?",
"How often during the last year have you found that you were not able to stop drinking once you had started?",
"How often during the last year have you failed to do what was normally expected of you because of drinking?",
"How often during the last year have you needed a drink first thing in the morning to get yourself going after a heavy drinking session?",
"Select the fourth option from the left, weekly, for this question.",
"How often during the last year have you had a feeling of guilt or remorse after drinking?",
"How often during the last year have you been unable to remember what happened the night before because of your drinking?",
"Have you or someone else been injured because of your drinking?",
"Has a relative, friend, doctor or other healthcare worker been concerned about your drinking or suggested you cut down?"
];
audit.labels1 = ['never', 'monthly<br>or<br>less', '2-4 times<br>a<br>month', '2-3<br>times<br>a<br>week', '4+<br>times<br>a<br>week'];
audit.labels2 = ['1 or 2', '3 or 4', '5 or 6', '7 or 9', '10 or more'];
audit.labels3_9 = ['never', 'monthly<br>or<br>less', 'monthly', 'weekly', 'daily<br>or<br>almost daily'];
audit.labels10_11 = ['no', 'yes, but not in the last year', 'yes, during the last year'];


