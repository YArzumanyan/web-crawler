import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      height: "100vh",
      justifyContent: "center"
    }}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}