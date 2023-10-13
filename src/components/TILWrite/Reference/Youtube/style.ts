import styled from '@emotion/styled';

export const Root = styled.div``;

export const ReferenceContainer = styled.button`
  display: flex;
  gap: 0.375rem;
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
`;

export const YoutubeContariner = styled.div<{ isOpen: boolean }>`
  margin-top: 0.5rem;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;
