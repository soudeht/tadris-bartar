// Main JavaScript for گوسفند یا چوپان Website

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeParticleBackground();
    initializeScrollReveal();
    initializeMobileMenu();
    initializeSheepAnimation();
    initializeTypingAnimations();
});

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize scroll reveal animations
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize particle background using p5.js
function initializeParticleBackground() {
    new p5((p) => {
        let particles = [];
        const numParticles = 50;
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particle-bg');
            
            // Create particles
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    color: p.random(['#43a9dd', '#00ff00', '#ff007f', '#f7d000'])
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Wrap around edges
                if (particle.x < 0) particle.x = p.width;
                if (particle.x > p.width) particle.x = 0;
                if (particle.y < 0) particle.y = p.height;
                if (particle.y > p.height) particle.y = 0;
                
                // Draw particle
                p.fill(particle.color + '40');
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
                
                // Add glow effect
                p.fill(particle.color + '20');
                p.ellipse(particle.x, particle.y, particle.size * 2);
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// Initialize button hover animations
function initializeAnimations() {
    const buttons = document.querySelectorAll('.hover-lift');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Initialize mobile menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle mobile menu (you can expand this)
            alert('منوی موبایل - به زودی فعال می‌شود!');
        });
    }
}

// Initialize sheep animation
function initializeSheepAnimation() {
    const sheepCanvas = document.getElementById('sheep-canvas');
    if (!sheepCanvas) return;
    
    new p5((p) => {
        let sheep = [];
        let animationStarted = false;
        let animationTime = 0;
        
        p.setup = function() {
            const canvas = p.createCanvas(sheepCanvas.offsetWidth, 300);
            canvas.parent('sheep-canvas');
            
            // Create initial sheep
            for (let i = 0; i < 8; i++) {
                sheep.push({
                    x: p.random(50, p.width - 50),
                    y: p.height - 50,
                    vx: p.random(0.5, 1.5),
                    size: p.random(20, 30),
                    color: p.random(['#43a9dd', '#00ff00', '#ff007f']),
                    following: i > 0,
                    leader: i === 0
                });
            }
        };
        
        p.draw = function() {
            p.background(10, 10, 10);
            
            if (animationStarted) {
                animationTime += 0.02;
                
                // Move sheep
                sheep.forEach((s, index) => {
                    if (s.leader) {
                        // Leader moves randomly
                        s.x += Math.sin(animationTime + index) * 2;
                        s.y += Math.cos(animationTime * 0.5) * 0.5;
                    } else {
                        // Followers follow the leader
                        const leader = sheep[0];
                        const dx = leader.x - s.x;
                        const dy = leader.y - s.y;
                        s.x += dx * 0.02;
                        s.y += dy * 0.02;
                    }
                    
                    // Keep sheep on screen
                    if (s.x < 0) s.x = p.width;
                    if (s.x > p.width) s.x = 0;
                    if (s.y < p.height * 0.5) s.y = p.height * 0.5;
                    if (s.y > p.height - 30) s.y = p.height - 30;
                    
                    // Draw sheep
                    drawSheep(p, s.x, s.y, s.size, s.color);
                });
                
                // Add warning message
                if (animationTime > 5) {
                    p.fill('#ff007f');
                    p.textAlign(p.CENTER);
                    p.textSize(24);
                    p.text('⚠️ گوسفندان در حال نزدیک شدن به خطر!', p.width / 2, 50);
                }
            } else {
                // Static sheep display
                sheep.forEach((s, index) => {
                    s.x = 100 + index * 80;
                    s.y = p.height - 50;
                    drawSheep(p, s.x, s.y, s.size, s.color);
                });
                
                p.fill('#f7d000');
                p.textAlign(p.CENTER);
                p.textSize(18);
                p.text('برای شروع انیمیشن روی دکمه کلیک کنید', p.width / 2, p.height / 2);
            }
        };
        
        function drawSheep(p, x, y, size, color) {
            p.fill(color);
            p.noStroke();
            
            // Body
            p.ellipse(x, y, size * 1.5, size);
            
            // Head
            p.ellipse(x - size * 0.7, y - size * 0.3, size * 0.6, size * 0.5);
            
            // Eyes
            p.fill(255);
            p.ellipse(x - size * 0.8, y - size * 0.4, size * 0.1, size * 0.1);
            p.ellipse(x - size * 0.6, y - size * 0.4, size * 0.1, size * 0.1);
            
            // Legs
            p.rect(x - size * 0.5, y + size * 0.3, size * 0.1, size * 0.4);
            p.rect(x - size * 0.2, y + size * 0.3, size * 0.1, size * 0.4);
            p.rect(x + size * 0.1, y + size * 0.3, size * 0.1, size * 0.4);
            p.rect(x + size * 0.4, y + size * 0.3, size * 0.1, size * 0.4);
        }
        
        // Global function to start animation
        window.startSheepAnimation = function() {
            animationStarted = true;
            animationTime = 0;
        };
        
        p.windowResized = function() {
            p.resizeCanvas(sheepCanvas.offsetWidth, 300);
        };
    });
}

// Initialize typing animations
function initializeTypingAnimations() {
    const typingElements = document.querySelectorAll('.typing-animation');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.width = '0';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 2000);
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    } else {
        nav.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }
});

// Quiz preview functionality
function startQuiz() {
    // This would normally navigate to the quiz page
    // For demo purposes, we'll show a sample question
    const quizContainer = document.createElement('div');
    quizContainer.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
    quizContainer.innerHTML = `
        <div class="bg-gray-900 p-8 rounded-lg max-w-2xl mx-4 border-2" style="border-color: var(--neon-green);">
            <h3 class="text-2xl font-bold mb-4 neon-text" style="color: var(--neon-green);">
                سوال نمونه: کدوم گزینه درسته؟
            </h3>
            <p class="text-lg mb-6">
                وقتی یه خبر عجیب تو شبکه‌های اجتماعی می‌بینم، اولین کاری که باید بکنم چیه؟
            </p>
            <div class="space-y-3">
                <button class="block w-full text-right p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                    A) فوراً شروع به اشتراک‌گذاری کنم
                </button>
                <button class="block w-full text-right p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                    B) منبع خبر رو بررسی کنم
                </button>
                <button class="block w-full text-right p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                    C) نظر بقیه رو ببینم
                </button>
                <button class="block w-full text-right p-3 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                    D) بی‌تفاوت رد بشم
                </button>
            </div>
            <div class="mt-6 text-center">
                <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 bg-transparent border rounded" style="color: var(--neon-green); border-color: var(--neon-green);">
                    بستن
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(quizContainer);
}

// Chat preview functionality
function startChatPreview() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
    chatContainer.innerHTML = `
        <div class="bg-gray-900 p-8 rounded-lg max-w-2xl mx-4 border-2" style="border-color: var(--bright-pink);">
            <div class="flex items-center mb-4">
                <img src="houshang-chatbot.jpg" alt="هوشنگ" class="w-16 h-16 rounded-full mr-4">
                <div>
                    <h3 class="text-xl font-bold neon-text" style="color: var(--bright-pink);">هوشنگ</h3>
                    <p class="text-sm text-gray-400">چت‌بات بررسی اخبار</p>
                </div>
            </div>
            <div class="bg-gray-800 p-4 rounded mb-4">
                <p class="text-neon-green">سلام! من هوشنگ هستم. لطفاً لینک یا متن خبری رو که می‌خوای بررسی کنم برام بفرست.</p>
            </div>
            <div class="mb-4">
                <input type="text" placeholder="لینک یا متن خبر رو اینجا بنویس..." class="w-full p-3 bg-gray-800 rounded text-white border-0 focus:outline-none focus:ring-2" style="focus:ring-color: var(--bright-pink);">
            </div>
            <div class="flex gap-3">
                <button class="flex-1 px-4 py-2 bg-transparent border rounded" style="color: var(--bright-pink); border-color: var(--bright-pink);">
                    ارسال
                </button>
                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-700 rounded">
                    بستن
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);
}

// Story preview functionality
function readStory(storyId) {
    const stories = {
        ali: {
            title: "علی: از گوسفند قصه‌پرداز به تحلیل‌گر مستقل",
            content: `فکر می‌کردم همه چیز همون چیزیه که تلویزیون می‌گه. هر شب اخبار رو تماشا می‌کردم و بدون هیچ سوالی قبول می‌کردم. تا اینکه یه روز یه خبر کاملاً غیرمنطقی دیدم... بعد از اون شروع کردم به تحقیق کردن و یاد گرفتم که همیشه باید منابع مختلف رو بررسی کنم.`
        },
        sara: {
            title: "سارا: از اسیر لایک‌ها به آزاد فکر",
            content: `همیشه دنبال لایک اینستاگرام بودم. هر چیزی که بیشترین لایک رو داشت، فکر می‌کردم درسته. ولی gradually فهمیدم که این لایک‌ها فقط یه بخش کوچیک از واقعیتن و خیلی وقت‌ها کاملاً غیرواقعی هستن. حالا قبل از اشتراک‌گذاری، حتماً بررسی می‌کنم.`
        },
        reza: {
            title: "رضا: از غرق‌شده در فضای مجازی به کاربر آگاه",
            content: `تو شبکه‌های اجتماعی غرق شده بودم. هر چیزی رو که می‌دیدم باور می‌کردم. ولی یه روز متوجه شدم که خیلی از این اطلاعات کاملاً نادرستن. شروع کردم به یادگیری چطور اطلاعات رو بررسی کنم و حالا خیلی بیشتر آگاهم.`
        }
    };
    
    const story = stories[storyId];
    if (!story) return;
    
    const storyContainer = document.createElement('div');
    storyContainer.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
    storyContainer.innerHTML = `
        <div class="bg-gray-900 p-8 rounded-lg max-w-2xl mx-4 border-2" style="border-color: var(--bright-pink);">
            <h3 class="text-2xl font-bold mb-4 neon-text" style="color: var(--bright-pink);">
                ${story.title}
            </h3>
            <div class="text-gray-300 leading-relaxed mb-6">
                ${story.content.split('\n').map(p => `<p class="mb-4">${p}</p>`).join('')}
            </div>
            <div class="text-center">
                <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 bg-transparent border rounded" style="color: var(--bright-pink); border-color: var(--bright-pink);">
                    بستن
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(storyContainer);
}

// Add click handlers for story buttons
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'خواندن ادامه') {
        e.preventDefault();
        const storyCard = e.target.closest('.story-card');
        const name = storyCard.querySelector('.font-semibold').textContent.split('،')[0].toLowerCase();
        readStory(name);
    }
});

// Add click handlers for quiz and chat buttons
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('شروع آزمون')) {
        e.preventDefault();
        startQuiz();
    }
    if (e.target.textContent.includes('از هوشنگ بپرس')) {
        e.preventDefault();
        startChatPreview();
    }
});