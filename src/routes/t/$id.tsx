import { createFileRoute } from "@tanstack/react-router";
import { App } from "../../components/App";

export const Route = createFileRoute("/t/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <App id={id} />;
}
