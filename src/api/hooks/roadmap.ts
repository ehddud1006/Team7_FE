import qs from 'qs';
import type { ParsedUrlQuery } from 'querystring';
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
  getRoadmapSteps,
  getRoadmapsMy,
  getRoadmaps,
  getRoadmapStepReference,
  postRoadmaps,
  getRoadmapGroupMember,
  getRoadmapGroupApply,
  patchRoadmapGroupMemberRole,
  deleteRoadmapGroupMember,
  postRoadmapGroupApplyAccept,
  deleteRoadmapGroupApplyReject,
  postRoadmapsGroupsParticipate,
  getRoadmapsById,
  postRoadmapsById,
  postGroupApply,
  postSteps,
  deleteSteps,
  patchSteps,
  patchRoadmaps,
  deleteRoadmaps,
  postReferences,
  deleteReferences,
  postTilyApply,
} from '@/api/roadmap';
import type {
  GetRoadmapsResponse,
  PostRoadmapsRequest,
  PostStepsRequest,
  Role,
  PostReferencesRequest,
} from '@/api/roadmap/type';
import { useToast } from '@/components/common/Toast/useToast';
import { useApiError } from '@/hooks/useApiError';

export const ROADMAP_QUERY_KEY = {
  all: ['roadmaps'],
  getRoadmapsMy: () => [...ROADMAP_QUERY_KEY.all, 'my'],
  getRoadmaps: () => [...ROADMAP_QUERY_KEY.all, 'list'],
  getRoadmapsById: (roadmapId: number) => [...ROADMAP_QUERY_KEY.all, roadmapId],
  getRoadmapsFiltered: (filters: ParsedUrlQuery) => [...ROADMAP_QUERY_KEY.getRoadmaps(), filters],
  getRoadmapSteps: 'getRoadmapSteps',
  getRoadmapStepReference: 'getRoadmapStepReference',
  getRoadmapGroupMember: 'getRoadmapGroupMember',
  getRoadmapGroupApply: 'getRoadmapGroupApply',
};

// 로드맵 - 공통

export const useGetRoadmapsMy = () => {
  const { data } = useQuery([ROADMAP_QUERY_KEY.getRoadmapsMy()], () => getRoadmapsMy());

  const categoryData = {
    category: data?.result.categories ?? [],
    roadmaps: [...(data?.result.roadmaps.tilys ?? []), ...(data?.result.roadmaps.groups ?? [])],
  };

  return {
    data: categoryData,
  };
};

export const useGetRoadmaps = (req: { query: ParsedUrlQuery }) => {
  const { query } = req;
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ROADMAP_QUERY_KEY.getRoadmapsFiltered(query),
    ({ pageParam: page = 0 }) => {
      const searchParams = { page, ...query };
      const data = getRoadmaps({ query: qs.stringify(searchParams, { addQueryPrefix: true }) });

      return data;
    },
    {
      getNextPageParam: (lastPage: GetRoadmapsResponse, pages) => {
        if (!lastPage.result.hasNext) {
          return undefined;
        }
        return pages.length;
      },
      keepPreviousData: true,
    },
  );

  return {
    data:
      data?.pages.flatMap((page) => {
        if (page.result === null) {
          return [];
        }
        return page.result?.roadmaps;
      }) ?? [],
    isLoading,
    fetchNextPage,
    hasNextPage,
  };
};

export const useGetRoadmapsMyList = () => {
  const { data, isLoading } = useQuery([ROADMAP_QUERY_KEY.getRoadmapsMy], () => getRoadmapsMy());
  return { groups: data?.result.roadmaps.groups, tilys: data?.result.roadmaps.tilys, isLoading };
};

export const useGetRoadmapSteps = (roadmapId: number) => {
  const enabled = roadmapId !== 0 && !!roadmapId;

  const { data, isLoading } = useQuery(
    [ROADMAP_QUERY_KEY.getRoadmapSteps, roadmapId],
    () => getRoadmapSteps(roadmapId),
    {
      enabled,
    },
  );

  return {
    steps: data,
    isLoading,
  };
};

export const useGetRoadmapStepReference = (req: { param: { stepId: number } }) => {
  const {
    param: { stepId },
  } = req;

  const enabled = !!stepId;

  const { data, isLoading } = useQuery(
    [ROADMAP_QUERY_KEY.getRoadmapStepReference, stepId],
    () => getRoadmapStepReference(req),
    {
      enabled,
    },
  );

  return {
    reference: data?.result,
    isLoading,
  };
};

// 로드맵 - 그룹

export const usePostRoadmaps = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { mutateAsync, isLoading } = useMutation(postRoadmaps);
  const { handleError } = useApiError();

  const postRoadmapsAsync = async (req: { body: PostRoadmapsRequest }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapsMy()]);
        toast.showBottom({
          message: '로드맵이 생성되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { postRoadmapsAsync, isLoading };
};

export const usePostRoadmapsById = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { handleError } = useApiError();
  const { mutateAsync, isLoading } = useMutation(postRoadmapsById);

  const postRoadmapsByIdAsync = async (req: { roadmapId: number; body: PostRoadmapsRequest }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapsById(req.roadmapId)]);
        toast.showBottom({
          message: '로드맵이 수정되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { postRoadmapsByIdAsync, isLoading };
};

export const useGetRoadmapsById = (req: { roadmapId: number }) => {
  const { roadmapId } = req;
  const enabled = roadmapId > 0;
  const { data, isLoading } = useQuery(ROADMAP_QUERY_KEY.getRoadmapsById(roadmapId), () => getRoadmapsById(req), {
    enabled,
  });

  return { data, isLoading };
};

export const usePostGroupApply = () => {
  const { mutateAsync, isLoading } = useMutation(postGroupApply);
  const toast = useToast();

  const postGroupApplyAsync = async (req: { roadmapId: number; body: { content: string } }) => {
    if (req.roadmapId > 0) {
      const data = await mutateAsync(req, {
        onSuccess: () => {
          toast.showBottom({
            message: '신청이 완료되었습니다.',
          });
        },
        onError: () => {
          toast.showBottom({
            message: '신청에 실패하였습니다.',
          });
        },
      });

      return data;
    } else return undefined;
  };

  return { postGroupApplyAsync, isLoading };
};

export const usePostTilyApply = () => {
  const { mutateAsync, isLoading } = useMutation(postTilyApply);

  const postTilyApplyAsync = async (req: { roadmapId: number }) => {
    const { roadmapId } = req;
    if (roadmapId > 0) {
      const data = await mutateAsync(req);

      return data;
    } else return undefined;
  };

  return { postTilyApplyAsync, isLoading };
};

export const useGetRoadmapGroupMember = (req: { roadmapId: number }) => {
  const { roadmapId } = req;

  const { data } = useQuery([ROADMAP_QUERY_KEY.getRoadmapGroupMember, roadmapId], () => getRoadmapGroupMember(req));

  const roleWeight = {
    master: 3,
    manager: 2,
    member: 1,
  };

  const members = data?.result.users.sort((a, b) => roleWeight[b.role] - roleWeight[a.role]) ?? [];

  return {
    members: members,
    myRole: data?.result.myRole,
  };
};

export const usePatchRoadmapGroupMemberRole = () => {
  const toast = useToast();
  const { mutateAsync } = useMutation(patchRoadmapGroupMemberRole);

  const patchRoadmapGroupMemberRoleAsync = async (req: {
    param: { roadmapId: number; userId: number };
    body: { role: Exclude<Role, null> };
  }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        toast.showBottom({
          message: '멤버 권한이 변경되었습니다.',
        });
      },
    });

    return data;
  };
  return { patchRoadmapGroupMemberRoleAsync };
};

export const useDeleteRoadmapGroupMember = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { mutateAsync } = useMutation(deleteRoadmapGroupMember);

  const deleteRoadmapGroupMemberAsync = async (req: { param: { roadmapId: number; userId: number } }) => {
    const {
      param: { roadmapId },
    } = req;

    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapGroupMember, roadmapId]);
        toast.showBottom({
          message: '멤버가 강퇴되었습니다.',
        });
      },
    });

    return data;
  };
  return { deleteRoadmapGroupMemberAsync };
};

export const useGetRoadmapGroupApply = (req: { roadmapId: number }) => {
  const { roadmapId } = req;

  const { data } = useQuery([ROADMAP_QUERY_KEY.getRoadmapGroupApply, roadmapId], () => getRoadmapGroupApply(req));

  return {
    members: data?.result.users ?? [],
  };
};

export const usePostRoadmapGroupApplyAccept = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(postRoadmapGroupApplyAccept);

  const postRoadmapGroupApplyAcceptAsync = async (req: { param: { roadmapId: number; userId: number } }) => {
    const {
      param: { roadmapId },
    } = req;

    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapGroupApply, roadmapId]);
      },
    });

    return data;
  };
  return { postRoadmapGroupApplyAcceptAsync };
};

export const useDeleteRoadmapGroupApplyReject = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation(deleteRoadmapGroupApplyReject);

  const deleteRoadmapGroupApplyRejectAsync = async (req: { param: { roadmapId: number; userId: number } }) => {
    const {
      param: { roadmapId },
    } = req;

    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapGroupApply, roadmapId]);
      },
    });

    return data;
  };
  return { deleteRoadmapGroupApplyRejectAsync };
};

export const usePostRoadmapsGroupsParticipate = () => {
  const { mutateAsync, isLoading, isError } = useMutation(postRoadmapsGroupsParticipate);
  const { handleError } = useApiError();
  const toast = useToast();

  const postRoadmapsGroupsParticipateAsync = async (req: { body: { code: string } }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        toast.showBottom({
          message: '로드맵에 참여되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { postRoadmapsGroupsParticipateAsync, isLoading, isError };
};

// STEP

export const usePostSteps = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { handleError } = useApiError();

  const { mutateAsync, isLoading } = useMutation(postSteps);

  const postStepsAsync = async (req: { body: PostStepsRequest }) => {
    const { body } = req;
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries(ROADMAP_QUERY_KEY.getRoadmapsById(body.roadmapId));
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapSteps, body.roadmapId]);
        toast.showBottom({
          message: 'STEP이 생성 되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { postStepsAsync, isLoading };
};

export const usePatchSteps = (roadmapId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { handleError } = useApiError();

  const { mutateAsync, isLoading } = useMutation(patchSteps);

  const patchStepsAsync = async (req: { stepId: number; body: Omit<PostStepsRequest, 'roadmapId'> }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries(ROADMAP_QUERY_KEY.getRoadmapsById(roadmapId));
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapSteps, roadmapId]);
        toast.showBottom({
          message: 'STEP이 수정 되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { patchStepsAsync, isLoading };
};

export const useDeleteSteps = (roadmapId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { handleError } = useApiError();

  const { mutateAsync, isLoading } = useMutation(deleteSteps);

  const deleteStepsAsync = async (req: { stepId: number }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries(ROADMAP_QUERY_KEY.getRoadmapsById(roadmapId));
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapSteps, roadmapId]);
        toast.showBottom({
          message: 'STEP이 삭제 되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { deleteStepsAsync, isLoading };
};

export const usePatchRoadmaps = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { handleError } = useApiError();

  const { mutateAsync, isLoading } = useMutation(patchRoadmaps);

  const patchRoadmapsAsync = async (req: { roadmapId: number; body: PostRoadmapsRequest }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapsMy()]);
        toast.showBottom({
          message: '로드맵이 수정 되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { patchRoadmapsAsync, isLoading };
};

export const useDeleteRoadmaps = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { handleError } = useApiError();

  const { mutateAsync } = useMutation(deleteRoadmaps);

  const deleteRoadmapsAsync = async (req: { roadmapId: number }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries([ROADMAP_QUERY_KEY.getRoadmapsMy()]);
        toast.showBottom({
          message: '로드맵이 삭제 되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { deleteRoadmapsAsync };
};

export const usePostReferences = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { handleError } = useApiError();

  const { mutateAsync, isLoading } = useMutation(postReferences);

  const postReferencesAsync = async (req: { body: PostReferencesRequest }) => {
    const { body } = req;
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries(ROADMAP_QUERY_KEY.getRoadmapsById(body.roadmapId));
        toast.showBottom({
          message: '참고자료가 생성 되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { postReferencesAsync, isLoading };
};

export const useDeleteReferences = (roadmapId: number) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { handleError } = useApiError();

  const { mutateAsync, isLoading } = useMutation(deleteReferences);

  const deleteReferencesAsync = async (req: { referenceId: number }) => {
    const data = await mutateAsync(req, {
      onSuccess: () => {
        queryClient.invalidateQueries(ROADMAP_QUERY_KEY.getRoadmapsById(roadmapId));
        toast.showBottom({
          message: '링크가 삭제 되었습니다.',
        });
      },
      onError: handleError,
    });

    return data;
  };

  return { deleteReferencesAsync, isLoading };
};
