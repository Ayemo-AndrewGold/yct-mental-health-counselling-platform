import Cookies from 'js-cookie'


const BASE_URL = 'https://yct-mental-health-counselling-platform.onrender.com/api/auth';

//------------ Fetch with Authentication --------
    export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
      let token = Cookies.get('access');

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      // If 401, try to refresh the token
      if (res.status === 401) {
        const refresh = Cookies.get('refresh');
        if (refresh) {
          const refreshRes = await fetch(`${BASE_URL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
          });
          if (refreshRes.ok) {
            const data = await refreshRes.json();
            Cookies.set('access', data.access, { expires: 1, sameSite: 'lax' });
            // Retry original request with new token
            return fetch(`${BASE_URL}${endpoint}`, {
              ...options,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.access}`,
                ...options.headers,
              },
            });
          } else {
            // Refresh also failed — log user out
            Cookies.remove('access');
            Cookies.remove('refresh');
            Cookies.remove('user');
            window.location.href = '/login/student';
          }
        }
      }

      return res;
    }


//------------ Get Me  --------
export async function getMe() {
  const res = await fetchWithAuth('/me/');
  if(!res.ok) return null;
  return res.json();
}

//------------ Get counsellor --------
export async function getCounsellors() {
  const res = await fetchWithAuth('/counsellors/');
  if (!res.ok) return [];
  return res.json();
}

//------------ Get Appointment --------
export async function getAppointments(){
  const res = await fetchWithAuth('/appointments/');
  if (!res.ok) return [];
  return res.json();
}

//------------Book Appointment --------
export async function bookAppointment(data: {
  counsellor: number | string;
  session_type: string;
  date: string;
  time: string;
  duration: number;
  note?: string;
}){
  const res = await fetchWithAuth('/appointments/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res;
}

//------------ Cancelled Appointment --------
export async function cancelAppointment(id: number) {
  const res = await fetchWithAuth(`/appointments/${id}/`, {
    method: 'DELETE',
  });
  return res;
}


//------------ Updated Profile --------
export async function updateProfile(data: Record<string, string | undefined>) {
  const res = await fetchWithAuth('/me/update', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res;
}

export async function getAdminStats() {
  const res = await fetchWithAuth('/admin/stats/');
  if (!res.ok) return null;
  return res.json();
}

export async function getAdminStudents() {
  const res = await fetchWithAuth('/admin/students/');
  if (!res.ok) return [];
  return res.json();
}

export async function getAdminCounsellors() {
  const res = await fetchWithAuth('/admin/counsellors/');
  if (!res.ok) return [];
  return res.json();
}

export async function getAdminUsers() {
  const res = await fetchWithAuth('/admin/users/');
  if (!res.ok) return [];
  return res.json();
}

export async function getAdminAppointments() {
  const res = await fetchWithAuth('/admin/appointments/');
  if (!res.ok) return [];
  return res.json();
}

export async function toggleUserStatus(id: number, isActive: boolean) {
  const res = await fetchWithAuth(`/admin/users/${id}/toggle/`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  });
  return res;
}

export async function getCounsellorStats() {
  const res = await fetchWithAuth('/counsellor/stats/');
  if (!res.ok) return null;
  return res.json();
}

export async function getCounsellorAppointments() {
  const res = await fetchWithAuth('/counsellor/appointments/');
  if (!res.ok) return [];
  return res.json();
}

export async function getCounsellorStudents() {
  const res = await fetchWithAuth('/counsellor/students/');
  if (!res.ok) return [];
  return res.json();
}


export async function updateAppointmentStatus(id: number, status: string) {
  const res = await fetchWithAuth(`/appointments/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res;
}

export async function getMessages() {
  const res = await fetchWithAuth('/messages/');
  if (!res.ok) return [];
  return res.json();
}

export async function sendMessage(receiverId: number, text: string){
  const res = await fetchWithAuth('/messages/', {
    method: 'POST',
    body: JSON.stringify({ receiver_id: receiverId, text})
  });
  return res
}

export async function markMessagesRead(userId: number) {
  const res = await fetchWithAuth(`/messages/${userId}/read/`, {
    method: 'POST',
  });
  return res;
}