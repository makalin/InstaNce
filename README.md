# InstaNce 📸  
*Instant AI-Powered Image Variations*

**InstaNce** is a modern web application with a **Node.js (Express.js)** backend that allows users to upload an image and generate multiple creative instances using the **OpenAI Image Generation API**. Perfect for dynamic moments, artistic variations, or simulating burst photography—all powered by AI.

---

## 🚀 Features
- 📂 Upload images via web UI with drag & drop support
- ⚡ Generate multiple AI-driven image variations
- 🤖 Seamless integration with OpenAI API
- 🎨 Download individual images or full batch
- 🌓 Dark/Light theme with automatic persistence
- 🖥️ Node.js + Express backend for fast API handling
- 🌐 Clean, responsive frontend

---

## 🧑‍💻 Tech Stack
- **Backend:** Node.js + Express.js  
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)  
- **AI Integration:** OpenAI Image Generation API  
- **File Handling:** Multer (for image uploads)  
- **Environment Config:** dotenv
- **Testing:** Jest + Supertest

---

## 🌟 Demo
🚧 *Live Demo Coming Soon*

---

## 🛠️ Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/makalin/InstaNce.git
cd InstaNce
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Environment Variables**  
Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

4. **Run the Application**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

5. **Run Tests**
```bash
npm test
```

Visit `http://localhost:3000` in your browser.

---

## ⚡ How It Works
1. Upload your base image via drag & drop or file selection
2. Choose the number of variations to generate
3. The backend sends requests to OpenAI with custom prompts
4. Receive AI-generated image instances
5. Download individual variations or the entire batch
6. Toggle between dark and light themes as needed

---

## 🔧 Roadmap
- [ ] GIF / MP4 export  
- [ ] Advanced AI prompt customization  
- [ ] Add style/theme presets  
- [ ] User session management  
- [ ] Deployment on Vercel/Heroku
- [ ] Image editing tools
- [ ] Batch processing
- [ ] API rate limiting
- [ ] User authentication

---

## 📄 License
MIT License

---

## 🙌 Author
Developed by **Mehmet Turgay Akalın**  
[GitHub](https://github.com/makalin) • [Website](https://desnd.com)

---

## 🚨 Note
You need an active **OpenAI API Key**.  
Get yours here → [OpenAI API Keys](https://platform.openai.com/account/api-keys)
