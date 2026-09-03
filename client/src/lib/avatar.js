const styles = ["avataaars", "micah", "lorelei", "bottts", "avataaars-neutral","initial-face","glyphs","clay"]


export const getAvatarUrl = (username) => {
  const seed = username || 'anonymous';
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/10.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};
