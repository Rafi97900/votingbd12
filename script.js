let voteRecords = JSON.parse(localStorage.getItem('voteRecords') || '[]');

function updateStats() {
    const counts = {1: 0, 2: 0, 3: 0};
    voteRecords.forEach(record => counts[record.party]++);
    const total = voteRecords.length;

    for(let i = 1; i <= 3; i++) {
        document.getElementById(`votes${i}`).textContent = counts[i];
        document.getElementById(`percent${i}`).textContent = total > 0 
            ? `${((counts[i]/total)*100).toFixed(1)}%` 
            : '0%';
    }
}

function login() {
    const email = document.getElementById('email').value.trim();
    const age = parseInt(document.getElementById('age').value);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('অনুগ্রহ করে বৈধ ইমেইল দিন');
        return;
    }

    if (age < 18 || age > 120 || isNaN(age)) {
        alert('ভোট দেওয়ার জন্য আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে');
        return;
    }

    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('votingContainer').style.display = 'block';
}

function vote(party) {
    const email = document.getElementById('email').value.trim();

    if(voteRecords.some(record => record.email === email)) {
        alert('আপনি ইতিমধ্যে ভোট দিয়েছেন!');
        return;
    }

    voteRecords.push({ 
        email, 
        party, 
        timestamp: new Date().toISOString() 
    });
    localStorage.setItem('voteRecords', JSON.stringify(voteRecords));

    // Hide buttons and show stats
    document.querySelectorAll('.team-box button').forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('.vote-stats').forEach(stats => stats.classList.remove('hidden'));
    document.getElementById('userConfirmation').innerHTML = `
        <div class="confirmation-message">
            আপনি "${getPartyName(party)}"-কে ভোট দিয়েছেন<br>
            (ইমেইল: ${email})
        </div>
    `;

    updateStats();
}

function showAdminPanel() {
    const password = prompt('অ্যাডমিন পাসওয়ার্ড দিন:');
    if(password === 'admin123') {
        document.getElementById('adminContainer').style.display = 'block';
        document.getElementById('adminStats').innerHTML = `
            <h3>মোট ভোট: ${voteRecords.length}</h3>
            ${voteRecords.map((record, index) => `
                <p>${index+1}. ${record.email}<br>
                দল: ${getPartyName(record.party)}<br>
                সময়: ${new Date(record.timestamp).toLocaleString()}</p>
            `).join('')}
        `;
    } else {
        alert('অবৈধ পাসওয়ার্ড!');
    }
}

function getPartyName(party) {
    const parties = {
        1: 'জাতীয় নাগরিক পার্টি',
        2: 'বাংলাদেশ জাতীয়তাবাদী দল',
        3: 'বাংলাদেশ জামায়াতে ইসলামী'
    };
    return parties[party] || 'অজানা দল';
}

// Initialize
window.onload = () => {
    if(window.location.hash === '#admin') {
        showAdminPanel();
    }
    updateStats();
};