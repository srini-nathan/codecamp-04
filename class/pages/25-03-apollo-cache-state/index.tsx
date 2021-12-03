import { useQuery, gql, useMutation } from "@apollo/client";
import {
  IQuery,
  IQueryFetchBoardsArgs,
} from "../../src/commons/types/generated/types";

const FETCH_BOARD = gql`
  query fetchBoards {
    fetchBoards {
      _id
      writer
      title
      contents
    }
  }
`;

const DELETE_BOARD = gql`
  mutation deleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;

const CREATE_BOARD = gql`
  mutation createBoard($createBoardInput: CreateBoardInput!) {
    createBoard(createBoardInput: $createBoardInput) {
      _id
      writer
      title
      contents
    }
  }
`;

export default function ApolloCacheStatePage() {
  const { data } = useQuery<Pick<IQuery, "fetchBoards">, IQueryFetchBoardsArgs>(
    FETCH_BOARD
  );

  const [deleteBoard] = useMutation(DELETE_BOARD);
  const [createBoard] = useMutation(CREATE_BOARD);

  const onClickDelete = (boardId: string) => () => {
    // 삭제하기
    deleteBoard({
      variables: { boardId },
      update(cache, { data }) {
        const deletedId = data.deleteBoard; // 삭제된 게시글 ID (playground 확인)

        cache.modify({
          fields: {
            fetchBoards: (prev, { readField }) => {
              // 1. 기존의 fetchBoards 10개에서 방금 삭제한 ID를 제외한 9개를 만들기
              // 2. 그렇게 만들어진 9개의 새로운 fetchBoards 데이터를 돌려주기
              const newFatchBoards = prev.filter(
                (el) => readField("_id", el) !== deletedId
              ); // 10개

              return [...newFatchBoards];
              // return 변화될 데이터(fetchBoards)
            },
          },
        });
      },
    });
  };

  function onClickSubmit() {
    // 등록하기
    createBoard({
      variables: {
        createBoardInput: {
          writer: "민성",
          password: "asdasd",
          title: "제목입니다",
          contents: "내용입니다.",
        },
      },
      update(cache, { data }) {
        cache.modify({
          fields: {
            fetchBoards: (prev) => {
              // 추가된 createBoard 결과물과 이전의 10개를 합쳐서 11개로 돌려주기
              return [data.createBoard, ...prev];
              // return 변화될 데이터(fetchBoards)
            },
          },
        });
      },
    });
  }

  return (
    <>
      {data?.fetchBoards.map((el) => (
        <div key={el._id}>
          <span>{el.writer} </span>
          <span>{el.title} </span>
          <span>{el.contents} </span>
          <button onClick={onClickDelete(el._id)}>삭제하기</button>
        </div>
      ))}
      <button onClick={onClickSubmit}>등록하기</button>
    </>
  );
}
