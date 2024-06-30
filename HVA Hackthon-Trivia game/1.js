 let currentCategory = '';
        let currentDifficulty = '';
        let currentQuestions = [];
        let currentQuestionIndex = 0;
        let player1 = '';
        let player2 = '';
        let player1Score = 0;
        let player2Score = 0;

        function startGame() {
            player1 = document.getElementById('player1').value;
            player2 = document.getElementById('player2').value;
            updatePlaceholders();
            document.getElementById('player-input').style.display = 'none';
            fetchCategories();
        }

        function updatePlaceholders() {
            document.getElementById('player1-answer').placeholder = `${player1}'s Answer`;
            document.getElementById('player2-answer').placeholder = `${player2}'s Answer`;
        }

        function fetchCategories() {
            const apiUrl = `https://the-trivia-api.com/v2/categories`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const categoriesContainer = document.getElementById('categories-container');
                    categoriesContainer.innerHTML = '';
                    for (let category in data) {
                        const button = document.createElement('button');
                        button.innerText = capitalizeFirstLetter(category);
                        button.onclick = () => selectCategory(category);
                        categoriesContainer.appendChild(button);
                    }
                    document.getElementById('category-selection').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                    alert('Failed to fetch categories. Please try again later.');
                });
        }

        function selectCategory(category) {
            currentCategory = category;
            document.getElementById('category-selection').style.display = 'none';
            document.getElementById('difficulty-selection').style.display = 'block';
        }

        function selectDifficulty(difficulty) {
            currentDifficulty = difficulty;
            document.getElementById('difficulty-selection').style.display = 'none';
            document.getElementById('question-area').style.display = 'block';
            document.getElementById('category-title').innerText = `${capitalizeFirstLetter(currentDifficulty)} ${capitalizeFirstLetter(currentCategory)} Questions`;
            fetchQuestions();
        }

        function fetchQuestions() {
            const apiUrl = `https://the-trivia-api.com/v2/questions?categories=${currentCategory}&limit=6&difficulty=${currentDifficulty}`;
            console.log(`Fetching questions from: ${apiUrl}`);
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched questions:', data); // Debugging: Log the fetched questions
                    currentQuestions = data;
                    currentQuestionIndex = 0;
                    showQuestion();
                })
                .catch(error => {
                    console.error('Error fetching questions:', error);
                    alert('Failed to fetch questions. Please try again later.');
                });
        }

        function showQuestion() {
            if (currentQuestionIndex < currentQuestions.length) {
                const currentQuestion = currentQuestions[currentQuestionIndex].question;
                document.getElementById('question').innerText = currentQuestion.text;
                document.getElementById('player1-answer').value = '';
                document.getElementById('player2-answer').value = '';
                document.getElementById('feedback').innerText = '';
            } else {
                document.getElementById('question').innerText = "Game Over!";
                document.getElementById('feedback').innerText = '';
            }
        }

        function submitAnswers() {
            const player1Answer = document.getElementById('player1-answer').value;
            const player2Answer = document.getElementById('player2-answer').value;
            const correctAnswer = currentQuestions[currentQuestionIndex].correctAnswer;

            let feedback = '';
            if (player1Answer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedback += `${player1} got it right! `;
                player1Score++;
            } else {
                feedback += `${player1} got it wrong. `;
            }

            if (player2Answer.toLowerCase() === correctAnswer.toLowerCase()) {
                feedback += `${player2} got it right!`;
                player2Score++;
            } else {
                feedback += `${player2} got it wrong.`;
            }

            document.getElementById('feedback').innerText = feedback;
            updateScore();
        }

        function nextQuestion() {
            currentQuestionIndex++;
            showQuestion();
        }

        function updateScore() {
            document.getElementById('score').innerText = `${player1}: ${player1Score} - ${player2}: ${player2Score}`;
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
   