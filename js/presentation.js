'use strict';

/* =========================================================
   1. TIMELINE DATA
   ========================================================= */

const timelines = {
    representation: [
        {
            heading: 'Realitatea începe să lase <span>urme.</span>',
            title: 'Imagine și simbol',
            icon: 'icon-symbol',
            tags: 'picturi · urme · semne · reprezentări vizuale',
            example: 'reprezentarea unui animal pe peretele unei peșteri',
            result: 'Realitatea devine <strong>urmă</strong>.'
        },
        {
            heading: 'Semnul capătă o <span>convenție.</span>',
            title: 'Scriere',
            icon: 'icon-writing',
            tags: 'semne convenționale · sisteme de scriere · alfabet',
            example: 'o informație consemnată printr-un sistem de scriere',
            result: 'Informația poate fi <strong>codificată</strong>.'
        },
        {
            heading: 'Reprezentarea devine <span>abstractă.</span>',
            title: 'Număr și formalizare',
            icon: 'icon-formal',
            tags: 'numere · măsurare · notații · formule · diagrame',
            example: 'distanța dintre două puncte reprezentată printr-o valoare numerică',
            result: 'Realitatea poate fi <strong>măsurată și abstractizată</strong>.'
        },
        {
            heading: 'Reprezentarea poate fi <span>multiplicată.</span>',
            title: 'Tipar și standardizare',
            icon: 'icon-print',
            tags: 'reproducere · organizare · clasificare · distribuție',
            example: 'aceeași carte produsă în sute sau mii de exemplare',
            result: 'Reprezentarea poate fi <strong>reprodusă la scară</strong>.'
        },
        {
            heading: 'Fenomenele pot fi <span>înregistrate.</span>',
            title: 'Reprezentare analogică',
            icon: 'icon-analog',
            tags: 'fotografie · sunet · semnale · măsurători',
            example: 'o fotografie pe film sau sunet înregistrat pe bandă magnetică',
            result: 'Fenomenele fizice devin <strong>înregistrări</strong>.'
        },
        {
            heading: 'Forme diferite devin <span>date.</span>',
            title: 'Reprezentare digitală',
            icon: 'icon-digital',
            tags: 'biți · codificări · fișiere · baze de date',
            example: 'o fotografie reprezentată ca valori numerice ale pixelilor',
            result: 'Informația devine <strong>procesabilă algoritmic</strong>.'
        },
        {
            heading: 'Din date construim <span>modele.</span>',
            title: 'Modele computaționale și AI',
            icon: 'icon-ai',
            tags: 'vectori · reprezentări interne · modele statistice · modele generative',
            example: 'un text reprezentat prin vectori numerici utilizați de un model',
            result: 'Reprezentările susțin <strong>clasificare, predicție, inferență și generare</strong>.'
        }
    ]
};


/* =========================================================
   2. HELPERS
   ========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function splitDataValues(element, key) {
    return (element.dataset[key] || '')
        .split(' ')
        .map(value => value.trim())
        .filter(Boolean);
}


/* =========================================================
   3. TIMELINE RENDERER
   ========================================================= */

function renderTimeline(step) {
    const timelineName = step.dataset.timeline;
    const stage = Number(step.dataset.stage);
    const timeline = timelines[timelineName];

    if (!timeline || !Number.isInteger(stage) || !timeline[stage]) {
        return;
    }

    const current = timeline[stage];

    const cards = timeline
        .slice(0, stage + 1)
        .map((item, index) => {
            const active = index === stage;
            const compact = stage >= 3 && !active;

            return `
                <div class="timeline-card${active ? ' active' : ''}${compact ? ' compact' : ''}"
                     style="--i:${index}">

                    <div class="timeline-card-top">
                        <span class="timeline-index">
                            ${String(index + 1).padStart(2, '0')}
                        </span>

                        <div class="timeline-symbol">
                            <svg viewBox="0 0 64 64" aria-hidden="true">
                                <use href="#${item.icon}"></use>
                            </svg>
                        </div>
                    </div>

                    <h3>${item.title}</h3>
                    <p class="timeline-tags">${item.tags}</p>
                    <p class="timeline-example"><strong>Exemplu:</strong> ${item.example}.</p>
                    <p class="timeline-result">${item.result}</p>
                </div>
            `;
        })
        .join('');

    step.innerHTML = `
        <div class="timeline-heading">
            <div class="section-label">O ISTORIE A REPREZENTĂRII</div>
            <h2>${current.heading}</h2>
        </div>

        <div class="timeline-stack">
            ${cards}
        </div>
    `;
}

function initTimelines() {
    $$('[data-timeline]').forEach(renderTimeline);
}


/* =========================================================
   4. IMPRESS INSTANCE
   ========================================================= */

const presentation = impress();


/* =========================================================
   5. STEP NAVIGATION
   ========================================================= */

function initStepNavigation() {

    const nav = $('#step-nav');

    if (!nav) return;


    const steps =
        $$('#impress .step');

    nav.replaceChildren();


    steps.forEach((step, index) => {

        const button =
            document.createElement('button');

        button.type = 'button';

        button.dataset.target =
            step.id;

        button.dataset.index =
            String(index);

        button.title =
            step.dataset.nav ||
            step.id ||
            `Slide ${index + 1}`;

        button.setAttribute(
            'aria-label',
            button.title
        );

        button.textContent =
            String(index + 1);


        button.addEventListener(
            'click',
            event => {

                event.preventDefault();
                event.stopPropagation();

                if (step.id) {
                    presentation.goto(step.id);
                }

            }
        );


        nav.appendChild(button);

    });

}

function updateStepNavigation(activeStep) {

    const nav =
        $('#step-nav');

    if (!nav || !activeStep) return;


    const buttons = [
        ...nav.querySelectorAll('button')
    ];


    const activeIndex =
        buttons.findIndex(
            button =>
                button.dataset.target ===
                activeStep.id
        );


    if (activeIndex === -1) return;


    /* Ștergem separatorii existenți */

    nav.querySelectorAll(
        '.nav-ellipsis'
    ).forEach(
        element => element.remove()
    );


    /* Stabilim ce butoane rămân vizibile */

    buttons.forEach(
        (button, index) => {

            const active =
                index === activeIndex;

            button.classList.toggle(
                'active',
                active
            );

            button.setAttribute(
                'aria-current',
                active ? 'step' : 'false'
            );


            const visible =
                index === 0 ||
                index === buttons.length - 1 ||
                Math.abs(
                    index - activeIndex
                ) <= 2;


            button.style.display =
                visible
                    ? 'flex'
                    : 'none';

        }
    );


    /* Luăm doar butoanele vizibile */

    const visibleButtons =
        buttons.filter(
            button =>
                button.style.display !== 'none'
        );


    /* Adăugăm ⋮ între grupurile separate */

    visibleButtons.forEach(
        (button, index) => {

            if (index === 0) return;


            const previous =
                visibleButtons[index - 1];

            const currentIndex =
                Number(button.dataset.index);

            const previousIndex =
                Number(previous.dataset.index);


            if (
                currentIndex -
                previousIndex > 1
            ) {

                const ellipsis =
                    document.createElement('span');

                ellipsis.className =
                    'nav-ellipsis';

                ellipsis.textContent =
                    '⋮';

                nav.insertBefore(
                    ellipsis,
                    button
                );

            }

        }
    );

}


/* =========================================================
   6. EDUCATION WORKBENCHES
   ========================================================= */

function initWorkbench(workbench) {
    const filterButtons = $$('.control-options button', workbench);
    const objectiveButtons = $$('.objective-item', workbench);
    const solutionCards = $$('.solution-card', workbench);
    const resourceButtons = $$('.resource-item', workbench);

    const resetButton = $('.workbench-reset', workbench);
    const statusText = $('.solution-status-text, #solution-status-text', workbench);
    const solutionsGrid = $('.solutions-grid', workbench);

    if (!solutionCards.length) return;

    const initialObjective =
        objectiveButtons.find(button => button.classList.contains('active')) ||
        objectiveButtons[0] ||
        null;

    const initialResourceState = resourceButtons.map(button =>
        button.classList.contains('active')
    );

    const selection = {
        tool: null,
        method: null,
        form: null,
        objective: initialObjective?.dataset.objective || null
    };

    function scrollSolutionsToTop() {
        if (solutionsGrid) {
            solutionsGrid.scrollTop = 0;
        }
    }

    function updateSolutions() {
        let exactMatches = 0;
        let bestScore = -1;
        let closestCards = [];

        solutionCards.forEach(card => {
            card.classList.remove('match', 'closest-match');

            const tools = splitDataValues(card, 'tools');
            const methods = splitDataValues(card, 'methods');
            const forms = splitDataValues(card, 'forms');
            const objectives = splitDataValues(card, 'objectives');

            const matches = {
                tool: !selection.tool || tools.includes(selection.tool),
                method: !selection.method || methods.includes(selection.method),
                form: !selection.form || forms.includes(selection.form),
                objective: !selection.objective || objectives.includes(selection.objective)
            };

            const exactMatch = Object.values(matches).every(Boolean);

            if (exactMatch) {
                card.classList.add('match');
                exactMatches += 1;
            }

            let score = 0;

            if (selection.tool && tools.includes(selection.tool)) score += 3;
            if (selection.method && methods.includes(selection.method)) score += 3;
            if (selection.form && forms.includes(selection.form)) score += 3;
            if (selection.objective && objectives.includes(selection.objective)) score += 4;

            if (score > bestScore) {
                bestScore = score;
                closestCards = [card];
            } else if (score === bestScore) {
                closestCards.push(card);
            }
        });

        if (exactMatches === 0) {
            closestCards
                .slice(0, 2)
                .forEach(card => card.classList.add('closest-match'));

            if (statusText) {
                statusText.textContent =
                    'Nu există o potrivire exactă. Sunt evidențiate cele mai apropiate soluții candidate.';
            }

            return;
        }

        if (!statusText) return;

        const filtersUsed = [
            selection.tool,
            selection.method,
            selection.form
        ].filter(Boolean).length;

        if (filtersUsed === 0) {
            statusText.textContent =
                `${exactMatches} soluții sunt compatibile cu obiectivul selectat.`;
        } else if (exactMatches === 1) {
            statusText.textContent =
                '1 soluție candidat corespunde selecției.';
        } else {
            statusText.textContent =
                `${exactMatches} soluții candidate corespund selecției.`;
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const group = button.closest('[data-filter-group]');
            if (!group) return;

            const groupName = group.dataset.filterGroup;
            if (!Object.prototype.hasOwnProperty.call(selection, groupName)) return;

            const alreadySelected = button.classList.contains('active');

            $$('button', group).forEach(item => item.classList.remove('active'));

            if (alreadySelected) {
                selection[groupName] = null;
            } else {
                button.classList.add('active');
                selection[groupName] = button.dataset.value || null;
            }

            updateSolutions();
            scrollSolutionsToTop();
        });
    });

    objectiveButtons.forEach(button => {
        button.addEventListener('click', () => {
            objectiveButtons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');

            selection.objective = button.dataset.objective || null;

            updateSolutions();
            scrollSolutionsToTop();
        });
    });

    resourceButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });
    });

    resetButton?.addEventListener('click', () => {
        selection.tool = null;
        selection.method = null;
        selection.form = null;
        selection.objective = initialObjective?.dataset.objective || null;

        filterButtons.forEach(button => button.classList.remove('active'));

        objectiveButtons.forEach(button => {
            button.classList.toggle('active', button === initialObjective);
        });

        resourceButtons.forEach((button, index) => {
            button.classList.toggle('active', initialResourceState[index] ?? false);
        });

        scrollSolutionsToTop();
        updateSolutions();
    });

    updateSolutions();
}

function initWorkbenches() {
    $$('.education-workbench-step').forEach(initWorkbench);
}


/* =========================================================
   7. INFORMATION MODE
   ========================================================= */

function updateInformationMode(activeStep) {
    const steps = $$('#impress .step');
    const transitionStep = $('#info-materie-prima');

    if (!activeStep || !transitionStep) {
        document.body.classList.remove('information-mode');
        return;
    }

    const currentIndex = steps.indexOf(activeStep);
    const transitionIndex = steps.indexOf(transitionStep);

    document.body.classList.toggle(
        'information-mode',
        currentIndex >= transitionIndex && transitionIndex !== -1
    );
}


/* =========================================================
   8. SOLUTION SPACE → AI TRANSITION
   ========================================================= */

function initAITransition() {
    const step = $('#solution-space-transition');
    if (!step) return null;

    const universe = $('#solution-universe', step);
    const expandButton = $('#expand-with-ai', step);
    const askButton = $('#ask-what-ai', step);

    const generatedLabels = [
        'variantă', 'analogie', 'exercițiu', 'întrebare', 'feedback',
        'resursă', 'diagramă', 'exemplu', 'traseu', 'simulare',
        'clasificare', 'recomandare', 'adaptare', 'explicație',
        'evaluare', 'comparație', 'ipoteză', 'strategie', 'remediere',
        'activitate'
    ];

    let thesisTimer = null;

    function createGeneratedNodes() {
        if (!universe || $('.ai-generated-node', universe)) return;

        const fragment = document.createDocumentFragment();

        for (let index = 0; index < 42; index += 1) {
            const node = document.createElement('span');

            /*
               Poziționare deterministă: distribuție pseudo-radială
               fără Math.random(), astfel încât demo-ul să arate la fel
               la fiecare rulare.
            */
            const x = 4 + ((index * 37) % 92);
            const y = 5 + ((index * 53) % 88);

            node.className = 'ai-generated-node';
            node.textContent = generatedLabels[index % generatedLabels.length];
            node.style.left = `${x}%`;
            node.style.top = `${y}%`;
            node.style.animationDelay = `${index * 18}ms`;

            fragment.appendChild(node);
        }

        universe.appendChild(fragment);
    }

    function reset() {
        if (thesisTimer !== null) {
            window.clearTimeout(thesisTimer);
            thesisTimer = null;
        }

        step.classList.remove('ai-expanded', 'show-thesis');
        $$('.ai-generated-node', step).forEach(node => node.remove());
    }

    expandButton?.addEventListener('click', () => {
        if (step.classList.contains('ai-expanded')) return;

        createGeneratedNodes();
        step.classList.add('ai-expanded');

        thesisTimer = window.setTimeout(() => {
            step.classList.add('show-thesis');
            thesisTimer = null;
        }, 1450);
    });

    askButton?.addEventListener('click', () => {
        const explicitTarget = $('#what-is-ai');
        const steps = $$('#impress .step');
        const currentIndex = steps.indexOf(step);
        const nextStep = explicitTarget || steps[currentIndex + 1] || null;

        if (nextStep?.id) {
            presentation.goto(nextStep.id);
        }
    });

    return { step, reset };
}


/* =========================================================
   PARTEA II · INTRO BINAR + LABORATOR REPREZENTĂRI
   ========================================================= */

function initBinaryIntro() {
    const step = $('#ai-language-intro');
    if (!step) return null;

    const trigger = $('#binary-decode-trigger', step);
    const nextButton = $('#binary-intro-next', step);

    let stage = 0;

    function render() {
        step.dataset.decodeStage = String(stage);
    }

    function reset() {
        stage = 0;
        render();
    }

    trigger?.addEventListener('click', () => {
        if (stage < 3) {
            stage += 1;
        }

        render();
    });

    nextButton?.addEventListener('click', () => {
        const target = $('#binary-representation');

        if (target?.id) {
            presentation.goto(target.id);
        }
    });

    render();

    return {
        step,
        reset
    };
}


function initRepresentationLab() {
    const step = $('#binary-representation');
    if (!step) return null;

    const cards = $$('.rep-card', step);

    const progressText =
        $('#representation-progress-text', step);

    const progressFill =
        $('#representation-progress-fill', step);

    const teaserButton =
        $('#algorithm-teaser-button', step);

    const explored = new Set();


    function render() {
        cards.forEach(card => {
            const key = card.dataset.representation;
            const open = explored.has(key);

            card.classList.toggle(
                'is-explored',
                open
            );

            card.setAttribute(
                'aria-expanded',
                String(open)
            );
        });


        const count = explored.size;

        if (progressText) {
            progressText.textContent =
                `${count} / ${cards.length} explorate`;
        }

        if (progressFill) {
            const percent =
                cards.length
                    ? count / cards.length * 100
                    : 0;

            progressFill.style.width =
                `${percent}%`;
        }


        step.classList.toggle(
            'is-complete',
            count === cards.length
        );
    }


    function reset() {
        explored.clear();

        step.classList.remove(
            'is-complete',
            'show-algorithm-teaser'
        );

        teaserButton?.setAttribute(
            'aria-expanded',
            'false'
        );

        render();
    }


    cards.forEach(card => {
        card.addEventListener('click', () => {

            const key =
                card.dataset.representation;

            if (!key) return;


            if (explored.has(key)) {
                explored.delete(key);
            } else {
                explored.add(key);
            }


            step.classList.remove(
                'show-algorithm-teaser'
            );

            teaserButton?.setAttribute(
                'aria-expanded',
                'false'
            );

            render();
        });
    });


    teaserButton?.addEventListener(
        'click',
        () => {

            if (
                !step.classList.contains(
                    'is-complete'
                )
            ) {
                return;
            }

            const shown =
                step.classList.toggle(
                    'show-algorithm-teaser'
                );

            teaserButton.setAttribute(
                'aria-expanded',
                String(shown)
            );
        }
    );


    render();

    return {
        step,
        reset
    };
}


/* =========================================================
   9. GLOBAL EVENTS
   ========================================================= */

let aiTransitionController = null;

function initAlgorithmSlide() {

    const step =
        document.querySelector('#algorithm-basics');

    if (!step) return null;


    const valueNodes = [
        ...step.querySelectorAll(
            '#algorithm-values [data-value]'
        )
    ];

    const processSteps = [
        ...step.querySelectorAll(
            '[data-algorithm-step]'
        )
    ];

    const runButton =
        step.querySelector('#run-algorithm');

    const changeButton =
        step.querySelector(
            '#algorithm-change-values'
        );

    const stateMain =
        step.querySelector(
            '#algorithm-state-main'
        );

    const stateDetail =
        step.querySelector(
            '#algorithm-state-detail'
        );

    const resultValue =
        step.querySelector(
            '#algorithm-result-value'
        );


    const datasets = [
        [12, 7, 19],
        [34, 56, 21],
        [91, 18, 63],
        [8, 42, 17],
        [27, 27, 11]
    ];

    let datasetIndex = 0;
    let running = false;
    let timers = [];


    function values() {
        return valueNodes.map(
            node => Number(node.dataset.value)
        );
    }


    function clearTimers() {
        timers.forEach(
            timer => clearTimeout(timer)
        );

        timers = [];
    }


    function updateValues(data) {

        valueNodes.forEach((node, index) => {

            node.dataset.value =
                String(data[index]);

            node.textContent =
                String(data[index]);
        });
    }


    function clearVisualState() {

        valueNodes.forEach(node => {
            node.classList.remove(
                'is-candidate',
                'is-result'
            );
        });

        processSteps.forEach(node => {
            node.classList.remove(
                'is-active',
                'is-complete'
            );
        });

        step.classList.remove(
            'algorithm-finished',
            'show-ai-answer'
        );

        if (stateMain) {
            stateMain.textContent = '—';
        }

        if (stateDetail) {
            stateDetail.textContent =
                'Apasă „Rulează algoritmul”.';
        }

        if (resultValue) {
            resultValue.textContent = '?';
        }
    }


    function activateStep(number) {

        processSteps.forEach(
            (node, index) => {

                const current =
                    index + 1;

                node.classList.toggle(
                    'is-active',
                    current === number
                );

                node.classList.toggle(
                    'is-complete',
                    current < number
                );
            }
        );
    }


    function finishSteps() {

        processSteps.forEach(node => {
            node.classList.remove(
                'is-active'
            );

            node.classList.add(
                'is-complete'
            );
        });
    }


    function later(fn, delay) {

        const timer =
            setTimeout(fn, delay);

        timers.push(timer);
    }


    function run() {

        if (running) return;

        running = true;

        clearTimers();
        clearVisualState();


        const data = values();

        let candidate = data[0];


        /* PAS 1 */

        activateStep(1);

        if (stateMain) {
            stateMain.textContent =
                `a = ${data[0]}, b = ${data[1]}, c = ${data[2]}`;
        }

        if (stateDetail) {
            stateDetail.textContent =
                'Algoritmul citește datele de intrare.';
        }


        /* PAS 2 */

        later(() => {

            activateStep(2);

            candidate = data[0];

            valueNodes[0].classList.add(
                'is-candidate'
            );

            if (stateMain) {
                stateMain.textContent =
                    `max = ${candidate}`;
            }

            if (stateDetail) {
                stateDetail.textContent =
                    'Prima valoare devine candidatul inițial.';
            }

        }, 850);


        /* PAS 3A */

        later(() => {

            activateStep(3);

            if (stateMain) {
                stateMain.textContent =
                    `${data[1]} > ${candidate} ?`;
            }

            if (data[1] > candidate) {

                valueNodes.forEach(node =>
                    node.classList.remove(
                        'is-candidate'
                    )
                );

                candidate = data[1];

                valueNodes[1].classList.add(
                    'is-candidate'
                );

                if (stateDetail) {
                    stateDetail.textContent =
                        `Da → max devine ${candidate}.`;
                }

            } else {

                if (stateDetail) {
                    stateDetail.textContent =
                        `Nu → max rămâne ${candidate}.`;
                }
            }

        }, 1700);


        /* PAS 3B */

        later(() => {

            if (stateMain) {
                stateMain.textContent =
                    `${data[2]} > ${candidate} ?`;
            }

            if (data[2] > candidate) {

                valueNodes.forEach(node =>
                    node.classList.remove(
                        'is-candidate'
                    )
                );

                candidate = data[2];

                valueNodes[2].classList.add(
                    'is-candidate'
                );

                if (stateDetail) {
                    stateDetail.textContent =
                        `Da → max devine ${candidate}.`;
                }

            } else {

                if (stateDetail) {
                    stateDetail.textContent =
                        `Nu → max rămâne ${candidate}.`;
                }
            }

        }, 2550);


        /* PAS 4 */

        later(() => {

            activateStep(4);

            const maximum =
                Math.max(...data);

            valueNodes.forEach(node => {

                node.classList.remove(
                    'is-candidate'
                );

                if (
                    Number(node.dataset.value) ===
                    maximum
                ) {
                    node.classList.add(
                        'is-result'
                    );
                }
            });


            if (stateMain) {
                stateMain.textContent =
                    `max = ${maximum}`;
            }

            if (stateDetail) {
                stateDetail.textContent =
                    'Algoritmul a ajuns la rezultat.';
            }

            if (resultValue) {
                resultValue.textContent =
                    String(maximum);
            }

        }, 3400);


        /* FINAL */

        later(() => {

            finishSteps();

            step.classList.add(
                'algorithm-finished'
            );

            running = false;

        }, 4050);
    }


    function changeValues() {

        if (running) return;

        clearTimers();

        datasetIndex =
            (datasetIndex + 1) %
            datasets.length;

        updateValues(
            datasets[datasetIndex]
        );

        clearVisualState();
    }


    function reset() {

        clearTimers();

        running = false;

        datasetIndex = 0;

        updateValues(
            datasets[0]
        );

        clearVisualState();
    }


    runButton?.addEventListener(
        'click',
        run
    );


    changeButton?.addEventListener(
        'click',
        changeValues
    );


    reset();

    const nextQuestion =
    step.querySelector('#algorithm-next-question');


nextQuestion?.addEventListener(
    'click',
    () => {

        const target =
            document.querySelector(
                '#rules-to-learning'
            );

        if (target?.id) {
            presentation.goto(target.id);
        }

    }
);


    return {
        step,
        reset
    };
}

function initGlobalEvents() {
    document.addEventListener('impress:stepenter', handleStepEnter);

    document.addEventListener('keydown', event => {
        if (event.key.toLowerCase() === 'n') {
            document.body.classList.toggle('nav-hidden');
        }
    });
}


function initRulesToLearningSlide() {

    const step =
        document.querySelector(
            '#rules-to-learning'
        );

    if (!step) return null;


    const tryButton =
        step.querySelector(
            '#try-cat-rules'
        );

    const changeApproach =
        step.querySelector(
            '#change-approach'
        );

    const continueButton =
        step.querySelector(
            '#continue-to-ai'
        );

    const catSymbol =
        step.querySelector(
            '#cat-symbol'
        );

    const exampleLabel =
        step.querySelector(
            '#cat-example-label'
        );

    const rules = [
        ...step.querySelectorAll(
            '.cat-rule'
        )
    ];

    const counterexample =
        step.querySelector(
            '#rule-counterexample'
        );

    const counterTitle =
        step.querySelector(
            '#rule-counterexample-title'
        );

    const counterText =
        step.querySelector(
            '#rule-counterexample-text'
        );


    const examples = [

        {
            symbol: '🐈',
            label: 'pisică obișnuită',
            rule: 0,

            title:
                'Urechile nu sunt suficiente.',

            text:
                'Multe alte animale au urechi triunghiulare.'
        },

        {
            symbol: '🐕',
            label: 'alt animal cu blană',
            rule: 1,

            title:
                'Blana nu definește o pisică.',

            text:
                'Câinii, iepurii și multe alte animale au blană.'
        },

        {
            symbol: '🦭',
            label: 'variațiile reale complică regulile',
            rule: 2,

            title:
                'O caracteristică poate lipsi sau poate fi greu de observat.',

            text:
                'Imaginea, unghiul sau vizibilitatea schimbă ceea ce putem detecta.'
        },

        {
            symbol: '🐈',
            label: 'pisica poate fi parțial ascunsă',
            rule: 3,

            title:
                'Nici numărul de picioare vizibile nu este sigur.',

            text:
                'Obiectul poate fi văzut dintr-un unghi neobișnuit sau poate fi parțial ascuns.'
        }

    ];


    let stage = 0;


    function clearRules() {

        rules.forEach(rule => {
            rule.classList.remove(
                'is-active',
                'is-rejected'
            );
        });

    }


    function reset() {

        stage = 0;

        step.classList.remove(
            'rules-started',
            'rules-exhausted',
            'show-learning',
            'show-ai-transition'
        );

        clearRules();

        if (counterexample) {
            counterexample.classList.remove(
                'is-visible'
            );
        }

        if (catSymbol) {
            catSymbol.textContent = '🐈';
        }

        if (exampleLabel) {
            exampleLabel.textContent =
                'exemplul 1';
        }

        if (tryButton) {
            tryButton.textContent =
                'Încearcă să scrii regulile';
        }
    }


    function showExample(index) {

        const example =
            examples[index];

        if (!example) return;


        step.classList.add(
            'rules-started'
        );


        clearRules();


        const currentRule =
            rules[example.rule];

        if (currentRule) {

            currentRule.classList.add(
                'is-active'
            );

            setTimeout(() => {
                currentRule.classList.add(
                    'is-rejected'
                );
            }, 250);
        }


        if (catSymbol) {

            catSymbol.style.transform =
                'scale(.82)';

            catSymbol.style.opacity = '.25';

            setTimeout(() => {

                catSymbol.textContent =
                    example.symbol;

                catSymbol.style.transform =
                    'scale(1)';

                catSymbol.style.opacity = '1';

            }, 180);
        }


        if (exampleLabel) {

            exampleLabel.textContent =
                example.label;
        }


        if (counterTitle) {
            counterTitle.textContent =
                example.title;
        }

        if (counterText) {
            counterText.textContent =
                example.text;
        }

        counterexample?.classList.add(
            'is-visible'
        );
    }


    tryButton?.addEventListener(
        'click',
        () => {

            if (stage < examples.length) {

                showExample(stage);

                stage += 1;


                if (stage < examples.length) {

                    tryButton.textContent =
                        'Mai adăugăm o regulă...';

                } else {

                    tryButton.textContent =
                        'Regulile continuă la nesfârșit...';

                    step.classList.add(
                        'rules-exhausted'
                    );
                }

            }

        }
    );


    changeApproach?.addEventListener(
        'click',
        () => {

            step.classList.add(
                'show-learning'
            );

            setTimeout(() => {

                step.classList.add(
                    'show-ai-transition'
                );

            }, 600);

        }
    );


    continueButton?.addEventListener(
    'click',
    () => {

        const target =
            document.querySelector(
                '#algorithm-vs-symbolic'
            );

        if (target?.id) {
            presentation.goto(target.id);
        }

    }
);


    reset();


    return {
        step,
        reset
    };
}

function initAlgorithmVsSymbolicSlide() {

    const step =
        document.querySelector('#algorithm-vs-symbolic');

    if (!step) return null;

    const continueButton =
        step.querySelector('#continue-from-symbolic');

    continueButton?.addEventListener(
        'click',
        event => {

            event.preventDefault();
            event.stopPropagation();

            const target =
                document.querySelector('#what-is-ai');

            if (target?.id) {
                presentation.goto(target.id);
            }

        }
    );

    return {
        step,
        reset() {}
    };
}

function initIntelligenceAxisSlide() {

    const step =
        document.querySelector('#ai-agi-asi');

    if (!step) return null;


    const points = [
        ...step.querySelectorAll(
            '.intelligence-point'
        )
    ];

    const panels = [
        ...step.querySelectorAll(
            '.intelligence-panel'
        )
    ];


    function activate(key) {

        points.forEach(point => {

            point.classList.toggle(
                'is-active',
                point.dataset.intelligence === key
            );

        });


        panels.forEach(panel => {

            panel.classList.toggle(
                'is-active',
                panel.dataset.panel === key
            );

        });

    }


    points.forEach(point => {

        point.addEventListener(
            'click',
            () => {

                activate(
                    point.dataset.intelligence
                );

            }
        );

    });


    function reset() {

        points.forEach(
            point =>
                point.classList.remove('is-active')
        );

        panels.forEach(
            panel =>
                panel.classList.remove('is-active')
        );

    }


    reset();


    return {
        step,
        reset
    };
}

function initWhatIsAISlide() {

    const step =
        document.querySelector('#what-is-ai');

    if (!step) return null;

    const continueButton =
        step.querySelector(
            '#continue-to-intelligence-axis'
        );

    continueButton?.addEventListener(
        'click',
        event => {

            event.preventDefault();
            event.stopPropagation();

            const target =
                document.querySelector('#ai-agi-asi');

            if (target?.id) {
                presentation.goto(target.id);
            }

        }
    );

    return {
        step,
        reset() {}
    };
}

function initAIAxesLayersSlide() {

    const step =
        document.querySelector('#ai-axes-intro');

    if (!step) return null;


    const sheets = [
        ...step.querySelectorAll('.axis-sheet')
    ];

    const dendrograms = [
        ...step.querySelectorAll('.axis-dendrogram')
    ];

    const resetButton =
        step.querySelector('#reset-ai-axes');


    function hideDendrograms() {

        dendrograms.forEach(tree => {
            tree.classList.remove('is-visible');
        });

    }


    function reset() {

        step.classList.remove('sheet-focus');

        sheets.forEach(sheet => {

            sheet.classList.remove(
                'is-selected',
                'is-hidden'
            );

        });

        hideDendrograms();

    }


    function focusSheet(selectedSheet) {

        const axis =
            selectedSheet.dataset.axis;

        if (!axis) return;


        step.classList.add('sheet-focus');


        sheets.forEach(sheet => {

            const selected =
                sheet === selectedSheet;

            sheet.classList.toggle(
                'is-selected',
                selected
            );

            sheet.classList.toggle(
                'is-hidden',
                !selected
            );

        });


        dendrograms.forEach(tree => {

            tree.classList.toggle(
                'is-visible',
                tree.dataset.axisTree === axis
            );

        });

    }


    sheets.forEach(sheet => {

        sheet.addEventListener(
            'click',
            event => {

                event.preventDefault();
                event.stopPropagation();


                const alreadySelected =
                    sheet.classList.contains(
                        'is-selected'
                    );


                if (
                    step.classList.contains(
                        'sheet-focus'
                    ) &&
                    alreadySelected
                ) {

                    reset();
                    return;

                }


                focusSheet(sheet);

            }
        );

    });


    resetButton?.addEventListener(
        'click',
        event => {

            event.preventDefault();
            event.stopPropagation();

            reset();

        }
    );


    reset();


    return {
        step,
        reset
    };

}

function initAISystemProfileSlide() {

    const step =
        document.querySelector('#ai-system-profile');

    if (!step) return null;


    const exampleButtons = [
        ...step.querySelectorAll('.profile-example')
    ];

    const propertyButtons = [
        ...step.querySelectorAll('.profile-property')
    ];

    const sheets = [
        ...step.querySelectorAll('.profile-sheet')
    ];


    const name =
        step.querySelector('#profile-example-name');

    const type =
        step.querySelector('#profile-example-type');

    const description =
        step.querySelector('#profile-example-description');


    const fields = {
        approach:
            step.querySelector('#profile-approach'),

        learning:
            step.querySelector('#profile-learning'),

        model:
            step.querySelector('#profile-model'),

        capability:
            step.querySelector('#profile-capability'),

        modality:
            step.querySelector('#profile-modality')
    };


    const examples = {

        expert: {
            type:
                'EXEMPLUL 1',

            name:
                'Sistem expert',

            description:
                'Cunoașterea și regulile sunt reprezentate explicit.',

            approach:
                'Symbolic AI',

            learning:
                'Reguli definite explicit',

            model:
                'Bază de cunoștințe + motor de inferență',

            capability:
                'Inferență / recomandare',

            modality:
                'Fapte și date structurate'
        },


        vision: {
            type:
                'EXEMPLUL 2',

            name:
                'Clasificator de imagini',

            description:
                'Modelul învață regularități din exemple etichetate.',

            approach:
                'Machine Learning · data-driven',

            learning:
                'Supervised learning',

            model:
                'Rețea neuronală · CNN',

            capability:
                'Recunoaștere / clasificare',

            modality:
                'Imagine'
        },


        llm: {
            type:
                'EXEMPLUL 3',

            name:
                'Large Language Model',

            description:
                'Un model neuronal antrenat pe volume mari de text pentru a modela și genera limbaj.',

            approach:
                'Data-driven · neural AI',

            learning:
                'Self-supervised pretraining + post-training',

            model:
                'Transformer',

            capability:
                'Generare și transformare de limbaj',

            modality:
                'Text'
        }

    };


    function clearAxisHighlight() {

        sheets.forEach(sheet =>
            sheet.classList.remove('is-active')
        );

        propertyButtons.forEach(button =>
            button.classList.remove('is-active')
        );

    }


    function highlightAxis(axis) {

        clearAxisHighlight();


        const sheet =
            sheets.find(
                item =>
                    item.dataset.axis === axis
            );

        const property =
            propertyButtons.find(
                item =>
                    item.dataset.axis === axis
            );


        sheet?.classList.add('is-active');

        property?.classList.add('is-active');

    }


    function showExample(key) {

        const example =
            examples[key];

        if (!example) return;


        type.textContent =
            example.type;

        name.textContent =
            example.name;

        description.textContent =
            example.description;


        Object.keys(fields).forEach(axis => {

            if (fields[axis]) {
                fields[axis].textContent =
                    example[axis];
            }

        });


        exampleButtons.forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.example === key
            );

        });


        clearAxisHighlight();

    }


    exampleButtons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                showExample(
                    button.dataset.example
                );

            }
        );

    });


    propertyButtons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                highlightAxis(
                    button.dataset.axis
                );

            }
        );

    });


    function reset() {

        showExample('expert');

    }


    reset();


    return {
        step,
        reset
    };
}

function initLLMLimitsSlide() {

    const step =
        document.querySelector('#llm-limits');

    if (!step) return null;


    const cards = [
        ...step.querySelectorAll('.limit-card')
    ];


    const type =
        step.querySelector('#limits-example-type');

    const title =
        step.querySelector('#limits-example-title');

    const text =
        step.querySelector('#limits-example-text');


    const examples = {

        hallucination: {
            type:
                'HALUCINAȚIE',

            title:
                'O sursă care nu există',

            text:
                'Modelul poate inventa un articol, un autor sau un DOI care arată perfect plauzibil, deși sursa nu există.'
        },


        reasoning: {
            type:
                'RAȚIONAMENT INCONSISTENT',

            title:
                'Explicație bună. Rezultat greșit.',

            text:
                'Modelul poate construi o succesiune convingătoare de pași, dar una dintre premise sau operații poate fi greșită.'
        },


        context: {
            type:
                'SENSIBILITATE LA CONTEXT',

            title:
                'Aceeași problemă, altă formulare',

            text:
                'Modificarea instrucțiunii, ordinii informației sau contextului poate schimba semnificativ răspunsul.'
        },


        knowledge: {
            type:
                'CUNOAȘTERE INCOMPLETĂ',

            title:
                'Modelul nu știe automat ce este adevărat acum',

            text:
                'Informația poate lipsi, poate fi neactualizată sau poate necesita acces la surse externe pentru verificare.'
        },


        bias: {
            type:
                'BIAS',

            title:
                'Datele nu sunt neutre',

            text:
                'Distribuția și calitatea datelor de antrenare pot influența tiparele reproduse de model și răspunsurile generate.'
        }

    };


    function activate(key) {

        const example =
            examples[key];

        if (!example) return;


        cards.forEach(card => {

            card.classList.toggle(
                'is-active',
                card.dataset.limit === key
            );

        });


        type.textContent =
            example.type;

        title.textContent =
            example.title;

        text.textContent =
            example.text;

    }


    cards.forEach(card => {

        card.addEventListener(
            'click',
            () => {

                activate(
                    card.dataset.limit
                );

            }
        );

    });


    function reset() {

        cards.forEach(
            card =>
                card.classList.remove('is-active')
        );

        type.textContent =
            'SELECTEAZĂ O EROARE';

        title.textContent =
            '—';

        text.textContent =
            'Aici apare un exemplu concret.';

    }


    reset();


    return {
        step,
        reset
    };
}

function initAICapabilitiesSlide() {

    const step =
        document.querySelector('#ai-capabilities');

    if (!step) return null;


    const nodes = [
        ...step.querySelectorAll(
            '.capability-node'
        )
    ];


    const center =
        step.querySelector(
            '#capability-center'
        );

    const label =
        step.querySelector(
            '#capability-center-label'
        );

    const title =
        step.querySelector(
            '#capability-center-title'
        );

    const example =
        step.querySelector(
            '#capability-center-example'
        );


    const capabilities = {

        perception: {
            title: 'PERCEPȚIE',
            example:
                'Detectarea obiectelor într-o imagine sau a unui semnal într-un flux audio.'
        },

        recognition: {
            title: 'RECUNOAȘTERE',
            example:
                'Identificarea unei fețe, a unei boli sau a unei categorii de obiecte.'
        },

        learning: {
            title: 'ÎNVĂȚARE',
            example:
                'Descoperirea de regularități în exemple și ajustarea modelului pe baza lor.'
        },

        prediction: {
            title: 'PREDICȚIE',
            example:
                'Estimarea cererii, a riscului sau a unei valori viitoare.'
        },

        reasoning: {
            title: 'INFERENȚĂ',
            example:
                'Combinarea unor fapte sau reguli pentru a ajunge la o concluzie.'
        },

        planning: {
            title: 'PLANIFICARE',
            example:
                'Construirea unei succesiuni de pași pentru atingerea unui obiectiv.'
        },

        language: {
            title: 'LIMBAJ',
            example:
                'Traducere, rezumare, analiză și generare de text.'
        },

        generation: {
            title: 'GENERARE',
            example:
                'Crearea de text, imagini, audio, video sau cod.'
        },

        decision: {
            title: 'DECIZIE',
            example:
                'Compararea variantelor și recomandarea unei opțiuni.'
        },

        action: {
            title: 'ACȚIUNE',
            example:
                'Controlul unui robot, al unui vehicul sau al unui proces software.'
        }

    };


    function activate(key) {

        const capability =
            capabilities[key];

        if (!capability) return;


        nodes.forEach(node => {

            node.classList.toggle(
                'is-active',
                node.dataset.capability === key
            );

        });


        if (label) {
            label.textContent =
                'CAPABILITATE';
        }

        if (title) {
            title.textContent =
                capability.title;
        }

        if (example) {
            example.textContent =
                capability.example;
        }

        center?.classList.add(
            'is-active'
        );

    }


    nodes.forEach(node => {

        node.addEventListener(
            'click',
            () => {

                activate(
                    node.dataset.capability
                );

            }
        );

    });


    function reset() {

        nodes.forEach(node => {
            node.classList.remove(
                'is-active'
            );
        });

        center?.classList.remove(
            'is-active'
        );

        if (label) {
            label.textContent =
                'SISTEM AI';
        }

        if (title) {
            title.textContent =
                'AI';
        }

        if (example) {
            example.textContent =
                'Selectează o capabilitate.';
        }

    }


    reset();


    return {
        step,
        reset
    };
}

function initEducationUsecaseSlides() {

    const slides =
        document.querySelectorAll('.education-usecase-step');

    if (!slides.length) {
        return null;
    }


    slides.forEach((slide) => {

        const options =
            [...slide.querySelectorAll('.edu-option')];

        const detailMain =
            slide.querySelector('.edu-detail-main');

        const detailTitle =
            slide.querySelector('.edu-detail-title');

        const detailAction =
            slide.querySelector('.edu-detail-action');

        const detailBenefit =
            slide.querySelector('.edu-detail-benefit');

        const detailUse =
            slide.querySelector('.edu-detail-use');


        if (
            !options.length ||
            !detailMain ||
            !detailTitle
        ) {
            return;
        }


        function selectOption(option, animate = true) {

            options.forEach((item) => {
                item.classList.remove('is-active');
            });

            option.classList.add('is-active');


            const updateContent = () => {

                detailTitle.textContent =
                    option.dataset.title || '';

                if (detailAction) {
                    detailAction.textContent =
                        option.dataset.action || '';
                }

                if (detailBenefit) {
                    detailBenefit.textContent =
                        option.dataset.benefit || '';
                }

                if (detailUse) {
                    detailUse.textContent =
                        option.dataset.use || '';
                }


                detailMain.classList.remove(
                    'is-changing'
                );

            };


            if (!animate) {

                updateContent();

                return;
            }


            detailMain.classList.add(
                'is-changing'
            );


            window.setTimeout(
                updateContent,
                170
            );

        }


        options.forEach((option) => {

            option.addEventListener(
                'click',
                () => selectOption(option)
            );

        });


        /* inițializare */

        const activeOption =
            slide.querySelector(
                '.edu-option.is-active'
            ) || options[0];


        if (activeOption) {
            selectOption(
                activeOption,
                false
            );
        }


        /* reset disponibil pentru controller */

        slide._educationUsecaseReset = () => {

            const firstOption =
                options[0];

            if (firstOption) {

                selectOption(
                    firstOption,
                    false
                );

            }

        };

    });


    return {

        resetSlide(step) {

            if (
                step &&
                typeof step._educationUsecaseReset ===
                    'function'
            ) {

                step._educationUsecaseReset();

            }

        }

    };

}

function initAnthropomorphismSlide() {

    const slide =
        document.querySelector('#ai-anthropomorphism');

    if (!slide) return null;

    const buttons =
        [...slide.querySelectorAll('.anthro-phrase')];

    const title =
        slide.querySelector('.anthro-tech-title');

    const description =
        slide.querySelector('.anthro-tech-description');


    function select(button) {

        buttons.forEach((item) => {
            item.classList.remove('is-active');
        });

        button.classList.add('is-active');

        title.textContent =
            button.dataset.concept || '';

        description.textContent =
            button.dataset.tech || '';
    }


    buttons.forEach((button) => {

        button.addEventListener(
            'click',
            () => select(button)
        );

    });


    return {
        reset() {
            if (buttons[0]) {
                select(buttons[0]);
            }
        }
    };
}

function initCorrectVsSuitableSlide() {

    const slide =
        document.querySelector('#correct-vs-suitable');

    if (!slide) return null;


    const options = [
        ...slide.querySelectorAll('.cvs-option')
    ];

    const subject =
        slide.querySelector('.cvs-subject');

    const question =
        slide.querySelector('.cvs-question');

    const answer =
        slide.querySelector('.cvs-answer');

    const problem =
        slide.querySelector('.cvs-problem');

    const criterion =
        slide.querySelector('.cvs-criterion-value');


    function select(option) {

        options.forEach(item => {
            item.classList.remove('is-active');
        });

        option.classList.add('is-active');

        subject.textContent =
            option.dataset.subject || '';

        question.textContent =
            option.dataset.question || '';

        answer.textContent =
            option.dataset.answer || '';

        problem.textContent =
            option.dataset.problem || '';

        criterion.textContent =
            option.dataset.criterion || '';
    }


    options.forEach(option => {

        option.addEventListener(
            'click',
            () => select(option)
        );

    });


    const initial =
        slide.querySelector('.cvs-option.is-active')
        || options[0];

    if (initial) {
        select(initial);
    }


    return {

        reset() {

            if (options[0]) {
                select(options[0]);
            }

        }

    };
}

function initTeacherFilterSlide() {

    const slide =
        document.querySelector('#teacher-filter');

    if (!slide) return null;


    const cards = [
        ...slide.querySelectorAll('.teacher-filter-card')
    ];

    const number =
        slide.querySelector('.filter-detail-number');

    const action =
        slide.querySelector('.filter-detail-action');

    const title =
        slide.querySelector('.filter-detail-title');

    const description =
        slide.querySelector('.filter-detail-description');

    const example =
        slide.querySelector('.filter-detail-example p');

    const aiType =
        slide.querySelector('.filter-detail-ai strong');


    function select(card) {

        cards.forEach(item => {
            item.classList.remove('is-active');
        });

        card.classList.add('is-active');

        number.textContent =
            card.dataset.number || '';

        action.textContent =
            card.dataset.action || '';

        title.textContent =
            card.dataset.title || '';

        description.textContent =
            card.dataset.description || '';

        example.textContent =
            card.dataset.example || '';

        if (aiType) {
            aiType.textContent =
                card.dataset.ai || '';
        }
    }


    cards.forEach(card => {

        card.addEventListener(
            'click',
            () => select(card)
        );

    });


    const initial =
        slide.querySelector(
            '.teacher-filter-card.is-active'
        ) || cards[0];

    if (initial) {
        select(initial);
    }


    return {

        reset() {

            if (cards[0]) {
                select(cards[0]);
            }

        }

    };
}

function initPredictionDecisionSlide() {

    const slide =
        document.querySelector('#prediction-vs-decision');

    if (!slide) return null;


    const cases = [
        ...slide.querySelectorAll('.pd-case')
    ];

    const type =
        slide.querySelector('.pd-ai-type');

    const input =
        slide.querySelector('.pd-input-text');

    const output =
        slide.querySelector('.pd-output-text');

    const decision =
        slide.querySelector('.pd-decision-text');

    const missing =
        slide.querySelector('.pd-missing-text');

    const dynamicIcon =
        slide.querySelector('.pd-dynamic-icon i');


    function select(item) {

        cases.forEach(caseItem => {
            caseItem.classList.remove('is-active');
        });

        item.classList.add('is-active');


        type.textContent =
            item.dataset.type || '';

        input.textContent =
            item.dataset.input || '';

        output.textContent =
            item.dataset.output || '';

        decision.textContent =
            item.dataset.decision || '';

        missing.textContent =
            item.dataset.missing || '';


        if (dynamicIcon) {

            dynamicIcon.className =
                'fa-solid ' +
                (item.dataset.icon || 'fa-microchip');

        }

    }


    cases.forEach(item => {

        item.addEventListener(
            'click',
            () => select(item)
        );

    });


    const initial =
        slide.querySelector('.pd-case.is-active')
        || cases[0];

    if (initial) {
        select(initial);
    }


    return {

        reset() {

            if (cases[0]) {
                select(cases[0]);
            }

        }

    };
}

function initRecommendationResponsibilitySlide() {

    const slide =
        document.querySelector(
            '#recommendation-vs-responsibility'
        );

    if (!slide) return null;


    const scenarios = [
        ...slide.querySelectorAll('.rr-scenario')
    ];

    const aiType =
        slide.querySelector('.rr-ai-type');

    const output =
        slide.querySelector('.rr-output');

    const action =
        slide.querySelector('.rr-action');

    const consequence =
        slide.querySelector('.rr-consequence');

    const responsibility =
        slide.querySelector('.rr-responsibility');

    const dynamicIcon =
        slide.querySelector('.rr-dynamic-icon i');


    function select(item) {

        scenarios.forEach(scenario => {
            scenario.classList.remove('is-active');
        });

        item.classList.add('is-active');


        if (aiType) {
            aiType.textContent =
                item.dataset.type || '';
        }

        if (output) {
            output.textContent =
                item.dataset.output || '';
        }

        if (action) {
            action.textContent =
                item.dataset.action || '';
        }

        if (consequence) {
            consequence.textContent =
                item.dataset.consequence || '';
        }

        if (responsibility) {
            responsibility.textContent =
                item.dataset.responsibility || '';
        }


        if (dynamicIcon) {

            dynamicIcon.className =
                'fa-solid ' +
                (
                    item.dataset.icon ||
                    'fa-microchip'
                );

        }

    }


    scenarios.forEach(item => {

        item.addEventListener(
            'click',
            () => select(item)
        );

    });


    const initial =
        slide.querySelector(
            '.rr-scenario.is-active'
        ) || scenarios[0];

    if (initial) {
        select(initial);
    }


    return {

        reset() {

            if (scenarios[0]) {
                select(scenarios[0]);
            }

        }

    };
}

function initTeacherActionsMapSlide() {

    const slide =
        document.querySelector('#teacher-actions-map');

    if (!slide) return null;


    const cards = [
        ...slide.querySelectorAll('.teacher-action-card')
    ];

    const title =
        slide.querySelector('.teacher-action-detail-title');

    const goal =
        slide.querySelector('.teacher-action-detail-goal');

    const ai =
        slide.querySelector('.teacher-action-detail-ai');

    const tools =
        slide.querySelector('.teacher-action-detail-tools');

    const demoBadge =
        slide.querySelector('#teacher-action-demo-badge');

    const demoPanel =
        slide.querySelector('#teacher-action-demo-panel');

    const demoLabel =
        slide.querySelector('.teacher-action-demo-label');

    const demoText =
        slide.querySelector('.teacher-action-demo-text');


    function select(card) {

        cards.forEach(item => {
            item.classList.remove('is-active');
        });

        card.classList.add('is-active');

        if (title) {
            title.textContent =
                card.dataset.title || '';
        }

        if (goal) {
            goal.textContent =
                card.dataset.goal || '';
        }

        if (ai) {
            ai.textContent =
                card.dataset.ai || '';
        }

        if (tools) {
            tools.textContent =
                card.dataset.tools || '';
        }

        const hasDemo =
            card.dataset.demo === 'yes';

        if (hasDemo) {

            demoBadge?.classList.remove('hidden');
            demoPanel?.classList.remove('hidden');

            if (demoLabel) {
                demoLabel.textContent =
                    card.dataset.demoLabel || 'DEMO';
            }

            if (demoText) {
                demoText.textContent =
                    card.dataset.demoDescription || '';
            }

        } else {

            demoBadge?.classList.add('hidden');
            demoPanel?.classList.add('hidden');
        }

    }


    cards.forEach(card => {

        card.addEventListener(
            'click',
            () => select(card)
        );

    });


    const initial =
        slide.querySelector(
            '.teacher-action-card.is-active'
        ) || cards[0];

    if (initial) {
        select(initial);
    }


    return {

        reset() {

            if (cards[0]) {
                select(cards[0]);
            }

        }

    };
}

function initPromptEngineeringDemo() {

    const slide =
        document.querySelector(
            '#demo-prompt-engineering'
        );

    if (!slide) return null;


    const buttons = [
        ...slide.querySelectorAll(
            '.prompt-level'
        )
    ];

    const label =
        slide.querySelector(
            '#prompt-demo-label'
        );

    const text =
        slide.querySelector(
            '#prompt-demo-text'
        );

    const meta =
        slide.querySelector(
            '#prompt-demo-meta'
        );

    const anatomyItems = [
        ...slide.querySelectorAll(
            '.prompt-anatomy-item'
        )
    ];


    const prompts = {

        1: {

            label:
                'PROMPT 01 · VAG',

            text:
`Creează o activitate despre variabile.`,

            parts: [
                'task'
            ],

            tags: [
                'cerință'
            ]

        },


        2: {

            label:
                'PROMPT 02 · CONTEXT',

            text:
`Creează o activitate de 20 de minute despre variabile pentru elevi începători care întâlnesc conceptul pentru prima dată.`,

            parts: [
                'task',
                'audience',
                'context'
            ],

            tags: [
                'cerință',
                'public',
                'context'
            ]

        },


        3: {

            label:
                'PROMPT 03 · SPECIFICAȚIE',

            text:
`Ești profesor de informatică.

Construiește o activitate de 20 de minute pentru elevi începători care învață pentru prima dată variabilele.

Obiectiv:
elevii să distingă numele variabilei de valoarea stocată.

Constrângeri:
• fără calculator;
• activitate participativă;
• fără concepte avansate.

Returnează:
1. obiectivul;
2. materialele;
3. pașii activității;
4. întrebările profesorului;
5. criteriul de reușită.`,

            parts: [
                'task',
                'audience',
                'context',
                'objective',
                'constraints',
                'format'
            ],

            tags: [
                'cerință',
                'public',
                'context',
                'obiectiv',
                'constrângeri',
                'format'
            ]

        }

    };


    function select(level) {

        const config =
            prompts[level];

        if (!config) return;


        buttons.forEach(button => {

            button.classList.toggle(
                'is-active',
                button.dataset.promptLevel ===
                    String(level)
            );

        });


        if (label) {
            label.textContent =
                config.label;
        }

        if (text) {
            text.textContent =
                config.text;
        }


        anatomyItems.forEach(item => {

            item.classList.toggle(
                'is-present',
                config.parts.includes(
                    item.dataset.part
                )
            );

        });


        if (meta) {

            meta.innerHTML =
                config.tags
                    .map(tag => `
                        <span>
                            <i class="fa-solid fa-check"></i>
                            ${tag}
                        </span>
                    `)
                    .join('');

        }

    }


    buttons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                select(
                    Number(
                        button.dataset.promptLevel
                    )
                );

            }
        );

    });


    select(1);


    return {

        reset() {
            select(1);
        }

    };
}


function handleStepEnter(event) {
    const activeStep = event.target;

    updateStepNavigation(activeStep);
    updateInformationMode(activeStep);

    /* Repornește demonstrația AI când revenim pe slide. */
    if (
        aiTransitionController &&
        activeStep === aiTransitionController.step
    ) {
        aiTransitionController.reset();
    }

    if (
    binaryIntroController &&
    activeStep === binaryIntroController.step
) {
    binaryIntroController.reset();
}

if (
    representationLabController &&
    activeStep === representationLabController.step
) {
    representationLabController.reset();
}

if (
    algorithmSlideController &&
    activeStep === algorithmSlideController.step
) {
    algorithmSlideController.reset();
}


if (
    rulesToLearningController &&
    activeStep ===
        rulesToLearningController.step
) {
    rulesToLearningController.reset();
}

if (
    algorithmVsSymbolicController &&
    activeStep ===
        algorithmVsSymbolicController.step
) {
    algorithmVsSymbolicController.reset();
}

if (
    intelligenceAxisController &&
    activeStep === intelligenceAxisController.step
) {
    intelligenceAxisController.reset();
}

if (
    aiAxesLayersController &&
    activeStep === aiAxesLayersController.step
) {
    aiAxesLayersController.reset();
}

if (
    aiSystemProfileController &&
    activeStep === aiSystemProfileController.step
) {
    aiSystemProfileController.reset();
}

if (
    llmLimitsController &&
    activeStep === llmLimitsController.step
) {
    llmLimitsController.reset();
}

if (
    aiCapabilitiesController &&
    activeStep === aiCapabilitiesController.step
) {
    aiCapabilitiesController.reset();
}

if (
    educationUsecaseController &&
    activeStep.classList.contains(
        'education-usecase-step'
    )
) {

    educationUsecaseController
        .resetSlide(activeStep);

}

if (
    anthropomorphismController &&
    activeStep.id === 'ai-anthropomorphism'
) {
    anthropomorphismController.reset();
}

if (
    correctVsSuitableController &&
    activeStep.id === 'correct-vs-suitable'
) {
    correctVsSuitableController.reset();
}

if (
    teacherFilterController &&
    activeStep.id === 'teacher-filter'
) {
    teacherFilterController.reset();
}

if (
    predictionDecisionController &&
    activeStep.id === 'prediction-vs-decision'
) {
    predictionDecisionController.reset();
}

if (
    recommendationResponsibilityController &&
    activeStep.id ===
        'recommendation-vs-responsibility'
) {
    recommendationResponsibilityController.reset();
}

if (
    teacherActionsMapController &&
    activeStep.id === 'teacher-actions-map'
) {
    teacherActionsMapController.reset();
}

if (
    promptEngineeringController &&
    activeStep.id ===
        'demo-prompt-engineering'
) {
    promptEngineeringController.reset();
}

}

let binaryIntroController = null;
let representationLabController = null;
let algorithmSlideController = null;
let rulesToLearningController = null;
let algorithmVsSymbolicController = null;
let intelligenceAxisController = null;
let whatIsAIController = null;
let aiAxesLayersController = null;
let aiSystemProfileController = null;
let llmLimitsController = null;
let aiCapabilitiesController = null;
let educationUsecaseController = null;
let anthropomorphismController = null;
let correctVsSuitableController = null;
let teacherFilterController = null;
let predictionDecisionController = null;
let recommendationResponsibilityController = null;
let teacherActionsMapController = null;
let promptEngineeringController = null;

/* =========================================================
   10. BOOTSTRAP
   ========================================================= */

function initPresentation() {
    initTimelines();
    initStepNavigation();
    initWorkbenches();

    aiTransitionController = initAITransition();

    binaryIntroController = initBinaryIntro();
    representationLabController = initRepresentationLab();
    algorithmSlideController = initAlgorithmSlide();
    rulesToLearningController = initRulesToLearningSlide();
    algorithmVsSymbolicController = initAlgorithmVsSymbolicSlide();
    intelligenceAxisController = initIntelligenceAxisSlide();
    whatIsAIController = initWhatIsAISlide();
    aiAxesLayersController = initAIAxesLayersSlide();
    aiSystemProfileController = initAISystemProfileSlide();
    llmLimitsController = initLLMLimitsSlide();
    aiCapabilitiesController = initAICapabilitiesSlide();
    educationUsecaseController = initEducationUsecaseSlides();
    anthropomorphismController = initAnthropomorphismSlide();
    correctVsSuitableController = initCorrectVsSuitableSlide();
    teacherFilterController = initTeacherFilterSlide();
    predictionDecisionController = initPredictionDecisionSlide();
    recommendationResponsibilityController = initRecommendationResponsibilitySlide();
    teacherActionsMapController = initTeacherActionsMapSlide();
    promptEngineeringController = initPromptEngineeringDemo();

    initGlobalEvents();

    presentation.init();
}

initPresentation();