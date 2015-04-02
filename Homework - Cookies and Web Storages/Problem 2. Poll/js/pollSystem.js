$(document).ready(function(){
    if(window.localStorage != null){
        var questions,
            currentQuestion,
            currentTimerLeft,
            interval,
            i,
            currentAnswer;

        localStorage.isCompleted = localStorage.isCompleted || false;
        localStorage.firstTime = localStorage.firstTime || true;
        localStorage.atQuestion = localStorage.atQuestion || 0;
        localStorage.questions = localStorage.questions || JSON.stringify([]);
        localStorage.timerLeft = localStorage.timerLeft || 30000;

        questions = JSON.parse(localStorage.questions);
        currentQuestion = parseInt(localStorage.atQuestion);
        currentTimerLeft = parseInt(localStorage.timerLeft);
        interval = setInterval(function(){
            currentTimerLeft -= 1;

            if(currentTimerLeft <= 0) {
                localStorage.isCompleted = true;
                clearInterval(interval);
            }
        }, 1);

        if(JSON.parse(localStorage.firstTime) == true){
            localStorage.questions = JSON.stringify(loadSampleQuestions());
            questions = JSON.parse(localStorage.questions);
            localStorage.firstTime = false;
        }

        $(window).on('unload', function(){
            localStorage.atQuestion = currentQuestion;
            localStorage.questions = JSON.stringify(questions);
            localStorage.timerLeft = currentTimerLeft;

            clearInterval(interval);
        });

        $('#previous').on('click', function(){
            currentQuestion -= 1;

            if(currentQuestion < 0){
                currentQuestion = 0;
            } else{
                onQuestionChange();
            }
        });

        $('#next').on('click', function(){
            currentQuestion += 1;

            if(currentQuestion > questions.length - 1){
                currentQuestion = questions.length - 1;
            } else{
                onQuestionChange();
            }
        });

        $('#theQuestion').text(questions[currentQuestion].question);

        for(i = 1; i <= 4; i += 1){
            currentAnswer = $('#answer' + i.toString());
            currentAnswer.text(questions[currentQuestion].possibleAnswers[i - 1]);
        }

        $('main').append('<button id="clearLocalStorage" form="questionForm">Clear Local Storage Variables</button>');
        $('#clearLocalStorage').on('click', clearLocalStorageVariables);

        function loadSampleQuestions(){
            var tempQuestions = [];

            tempQuestions.push(new Question('\'.MOV\' extension refers usually to what kind of file?',
                ['Image file', 'Animation/movie file', 'Audio file', 'MS Office document'], 1));
            tempQuestions.push(new Question('\'OS\' computer abbreviation usually means ?',
                ['Order of Significance', 'Open Software', 'Operating System', 'Optical Sensor'], 2));
            tempQuestions.push(new Question('\'.JPG\' extension refers usually to what kind of file?',
                ['System file', 'Animation/movie file', 'MS Encarta document', 'Image file'], 3));
            tempQuestions.push(new Question('What is the term to ask the computer to put information in order numerically or alphabetically?',
                ['Crop', 'Report', 'Record', 'Sort'], 3));

            return tempQuestions;
        }

        function clearLocalStorageVariables(){
            localStorage.removeItem('atQuestion');
            localStorage.removeItem('firstTime');
            localStorage.removeItem('isCompleted');
            localStorage.removeItem('questions');
            localStorage.removeItem('timerLeft');
        }

        function onQuestionChange(){
            if(currentQuestion <= questions.length - 1 && currentQuestion >= 0){
                $('#question').fadeToggle();

                setTimeout(function(){
                    $('#theQuestion').text(questions[currentQuestion].question);
                    for(i = 1; i <= 4; i += 1){
                        currentAnswer = $('#answer' + i.toString());
                        currentAnswer.text(questions[currentQuestion].possibleAnswers[i - 1]);
                    }
                }, 300);

                $('#question').fadeToggle();
            }
        }
    } else {
        $('main').append('<h1>You\'ve disable localStorage in your browser.</h1>');
    }
});