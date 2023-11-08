import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useGetRoadmapsById } from '@/api/hooks/roadmap';
import MobileSidebar from '@/components/common/MobileSidebar';
import Responsive from '@/components/common/Responsive';
import GNB from '@/components/gnb/UserGNB';
import SideBar from '@/components/roadmap/manage/common/DesktopManageBar';
import MobileManageBar from '@/components/roadmap/manage/common/MobileManageBar';

const ManageLayout = (props: PropsWithChildren) => {
  const { children } = props;

  const router = useRouter();
  const roadmapId = Number(router.query.roadmapId);

  const { data } = useGetRoadmapsById({ roadmapId });

  return (
    <>
      <GNB />
      <ManageLayoutContainer>
        <Responsive device="desktop">
          <ManageSideBarContainer>
            <SideBar />
          </ManageSideBarContainer>
        </Responsive>

        <MobileSidebar>
          <MobileManageBar />
          <h3>{data?.result.name}</h3>
        </MobileSidebar>
        <RightArea>{children}</RightArea>
      </ManageLayoutContainer>
    </>
  );
};

export default ManageLayout;

export const ManageLayoutContainer = styled.main`
  display: flex;
  height: 100%;
  max-width: 1440px;
  margin: 0 auto;

  @media ${({ theme }) => theme.mediaQuery.md} {
    flex-direction: column;
  }
`;

export const ManageSideBarContainer = styled.aside`
  position: sticky;
  top: ${({ theme }) => theme.layout.main.GNBHeight};
  width: 215px;
  height: ${({ theme }) => `calc(100vh - ${theme.layout.main.GNBHeight})`};
  border-right: 1px solid ${({ theme }) => theme.colors.gray_500};
`;

export const RightArea = styled.main`
  max-width: 1100px;
  width: 70vw;
  padding: 30px 0 0 30px;

  @media ${({ theme }) => theme.mediaQuery.md} {
    width: auto;
    padding: 0;
  }
`;
