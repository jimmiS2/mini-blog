import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas 연결
const Mongo_URI =
    'mongodb+srv://gyfl23242:admin1234@cluster0.0k5oj.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0';

mongoose
    .connect(Mongo_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => {
        console.error('MongoDB Connection Error:', error);
    });

// 기본 라우트
app.get('/', async (req, res) => {
    res.status(200).send('Welcome');
});

// Mongoose 모델 정의
const PostSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        comments: [{ content: String }],
    },
    { collection: 'posts' }
);

// 몽고 DB 도큐먼트 객체
const Post = mongoose.model('Post', PostSchema);

app.get('/', async (req, res) => {
    res.status(200).send('Wellcome');
});

// 게시물 목록 조회
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find(); //posts 콜렉션의 모든 도큐먼트를 가져온다.
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 게시글 단건 조회
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post Not Found' });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ errer: err.message });
    }
});

// 게시글 추가
app.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        //새 도큐먼트 객체 만들기
        const newPost = new Post({ title, content, comments: [] });
        await newPost.save(); //도큐먼트 저장!
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ errer: err.message });
    }
});

// 게시물 수정
app.put('/potst/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const undatedPost = await post.findByIdAndUpdate(
            req.params.id,
            { title: content },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post Not Found' });
        }
        res.status(201).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 게시물 삭제
app.delete('/potst/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post Delete' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 댓글 추가
app.post('/posts/:id/comments', async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: 'Post Not Fount' });
        }

        post.comments.push({ content });
        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ errer: err.message });
    }
});

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error('Error:', err.stack); // 서버 터미널에 에러 로그 출력
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 블로그 REST API 서버 ${PORT}번 포트에서 실행 중...`);
});
