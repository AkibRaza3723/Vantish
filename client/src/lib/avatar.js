const styles = ["avataaars", "micah", "human", "lorelei", "bottts", "avataaars-neutral", "gridy"]


export const getAvatarUrl = (username) => {
  const seed = username || 'anonymous';
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};
