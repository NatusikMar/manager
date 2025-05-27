export const getUser = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/events/user", {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json(); // { username }
  } catch (err) {
    return null;
  }
};
