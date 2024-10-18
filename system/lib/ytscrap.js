import fetch from 'node-fetch';

export async function ytdl(url) {
  try {
    const response = await fetch('https://shinoa.us.kg/api/download/ytdl', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'api_key': 'free',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: url
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en ytdl:', error);
    throw error;
  }
}