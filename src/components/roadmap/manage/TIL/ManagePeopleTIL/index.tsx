import SearchSection from '@/components/Roadmap/manage/TIL/SearchSection';
import TILSection from '@/components/Roadmap/manage/TIL/TILSection';
import * as Styled from './style';

const ManagePeopleTIL = () => {
  return (
    <Styled.Root>
      <SearchSection />
      <TILSection />
    </Styled.Root>
  );
};

export default ManagePeopleTIL;
