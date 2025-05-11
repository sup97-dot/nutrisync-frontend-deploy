document.addEventListener('DOMContentLoaded', async () => {
    
    const startDateInput = document.getElementById('startDate');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const goalInput = document.getElementById('goal');
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input) {
            input.value = 'Loading...';
            input.disabled = true;
        }
    });
    
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    console.log('User ID from localStorage:', userId);
    console.log('Token available', token ? 'Yes (hidden for security)' : 'No');

    if (!userId || !token){
        alert('Please log in to view your profile');
        window.location.href = 'login.html';
        return;
    } 

    try {
        console.log('Attempting to fetch user data...');
        
        const userEndpoint = `http://localhost:3000/api/auth/user/${userId}`;
        console.log('Fetching from:', userEndpoint);

        const userRes = await fetch(userEndpoint, {
            method: 'GET',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', userRes.status);

        if (!userRes.ok) {
            console.warn('User endpoint failed, trying profile endpoint...');

            const profileEndpoint = `http://localhost:3000/api/auth/profile/${userId}`;
            console.log('Fetching from:', profileEndpoint);

            const profileRes = await fetch(profileEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
        });

        console.log('Profile response status:', profileRes.status);
            
            if (!profileRes.ok) {
                throw new Error(`Both endpoints failed. User: ${userRes.status}, Profile: ${profileRes.status}`);
            }

            const profileData = await profileRes.json();
            console.log('Profile data:', profileData);

            if (profileData.created_at || profileData.start_date) {
                const date = new Date(profileData.created_at || profileData.start_date);
                document.querySelectorAll('input')[0].value = date.toLocaleDateString();
            }

            document.querySelectorAll('input')[1].value = profileData.height ? `${profileData.height} cm` : 'Not available';
            document.querySelectorAll('input')[2].value = profileData.weight ? `${profileData.weight} kg` : 'Not available';
            document.querySelectorAll('input')[3].value = profileData.goal || 'Not available';

        } else {
            const userData = await userRes.json();
            console.log('User data:', userData);

            if (userData.created_at) {
                const date = new Date(userData.created_at);
                document.querySelectorAll('input')[0].value = date.toLocaleDateString();
            }

            document.querySelectorAll('input')[1].value = userData.height ? `${userData.height} cm` : 'Not available';
            document.querySelectorAll('input')[2].value = userData.weight ? `${userData.weight} kg` : 'Not available';
            document.querySelectorAll('input')[3].value = userData.goal || 'Not available';
        }
    } catch (err) {
        console.error('Detailed error:', err);

        try {
            console.log('Trying one more approach with /api/auth/progress endpoint...');
            const progressEndpoint = `http://localhost:3000/api/auth/progress/${userId}`;
            
            const progressRes = await fetch(progressEndpoint);
            console.log('Progress response status:', progressRes.status);

            if (progressRes.ok) {
                const progressData = await progressRes.json();
                console.log('Progress data:', progressData);

                if (progressData.start_date) {
                    const date = new Date(progressData.start_date);
                    document.querySelectorAll('input')[0].value = date.toLocaleDateString();
                }
                
                document.querySelectorAll('input')[1].value = progressData.height ? `${progressData.height} cm` : 'Not available';
                document.querySelectorAll('input')[2].value = progressData.weight ? `${progressData.weight} kg` : 'Not available';
                document.querySelectorAll('input')[3].value = progressData.goal || 'Not available';
            } else {
                throw new Error(`Progress endpoint failed: ${progressRes.status}`);
            }
        } catch (progressErr) {
            console.error('All endpoints failed:', progressErr);

            document.querySelectorAll('input')[0].value = 'Not available';
            document.querySelectorAll('input')[1].value = 'Not available';
            document.querySelectorAll('input')[2].value = 'Not available';
            document.querySelectorAll('input')[3].value = 'Not available';
            
            alert('Could not load your profile data. Please try again later.');
        }

    } finally {
        inputs.forEach(input => {
            input.disabled = false;
        });
    }
});
