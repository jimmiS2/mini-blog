import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; //하이퍼링크-바로가기
import styled from 'styled-components';
import Button from '../ui/Button';
import PostList from '../list/PostList';

//모든 콘텐츠를 감싸는 최상위 DIV
const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const Container = styled.div`
    width: 100%;
    max-width: 720px;
    display: flex;
    flex-direction: column;
`;

function MainPage() {
    //const [posts, setPosts] = useState(data);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:5000/posts'); // 백엔드 API 호출
                if (!response.ok) {
                    throw new Error('데이터를 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []); // 🚀 `useEffect` 내부에서 fetch 요청을 한 번만 실행하도록 수정

    return (
        <Wrapper>
            <Container>
                <Button
                    title="글 작성하기"
                    onClick={() => {
                        navigate('/post-write');
                    }}
                ></Button>

                <div style={{ height: '10px' }}></div>

                <PostList
                    posts={posts}
                    onClickItem={(item) => {
                        navigate(`/post/${item._id}`); //mongoDB의 _id를 사용함.
                    }}
                ></PostList>
            </Container>
        </Wrapper>
    );
}

export default MainPage;
