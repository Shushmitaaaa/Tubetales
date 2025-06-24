const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});


const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});


const videoUrlInput = document.getElementById('videoUrl');
const summarizeBtn = document.getElementById('summarizeBtn');
const btnText = document.getElementById('btnText');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const summaryOutput = document.getElementById('summaryOutput');
const summaryActions = document.getElementById('summaryActions');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

let currentSummary = '';


function isValidYouTubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w\-]{11}/;
    return regex.test(url);
}


function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
}


function hideError() {
    errorMessage.style.display = 'none';
}


function setLoadingState(isLoading) {
    if (isLoading) {
        summarizeBtn.disabled = true;
        btnText.style.opacity = '0';
        loadingSpinner.style.display = 'block';
    } else {
        summarizeBtn.disabled = false;
        btnText.style.opacity = '1';
        loadingSpinner.style.display = 'none';
    }
}


function displaySummary(summary) {
    currentSummary = summary;
    summaryOutput.innerHTML = `<div class="summary-content">${summary}></div>`;
    summaryActions.style.display = 'flex';
}


function clearSummary() {
    currentSummary = '';
    summaryOutput.innerHTML = `
        <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5,3 19,12 5,21 5,3"/>
            </svg>
            <p>Your video summary will appear here</p>
        </div>
    `;
    summaryActions.style.display = 'none';
}


async function generateSummary(videoUrl) {
    try {
        setLoadingState(true);
        hideError();
        
        
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: videoUrl }),
        });



        if (!response.ok) {
            const errorData = await response.json(); // Get error message from backend
            throw new Error(errorData.error || 'Failed to generate summary');
        }

        const data = await response.json();
        displaySummary(data.summary);
        
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'Failed to generate summary. Please try again.');
        
    } finally {
        setLoadingState(false);
    }
}


summarizeBtn.addEventListener('click', async () => {
    const videoUrl = videoUrlInput.value.trim();
    
    if (!videoUrl) {
        showError('Please enter a YouTube URL');
        return;
    }
    
    if (!isValidYouTubeUrl(videoUrl)) {
        showError('Please enter a valid YouTube URL');
        return;
    }
    
    await generateSummary(videoUrl);
});


videoUrlInput.addEventListener('input', () => {
    if (errorMessage.style.display === 'flex') {
        hideError();
    }
});

videoUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        summarizeBtn.click();
    }
});


copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(currentSummary.replace(/<[^>]*>/g, ''));
        
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20,6 9,17 4,12"/>
            </svg>
        `;
        copyBtn.style.color = '#10b981';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.color = '';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
});


downloadBtn.addEventListener('click', () => {
    const textContent = currentSummary.replace(/<[^>]*>/g, '');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});


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


window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.8)';
    }
});


const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);


document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});