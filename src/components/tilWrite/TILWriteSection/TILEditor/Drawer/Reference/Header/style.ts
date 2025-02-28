import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const TitleContainer = styled.button`
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  & > img:hover {
    scale: 1.3;
  }

  & > div {
    @media ${({ theme }) => theme.mediaQuery.md} {
      display: none;
    }
  }
`;

export const Title = styled.h3`
  font-weight: 400;
  font-size: 1rem;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
