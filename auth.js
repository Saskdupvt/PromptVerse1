import { supabase } from './supabase-config.js';

// --- ලියාපදිංචි වීමේ කොටස (Sign Up) ---
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
            alert("Error: " + error.message);
        } else {
            alert("Registration Successful! Please check your email (if confirmation is ON) or Login now.");
            window.location.href = 'login.html'; // සාර්ථක නම් Login පිටුවට යවයි
        }
    });
}

// --- ඇතුළු වීමේ කොටස (Login) ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Login Failed: " + error.message);
        } else {
            alert("Login Successful!");
            window.location.href = 'profile.html'; // සාර්ථක නම් Profile පිටුවට යවයි
        }
    });
}

// --- Profile Page එක සඳහා තොරතුරු ලබා ගැනීම ---

async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // පරිශීලකයා සිටී නම් ඔහුගේ Email එක පෙන්වන්න
        const emailDisplay = document.getElementById('userEmail');
        if (emailDisplay) {
            emailDisplay.innerText = user.email;
        }
    } else {
        // Login වී නැත්නම් Login පිටුවට හරවා යවන්න
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
}

// පිටුව Load වන විට පරිශීලකයා සිටීදැයි බලන්න
checkUser();

// --- Logout වීමේ කොටස ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error logging out: " + error.message);
        } else {
            alert("Logged out successfully!");
            window.location.href = 'login.html';
        }
    });
}

const promptForm = document.getElementById('promptForm');

if (promptForm) {
    promptForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // දැනට ඉන්න පරිශීලකයා කවුදැයි බැලීම
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("Please login first!");
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
            alert("Error: " + error.message);
        } else {
            alert("Prompt saved successfully!");
            promptForm.reset(); // Form එක clear කරයි
        }
    });
}