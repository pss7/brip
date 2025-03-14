import { FadeLoader } from "react-spinners";
import style from "./Loading.module.css";
import { useLoadingStore } from "../store/useLoadingStore";

export default function Loading({ fullScreen = false,  center = false}) {

  const { isLoading } = useLoadingStore();

  if (!isLoading) return null

  return (
    <div className={`${style.loadingBox} ${fullScreen ? style.fullScreen : ""} ${center ? style.center : ""}`}>
      {/* <p className={style.loadingText}>
        잠시만 기다려주세요.
      </p> */}
      <FadeLoader color="#5A38D4" />
    </div>
  );
}
