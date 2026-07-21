interface InstgramEmbed {
  Embeds: {
    process: () => void;
  };
}

interface Window {
  instgrm?: InstgramEmbed;
}
