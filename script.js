/**
 * TECHNO FEUD 2026 - Game Logic
 * ----------------------------
 * This script handles question loading, sorting, state management,
 * and dynamic UI rendering for the Techno Feud game show experience.
 */

// --- Global Game State ---
let currentQuestionIndex = 0;   // Track current position in the question array
let questions = []; // Single array for all questions

// --- DOM Elements ---
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
// Difficulty buttons removed
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const flipAllBtn = document.getElementById('flip-all-btn');
// const counterLabel = document.getElementById('question-counter'); // Removed

// --- Point Distribution ---
/**
 * Points are assigned based on the option's position.
 * Option 1 gets 6 points, Option 2 gets 5 points, etc.
 */
// const pointsArray = [98, 85, 72, 64, 51, 42, 33, 25, 18, 12]; // Old scoring


/**
 * Initialize the game by fetching JSON data and setting up listeners.
 */
async function init() {
    try {
        // Load the single combined questions file
        const response = await fetch('questions.json');

        if (!response.ok) throw new Error('Network response was not ok');

        questions = await response.json();

        renderQuestion();
        setupEventListeners();

        console.log('Techno Feud 2026 Initialized Successfully. Total Questions:', questions.length);
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
    const question = questions[currentQuestionIndex];

    if (!question) return;

    // Visual Transition: Start fade-out
    questionText.classList.add('fade-out');
    const roundIndicator = document.getElementById('round-indicator');
    if (roundIndicator) roundIndicator.classList.add('fade-out');


    setTimeout(() => {
        // Update the main question display
        questionText.textContent = question.question;
        questionText.classList.remove('fade-out');
        
        // Update Round Indicator
        if (roundIndicator) {
            const roundNumber = Math.floor(currentQuestionIndex / 5) + 1;
            roundIndicator.textContent = `Round ${roundNumber}`;
            roundIndicator.classList.remove('fade-out');
        }

        // Reset the grid for the new set of options
        optionsGrid.innerHTML = '';

        /**
         * Render each option from the JSON array.
         * The grid will automatically scale based on the number of options.
         */
        question.options.forEach((opt, index) => {
            // Assign points: 6 for 1st, 5 for 2nd, etc.
            let points = Math.max(0, 6 - index);

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
        // counterLabel.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`; // Removed
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === questions.length - 1;
    }, 300); // Wait for fade-out animation to finish
}

/**
 * Set up all interactive event listeners.
 */
function setupEventListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
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

    // Keyboard support for faster navigation and revealing answers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) prevBtn.click();

        // Handle number keys 1-9
        if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            const cards = document.querySelectorAll('.option-card');
            
            if (cards[index]) {
                cards[index].classList.toggle('revealed');
                if ('vibrate' in navigator && cards[index].classList.contains('revealed')) {
                    navigator.vibrate(50); // Haptic feedback
                }
            }
        }
    });
}

// Global Entry Point
init();
