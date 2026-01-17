import { supabase } from './supabase-config.js';

// --- 1. ලියාපදිංචි වීම (Sign Up) ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert("ලියාපදිංචි වීම අසාර්ථකයි: " + error.message);
        } else {
            alert("ලියාපදිංචි වීම සාර්ථකයි! කරුණාකර ඔබගේ Email එක පරීක්ෂා කරන්න.");
            window.location.href = 'login.html';
        }
    });
}

// --- 2. ඇතුළු වීම (Login) ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value; // ID එක නිවැරදිද බලන්න
        const password = document.getElementById('loginPassword').value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Login අසාර්ථකයි: " + error.message);
        } else {
            alert("සාර්ථකව Login විය!");
            window.location.href = 'profile.html';
        }
    });
}

// --- 3. පරිශීලකයා පරීක්ෂා කිරීම (Check Session) ---
async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    const currentPage = window.location.pathname;

    if (user) {
        // Profile Page එකේ ඉන්නවා නම් Email එක පෙන්වන්න
        const emailDisplay = document.getElementById('userEmail');
        if (emailDisplay) {
            emailDisplay.innerText = user.email;
        }
        
        // Login හෝ Register පිටුවල ඉන්නවා නම් කෙලින්ම Profile එකට යවන්න
        if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
            window.location.href = 'profile.html';
        }
    } else {
        // Login වී නැත්නම් සහ Profile Page එකේ ඉන්නවා නම් Login එකට හරවා යවන්න
        if (currentPage.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
}

// පිටුව Load වන විට පරීක්ෂා කරන්න
checkUser();

// --- 4. ඉවත් වීම (Logout) ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Logout වීමේදී දෝෂයක්: " + error.message);
        } else {
            alert("Logged out!");
            window.location.href = 'login.html';
        }
    });
}

// --- 5. Prompt එකක් Database එකට ඇතුළත් කිරීම ---
const promptForm = document.getElementById('promptForm');
if (promptForm) {
    promptForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("කරුණාකර පළමුව Login වන්න!");
            window.location.href = 'login.html';
            return;
        }

        const title = document.getElementById('pTitle').value;
        const promptText = document.getElementById('pText').value;
        const category = document.getElementById('pCategory').value;

        const { data, error } = await supabase
            .from('prompts')
            .insert([
                { 
                    title: title, 
                    prompt_text: promptText, 
                    category: category, 
                    user_id: user.id 
                },
            ]);

        if (error) {
            alert("දත්ත ඇතුළත් කිරීම අසාර්ථකයි: " + error.message);
        } else {
            alert("Prompt එක සාර්ථකව Save විය!");
            promptForm.reset();
        }
    });
}
