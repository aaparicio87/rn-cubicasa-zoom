export interface VideoJWTRequestDto {
  sessionName: string;
  role: string;
  sessionKey: string;
  userIdentity: string;
}

const COMM_VIDEO_API = 'https://api-dev.telaclaims.cloud/comm-video';

export async function fetchToken(sessionData: VideoJWTRequestDto) {
  try {
    const response = await fetch(`${COMM_VIDEO_API}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    return data.data.token.signature;
  } catch (err) {
    console.error('❌ Error fetching token:', err);
    throw err;
  }
}
