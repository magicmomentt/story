document.addEventListener('DOMContentLoaded', () => {
    // --- State & Elements ---
    let currentStep = 1;
    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.3; // Soft start

    // --- Steps Logic ---
    function nextStep(targetId) {
        // Hide current
        const currentSection = document.querySelector('.step.active');
        if (currentSection) {
            currentSection.classList.remove('active');
            setTimeout(() => {
                currentSection.classList.add('hidden'); // Ensure display:none after fade
            }, 1000); // Wait for transition
        }

        // Show next
        // Use timeout to allow fade out overlaps if desired, or simpler:
        setTimeout(() => {
            const nextSection = document.getElementById(targetId);
            if (nextSection) {
                nextSection.classList.remove('hidden'); // Make display block
                // Force reflow
                void nextSection.offsetWidth;
                nextSection.classList.add('active'); // Start opacity transition

                // Trigger step-specific logic
                initStep(targetId);
            }
        }, 800);
    }

    function initStep(stepId) {
        switch (stepId) {
            case 'step-1':
                runStep1();
                break;
            case 'step-2':
                // Buttons already wired
                break;
            case 'step-3':
                initTimeline();
                break;
            case 'step-4':
                runChat();
                break;
            case 'step-5':
                break;
            case 'step-6':
                initEnvelope();
                break;
            case 'step-7':
                break;
        }
    }

    // --- Step 1: Intro ---
    function runStep1() {
        const t1 = "Every story starts with a moment...";
        const t2 = "This is ours.";
        const el1 = document.getElementById('intro-text-1');
        const el2 = document.getElementById('intro-text-2');
        const btn = document.getElementById('btn-start');

        typeWriter(t1, el1, 50, () => {
            setTimeout(() => {
                el2.classList.remove('hidden');
                typeWriter(t2, el2, 50, () => {
                    setTimeout(() => {
                        btn.classList.remove('hidden');
                        btn.style.animation = "fadeIn 1s forwards";
                    }, 1000);
                });
            }, 1500);
        });
    }

    document.getElementById('btn-start').addEventListener('click', () => {
        // Attempt audio play
        bgMusic.play().catch(e => console.log("Audio autoplay prevented", e));
        nextStep('step-2');
    });

    // --- Step 2: Question ---
    document.querySelectorAll('#step-2 .option').forEach(btn => {
        btn.addEventListener('click', () => {
            // Can modify next step text based on choice here if we want
            nextStep('step-3');
        });
    });

    // --- Step 3: Timeline ---
    const moments = [
        { text: "The first time...", img: "assets/The first time.jpg" },
        { text: "The first laugh...", img: "assets/The first laugh.jpg" },
        { text: "The first silence...", img: "assets/The first silence.jpg" },
        { text: "The moment everything changed.", img: "assets/The moment everything changed.jpg" }
    ];

    function initTimeline() {
        const container = document.querySelector('.timeline');
        // Clear existing points if any (but keep the line)
        container.querySelectorAll('.timeline-point').forEach(e => e.remove());

        // Create points
        moments.forEach((m, idx) => {
            const point = document.createElement('div');
            point.classList.add('timeline-point');
            // point.style.marginTop is handled by CSS gap now
            point.addEventListener('click', () => showMoment(idx, point));
            container.appendChild(point);
        });

        // HACK: Auto-click the first moment so the user sees something immediately
        setTimeout(() => {
            const firstPoint = container.querySelector('.timeline-point');
            if (firstPoint) showMoment(0, firstPoint);
        }, 500);
    }

    function showMoment(idx, pointElement) {
        // Reset active
        document.querySelectorAll('.timeline-point').forEach(p => p.classList.remove('active'));
        pointElement.classList.add('active');

        const display = document.getElementById('timeline-display');
        const img = document.getElementById('timeline-img');
        const txt = document.getElementById('timeline-text');
        const nextBtn = document.getElementById('btn-timeline-next');

        display.classList.remove('hidden');
        display.style.animation = 'none';
        void display.offsetWidth;
        display.style.animation = 'fadeIn 0.5s forwards';

        // Set content
        img.src = moments[idx].img;
        txt.textContent = moments[idx].text;

        // If last moment, show next button
        if (idx === moments.length - 1) {
            nextBtn.classList.remove('hidden');
        }
    }

    document.getElementById('btn-timeline-next').addEventListener('click', () => {
        nextStep('step-4');
    });

    // --- Step 4: Chat ---
    function runChat() {
        const messages = [
            "I never said this out loud...",
            "But I felt it every time.",
            "You felt like home."
        ];
        const container = document.getElementById('chat-container');
        container.innerHTML = ''; // clear for replay logic

        let delay = 500;
        messages.forEach((msg, idx) => {
            setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.classList.add('chat-bubble');
                bubble.textContent = msg;
                container.appendChild(bubble);

                // Show continue button after last
                if (idx === messages.length - 1) {
                    setTimeout(() => {
                        const btn = document.getElementById('btn-chat-next');
                        btn.classList.remove('hidden');
                        btn.style.animation = 'fadeIn 1s forwards';
                    }, 1000);
                }
            }, delay);
            delay += 2500; // Wait reading time
        });
    }

    document.getElementById('btn-chat-next').addEventListener('click', () => {
        nextStep('step-5');
    });

    // --- Step 5: Reflection ---
    document.querySelectorAll('#step-5 .option').forEach(btn => {
        btn.addEventListener('click', () => {
            nextStep('step-6');
        });
    });

    // --- Step 6: Reveal ---
    function initEnvelope() {
        const env = document.getElementById('envelope');
        const msg = document.getElementById('final-message');
        const endBtn = document.getElementById('btn-finish');

        env.onclick = () => {
            env.style.transform = "scale(0.5) translateY(-50px)";
            env.style.opacity = "0";

            setTimeout(() => {
                env.classList.add('hidden');
                msg.classList.remove('hidden');
                msg.style.animation = "fadeIn 2s forwards";

                setTimeout(() => {
                    endBtn.classList.remove('hidden');
                    endBtn.style.animation = "fadeIn 1s forwards";
                }, 3000);
            }, 500);
        };
    }

    document.getElementById('btn-finish').addEventListener('click', () => {
        nextStep('step-7');
    });

    // --- Step 7: End ---
    document.getElementById('btn-replay').addEventListener('click', () => {
        location.reload(); // Simple reload for mostly pure logic
    });

    document.getElementById('btn-freeze').addEventListener('click', () => {
        alert("The moment is yours to keep. (Animation freezes here)");
        // In reality, we just do nothing and let them stare at the screen
    });


    // --- Utilities ---
    function typeWriter(text, element, speed, callback) {
        element.textContent = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // Initialize first step
    initStep('step-1');
});
