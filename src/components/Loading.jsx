import { FadeLoader } from "react-spinners";
import style from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={style.loadingBox}>
      <p className={style.loadingText}>
        잠시만 기다려주세요.
      </p>
      <FadeLoader color="#5A38D4" />
    </div>
  );
}
