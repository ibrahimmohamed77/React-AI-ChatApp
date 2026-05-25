import { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://agentrouter.org/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sk-J7QrRRWikWlwySBVxfoIpa5XOz9UOxNxwhVqEe4irJYB4mnj',
            'HTTP-Referer': 'https://agentrouter.org',
            'X-Title': 'React Chat App'
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: updatedMessages
          })
        }
      );

      const data = await response.json();

      console.log('API RESPONSE:', data);

      const aiReply =
        data?.choices?.[0]?.message?.content ||
        'No response from AI 😢';

      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: aiReply }
      ]);
    } catch (error) {
      console.error('Error fetching AI data:', error);

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Error: Failed to get response from AI'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: 'sans-serif',
      margin: 0
    },
    header: {
      padding: '15px',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      color: '#34d399'
    },
    chatArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      maxWidth: '700px',
      width: '90%',
      margin: '0 auto'
    },
    messageRow: (role) => ({
      display: 'flex',
      justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: '15px'
    }),
    messageBox: (role) => ({
      maxWidth: '450px',
      padding: '12px 16px',
      borderRadius: '12px',
      backgroundColor: role === 'user' ? '#059669' : '#1e293b',
      color: '#ffffff'
    }),
    meta: {
      display: 'block',
      fontSize: '0.75rem',
      fontWeight: '600',
      marginBottom: '4px',
      opacity: 0.8
    },
    text: {
      margin: 0,
      whiteSpace: 'pre-line',
      lineHeight: '1.5'
    },
    loading: {
      color: '#94a3b8',
      textAlign: 'center',
      fontStyle: 'italic'
    },
    inputArea: {
      padding: '15px',
      backgroundColor: '#1e293b',
      borderTop: '1px solid #334155'
    },
    inputContainer: {
      maxWidth: '700px',
      margin: '0 auto',
      display: 'flex',
      gap: '10px'
    },
    input: {
      flex: 1,
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: '#0f172a',
      border: '1px solid #475569',
      color: '#fff',
      outline: 'none'
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#10b981',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>AI Chat App</div>

      <div style={styles.chatArea}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.messageRow(msg.role)}>
            <div style={styles.messageBox(msg.role)}>
              <span style={styles.meta}>
                {msg.role === 'user' ? 'You' : 'AI'}
              </span>
              <p style={styles.text}>{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && <div style={styles.loading}>AI is thinking...</div>}
      </div>

      <div style={styles.inputArea}>
        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;