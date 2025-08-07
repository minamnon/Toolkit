import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDGCvXI8h0pUo5uN1Yf6zA4L1K0Z6hN0hM",
  authDomain: "distillerytollkit.firebaseapp.com",
  projectId: "distillerytollkit",
  storageBucket: "distillerytollkit.appspot.com",
  messagingSenderId: "1040177306248",
  appId: "1:1040177306248:web:0b7b2e4b1b2f2e4b1b2f2e",
  measurementId: "G-0B7B2E4B1B2F2E"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const subscribeToTopic = async (topic: string) => {
  if (!messaging) return;
  try {
    const token = await getToken(messaging, {
      vapidKey: "BKdlnVeSX87PasQP7jPoGvP5dCTh0-_nst6P_8kbNHNh3T1XflKIrA5SCDg6XYMXBkALnYF4k-1h6rpX0jnfOH0"
    });
    await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
      method: 'POST',
      headers: {
        'Authorization': `key=golRZZsD-KdRDmnK5oymcQdwLw9Amzr9dadlNNSz5BI`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Subscribed to topic: ${topic}`);
  } catch (error) {
    console.error('Error subscribing to topic:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
