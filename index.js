import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
  console.log(colors.bold.green('Welcome to the Chatbot!'));
  console.log(colors.bold.green('You can start chatting with the bot. Type "exit" to end the conversation.'));

  const chatHistory = []; // Store conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    // Exit condition
    if (userInput.toLowerCase() === 'exit') {
      console.log(colors.green('Goodbye!'));
      break;
    }

    try {
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add the user's input to the messages array
      messages.push({ role: 'user', content: userInput });

      // Updated method call for v4.x.x OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
      });

      const completionText = completion.choices[0].message.content;

      console.log(colors.green('Bot: ') + completionText);

      // Update conversation history
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);

    } catch (error) {
      if (error.response) {
        console.error(colors.red(`Error: ${error.response.data.error.code}`));
        console.error(colors.red(error.response.data.error.message));
      } else {
        console.error(colors.red(error.message));
      }
    }
  }
}

main();
