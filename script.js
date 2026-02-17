/**
 * TECHNO FEUD 2026 - Game Logic
 * ----------------------------
 * This script handles question loading, sorting, state management,
 * and dynamic UI rendering for the Techno Feud game show experience.
 */

// --- Global Game State ---
let currentDifficulty = 'easy'; // Default difficulty
let currentQuestionIndex = 0;   // Track current position in the question array
let questions = {
    easy: [],
    hard: []
};

// --- DOM Elements ---
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const easyBtn = document.getElementById('easy-btn');
const hardBtn = document.getElementById('hard-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const flipAllBtn = document.getElementById('flip-all-btn');
const counterLabel = document.getElementById('question-counter');

// --- Point Distribution ---
/**
 * Points are assigned in descending order based on popularity.
 * The first item in the options array gets the highest points.
 */
const pointsArray = [98, 85, 72, 64, 51, 42, 33, 25, 18, 12];

/**
 * Initialize the game by fetching JSON data and setting up listeners.
 */
async function init() {
    try {
        // Load both JSON files in parallel
        const [easyRes, hardRes] = await Promise.all([
            fetch('easyqustion.json'),
            fetch('hardqustion.json')
        ]);

        if (!easyRes.ok || !hardRes.ok) throw new Error('Network response was not ok');

        questions.easy = await easyRes.json();
        questions.hard = await hardRes.json();

        // SORTING: Ensure questions are strictly ordered by their ID
        questions.easy.sort((a, b) => a.id - b.id);
        questions.hard.sort((a, b) => a.id - b.id);

        renderQuestion();
        setupEventListeners();

        console.log('Techno Feud 2026 Initialized Successfully.');
    } catch (error) {
        console.error('Failed to load questions:', error);
        questionText.textContent = 'Error: Make sure you are running via a local server (http://).';
    }
}

/**
 * Renders the current question and its associated options.
 * Implements a fade-out/fade-in transition for smooth visuals.
 */
async function renderQuestion() {
    const currentQuestions = questions[currentDifficulty];
    const question = currentQuestions[currentQuestionIndex];

    if (!question) return;

    // Visual Transition: Start fade-out
    questionText.classList.add('fade-out');

    setTimeout(() => {
        // Update the main question display
        questionText.textContent = question.question;
        questionText.classList.remove('fade-out');

        // Reset the grid for the new set of options
        optionsGrid.innerHTML = '';

        /**
         * Render each option from the JSON array.
         * The grid will automatically scale based on the number of options.
         */
        question.options.forEach((opt, index) => {
            // Assign points based on the index (Descending popularity)
            let points;
            if (index < pointsArray.length) {
                points = pointsArray[index];
            } else {
                points = Math.max(5, 10 - (index - pointsArray.length)); // Handle extra options
            }

            // Create the individual card element
            const card = document.createElement('div');
            card.className = 'option-card';
            card.innerHTML = `
                <div class="option-inner">
                    <div class="option-front">
                        <span class="option-front-number">${index + 1}</span>
                    </div>
                    <div class="option-back">
                        <span class="option-text">${opt}</span>
                        <span class="option-points">${points}</span>
                    </div>
                </div>
            `;

            // Click listener to toggle a single card's flip state
            card.addEventListener('click', () => {
                card.classList.toggle('revealed');
                if ('vibrate' in navigator && card.classList.contains('revealed')) {
                    navigator.vibrate(50); // Haptic feedback on mobile
                }
            });

            optionsGrid.appendChild(card);
        });

        // Update footer stats and button disabled states
        counterLabel.textContent = `Question ${currentQuestionIndex + 1} / ${currentQuestions.length}`;
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === currentQuestions.length - 1;
    }, 300); // Wait for fade-out animation to finish
}

/**
 * Set up all interactive event listeners.
 */
function setupEventListeners() {
    // Difficulty switching
    easyBtn.addEventListener('click', () => setDifficulty('easy'));
    hardBtn.addEventListener('click', () => setDifficulty('hard'));

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });

    nextBtn.addEventListener('click', () => {
        const currentQuestions = questions[currentDifficulty];
        if (currentQuestionIndex < currentQuestions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        }
    });

    // Bulk action: Flip everything at once
    flipAllBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.option-card');
        const isSomeHidden = Array.from(cards).some(card => !card.classList.contains('revealed'));

        cards.forEach((card, index) => {
            setTimeout(() => {
                if (isSomeHidden) card.classList.add('revealed');
                else card.classList.remove('revealed');
            }, index * 100); // Staggered delay for cooler effect
        });
    });

    // Keyboard support for faster navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) prevBtn.click();
    });
}

/**
 * Handle difficulty state changes.
 */
function setDifficulty(diff) {
    if (currentDifficulty === diff) return;
    currentDifficulty = diff;
    currentQuestionIndex = 0; // Reset to start when switching difficulty

    // UI active state toggle
    easyBtn.classList.toggle('active', diff === 'easy');
    hardBtn.classList.toggle('active', diff === 'hard');

    renderQuestion();
}

// Global Entry Point
init();
