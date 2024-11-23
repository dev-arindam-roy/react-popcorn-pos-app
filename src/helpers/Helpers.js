export const randomNumber = () => Math.floor(Math.random() * 5) + 1;
export const formatNumberWord = (input) => {
  return input
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};
