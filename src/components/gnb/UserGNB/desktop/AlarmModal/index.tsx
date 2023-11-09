import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetAlarms } from '@/api/hooks/user';
import { USER_QUERY_KEY } from '@/api/hooks/user';
import EmptyList from '@/components/common/EmptyList';
import { type ModalProps } from '@/components/common/Modal';
import Alarm from '@/components/gnb/common/Alarm';
import AlarmFooter from '@/components/gnb/common/AlarmFooter';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import * as Styled from './style';

interface AlarmModalProps extends ModalProps {
  alarmButtonRef: React.RefObject<HTMLButtonElement>;
}

const AlarmModal = (props: AlarmModalProps) => {
  const { isOpen, onClose, alarmButtonRef } = props;

  const ref = useRef<HTMLDivElement>(null);
  const { alarms } = useGetAlarms();
  const queryClient = useQueryClient();

  useOnClickOutside(ref, (event) => {
    // 유저가 헤더의 프로필이미지를 클릭하면 useOnClickOutside가 실행되고 다시 handleToggleAlarm가 실행되어서 알림창이 다시 열리는 현상이 발생함
    // 이를 방지하기 위해 알림창이 열려있는 상태에서 프로필이미지를 클릭하면 알림창이 닫히지 않도록 함
    if (!alarmButtonRef.current || alarmButtonRef.current.contains(event?.target as Node)) return;
    queryClient.invalidateQueries([USER_QUERY_KEY.alarm]);

    onClose?.();
  });

  if (!isOpen) return null;

  return (
    <Styled.Root
      ref={ref}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: { opacity: 1 },
        closed: { opacity: 0 },
      }}
      transition={{ type: 'tween', duration: 0.1 }}>
      <Styled.Header>알림</Styled.Header>

      <Styled.List>
        {alarms.length === 0 ? (
          <EmptyList image="ic_unAlarm" imageWidth={40} imageHeight={40}>
            <p>알림이 없습니다.</p>
          </EmptyList>
        ) : (
          alarms.map((alarm) => <Alarm key={alarm.id} alarm={alarm} />)
        )}
      </Styled.List>

      <AlarmFooter />
    </Styled.Root>
  );
};

export default AlarmModal;
