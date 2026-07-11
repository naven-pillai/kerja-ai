declare module 'emoji-flags' {
    export interface EmojiFlag {
      code: string;
      emoji: string;
      unicode: string;
      name: string;
    }
  
    const emojiFlags: {
      countryCode(code: string): EmojiFlag | undefined;
      data: EmojiFlag[];
    };
  
    export default emojiFlags;
  }
  