'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarLayout from './components/CalendarLayout';
import { getUser } from "./utils/getUser";

export default function CalendarPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (!userData) {
        router.push("/");
      } else {
        setUsername(userData.username);
        setLoading(false); // ← правильный вызов
      }
    };

    fetchUser();
  }, [router]);

  if (loading) return null; // или <LoadingSpinner />

  return (
    <main>
      <CalendarLayout username={username} />
    </main>
  );
}
