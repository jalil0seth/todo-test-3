export const formatPrompt = (input: string): string => {
  return `
Process the following input and respond in markdown format:

${input}

Guidelines:
- Use clear markdown headings
- Group information into 2-3 categories
- Use bullet points for lists
- Keep responses concise and focused
- Add brief notes if needed
- Format everything in markdown

Example format:
# Main Topic
## Category 1
- Point 1
- Point 2

## Category 2
- Point 1
- Point 2

Notes:
- Important note 1
`;
};