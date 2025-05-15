# Hive Notes

Hive Notes is a retrieval-augmented generation (RAG) chatbot that transcribes handwritten notes and allows users to query those notes using natural language.

## Features
- **Digitization and semantic storage of handwritten notes**: Handwritten notes are transcribed using the OpenAI API and stored alongside vector embeddings that capture their meaning.
- **Retrieval-Augmented Generation**: When a user asks a question, the query is embedded and compared to stored note embeddings using vector similarity search. Relevant notes are retrieved and passed to an LLM to generate a contextual answer.
- **User-Friendly Interface**: A React-based frontend allows users to ask questions about their notes using natural language.

## Built With

- **[OpenAI API](https://platform.openai.com/docs/overview)** – for transcription and language generation when answering user questions
- **[Node.js](https://nodejs.org)** & **[Express](https://expressjs.com)** - backend server
- **[PostgreSQL](https://www.postgresql.org)** with **[pgvector](https://github.com/pgvector/pgvector)** - for storing conversations and embeddings, and performing vector similarity search
- **[Instructor](https://github.com/567-labs/instructor-js)** - for parsing and validating structured LLM output
- **[Zod](https://zod.dev/)** - for schema definition and validation
- **[React](https://reactjs.org)** - frontend UI