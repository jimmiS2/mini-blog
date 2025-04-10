/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
//import PostList from "../list/PostList";
import TextInput from '../ui/TextInput';
import Button from '../ui/Button';
//import data from "../../data.json";

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
    gap: 10px;
`;

const PostContainer = styled.div`
    padding: 8px 16px;
    border: 1px solid grey;
    border-radius: 8px;
`;

const TitleText = styled.p`
    font-size: 20px;
    font-weight: 500;
`;

const ContentText = styled.p`
    font-size: 16px;
    line-height: 32px;
    white-space: pre-wrap;
`;

const CommentLabel = styled.p`
    font-size: 16px;
    font-weight: 500;
`;

const CommentContainer = styled.div`
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 8px;
`;

function PostViewPage(props) {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/posts/${postId}`).then((data) => {
            if (data) {
                setPost(data);
            } else {
                console.error('Post not found');
            }
        });
    }, [postId]);

    const handleAddComment = () => {
        if (!comment) return;

        fetch(`http://localhost:5000/posts/${postId}/commments`, {
            method: 'POST',
            headers: { 'Content-Type': 'applicationn/json' },
            body: JSON.stringify({ content: comment }),
        })
            .then((res) => res.json())
            .then((updatedPosts) => {
                setPost(updatedPosts);
                setComment('');
            })
            .catch((err) => console.log('Error adding comment: ', err));
    };

    // 게시글 삭제
    const handleDeletePost = () => {
        fetch(`http://localhost:5000/posts/${postId}/commments`, {
            method: 'DELETE',
        })
            .then((res) => res.json())
            .then((meg) => {
                console.log(meg);
                navigate('/');
            })
            .catch((err) => console.error('Error deleting post', err));
    };

    if (!post) {
        console.log('포스트를 찾을 수 없습니다.');
        return <Wrapper>포스트를 찾을 수 없습니다.</Wrapper>;
    }

    return (
        <Wrapper>
            <Container>
                <Button
                    title="뒤로 가기"
                    onClick={() => {
                        navigate('/');
                    }}
                />

                <PostContainer>
                    <TitleText>{post.title}</TitleText>
                    <ContentText>{post.content}</ContentText>
                </PostContainer>

                {post.comments.length > 0 && <CommentLabel>댓글</CommentLabel>}
                {post.comments.map((comment) => (
                    <CommentContainer key={comment._id}>
                        <ContentText>{comment.content}</ContentText>
                    </CommentContainer>
                ))}
                <TextInput
                    height={40}
                    value={comment}
                    onChange={(event) => {
                        setComment(event.target.value);
                    }}
                />

                <Button title="댓글 작성하기" onClick={handleAddComment} />
                <Button title="포스트 삭제하기" onClick={handleDeletePost} />
            </Container>
        </Wrapper>
    );
}

export default PostViewPage;
