import { Button, Result } from "antd";
import { ResultStatusType } from "antd/es/result";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ErrorProps } from "../../models/Props";

const Error:React.FC<ErrorProps> = ({ status, title, subTitle }) => {
  const [params] = useSearchParams() ;
  const navigate = useNavigate();
  const statusParam = params.get("status") || status;
  const titleParam = params.get("title") || title;
  const subTitleParam = params.get("subTitle") || subTitle;
  const mainPage = params.get("location") === "homepage";
  return (
    <Result
      status={statusParam as ResultStatusType}
      title={titleParam}
      subTitle={subTitleParam}
      extra={
        !mainPage && (
          <Button className=" w-auto" type="primary" onClick={() => navigate("/")}>
            Повернутися на головну
          </Button>
        )
      }
    />
  );
};

export default Error;