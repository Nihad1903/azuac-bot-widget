const T = 30000;
export async function sendMessage(endpoint, question) {
  if (!endpoint) throw new Error('Endpoint not configured.');
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), T);
  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST', 
      signal: ctrl.signal,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // ngrok xəbərdarlıq səhifəsini keçmək və CORS-a kömək etmək üçün:
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ question }),
    });
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Request timed out.');
    throw new Error('Network error.');
  } finally { clearTimeout(tid); }
  
  if (!res.ok) {
    let d = '';
    try { const j = await res.json(); d = j.detail || j.message || ''; } catch (_) {}
    throw new Error(d || 'Server error (' + res.status + ').');
  }
  let data;
  try { data = await res.json(); } catch (_) { throw new Error('Invalid response.'); }
  if (typeof data.answer !== 'string') throw new Error('Unexpected response format.');
  return data.answer;
}
