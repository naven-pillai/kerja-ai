export type Heading = {
    id: string;
    text: string;
    level: number;
  };
  
  export function extractHeadingsFromHTML(html: string): { headings: Heading[], updatedHtml: string } {
    if (!html) return { headings: [], updatedHtml: '' };
  
    const headingRegex = /<(h2|h3)([^>]*)>(.*?)<\/\1>/gi;
    const headings: Heading[] = [];
    let updatedHtml = html;
  
    let match;
    while ((match = headingRegex.exec(html)) !== null) {
      const level = match[1] === 'h2' ? 2 : 3;
      const rawText = stripHtml(match[3]);
      const id = generateId(rawText);
  
      // inject id attribute if not exists
      if (!match[2].includes('id=')) {
        const inject = `<${match[1]} id="${id}"${match[2]}>${match[3]}</${match[1]}>`;
        updatedHtml = updatedHtml.replace(match[0], inject);
      }
  
      headings.push({ id, text: rawText, level });
    }
  
    return { headings, updatedHtml };
  }
  
  function generateId(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
      .replace(/(^-|-$)+/g, '');     // Trim hyphens at ends
  }
  
  function stripHtml(html: string) {
    return html
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
  