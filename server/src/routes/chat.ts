import { Router, RequestHandler } from 'express';
import { getHiveNotes } from '../rag/rag';
import { addConversationEntry } from '../conversations/conversations';

const router = Router();

const chatHandler: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body;
    
    if (!body.question) {
      res.status(400).json({ error: 'Question is required' });
      return;
    }

    if (!body.threadId) {
      res.status(400).json({ error: 'Thread ID is required' });
      return;
    }

    await addConversationEntry({
      threadId: body.threadId,
      role: 'user',
      content: body.question
    });

    const response = await getHiveNotes(body.question, body.threadId);

    await addConversationEntry({
      threadId: body.threadId,
      role: 'assistant',
      content: response
    });

    res.json({ response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

router.post('/', chatHandler);

export default router; 