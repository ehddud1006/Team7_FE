import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import Avatar from '@/components/common/Avatar';
import Flex from '@/components/common/Flex';
import GNB from '@/components/common/GNB';
import CategorySection from '@/components/main/CategorySection';
import History from '@/components/main/History';
import SearchBar from '@/components/main/SearchBar';
import TILSection from '@/components/main/TILSection';
import { useIntersectionObserver } from '@/hooks/common/useInterSectionObserver';
import { useGetTils } from '@/hooks/queries/til';

const Home = () => {
  const router = useRouter();
  const { tils, isLoading, fetchNextPage, hasNextPage } = useGetTils({ queryKey: [router.query] });
  const { ref, isVisible } = useIntersectionObserver();

  useEffect(() => {
    if (isVisible && hasNextPage) {
      fetchNextPage();
    }
  }, [isVisible, fetchNextPage, hasNextPage]);

  return (
    <>
      <GNB />
      <Root>
        <Inner>
          <LeftArea>
            <Avatar imageSize={240} iconName="ic_profile" />
            <SearchBar />
            <CategorySection />
          </LeftArea>

          <RightArea>
            <History />
            <TILSection tils={tils} isLoading={isLoading} />
            <ObserverInterSectionTarget ref={ref} />
          </RightArea>
        </Inner>
      </Root>
    </>
  );
};

export default Home;

const Root = styled.div``;

const Inner = styled(Flex)`
  max-width: 1440px;
  margin: 0 auto;
`;

const LeftArea = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.gray_500};

  padding: 2.5rem;
  height: 100vh;
`;

const RightArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 101vh;
  padding: 3.5rem 0 0 4.5rem;
`;

const ObserverInterSectionTarget = styled.div`
  width: 100%;
  height: 2.5rem;
`;
