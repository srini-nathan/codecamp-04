import Button01 from "../../commons/buttons/01/Button01";
import Input01 from "../../commons/inputs/Input01";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { schema } from "./Myform.validations";

export default function MyformUI(props) {
  const { handleSubmit, register, formState } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  return (
    <>
      <form onSubmit={handleSubmit(props.onClickLogin)}>
        이메일 : <Input01 aaa="text" bbb={register("myEmail")} />
        {/* 이메일: <input type="text" {...props.register("myEmail")} /> */}
        <div>{formState.errors.myEmail?.message}</div>
        비밀번호 : <Input01 aaa="password" bbb={register("myPassword")} />
        {/* 비밀번호: <input type="password" {...props.register("myPassword")} /> */}
        <div>{formState.errors.myPassword?.message}</div>
        <Button01 type="submit" name="로그인하기" isValid={formState.isValid} />
        {/* <button isValid={props.forState.isValid}>로그인하기</button> */}
      </form>
    </>
  );
}
