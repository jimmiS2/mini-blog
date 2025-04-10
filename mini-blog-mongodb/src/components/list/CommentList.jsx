/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
//import React from "react";
import styled from 'styled-components';
import CommentListItem from './CommentListItem';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    aligh-items: flex-start;
    justify-content: center;

    & > * {
        :not(:last-child) {
            margin-bottom: 16px;
        }
    }
`;

function CommentList(props) {
    // eslint-disable-next-line react/prop-types
    const { comments } = props;

    return (
        <Wrapper>
            {comments.map((coment) => {
                return <CommentListItem key={coment._id} comment={comment} />;
            })}
        </Wrapper>
    );
}

export default CommentList;
