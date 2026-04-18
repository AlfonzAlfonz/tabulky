import { Button, Card } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutHeaderCells } from "@gravity-ui/icons";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-emerald-950 w-screen h-screen flex items-center justify-center">
      <Card>
        <Card.Header>
          <h1 className="flex items-center text-4xl">
            <LayoutHeaderCells
              width={64}
              height={64}
              className="text-emerald-800"
            />
            Tabulky
          </h1>
        </Card.Header>
        <Card.Content className="flex flex-col items-center">
          <Button size="lg" onClick={createTable}>
            Create a new table
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
}

const createTable = async () => {
  const res = await fetch("http://localhost:4000/api/create", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Response not OK");
  }

  const id = await res.text();

  window.location.href = window.location.href + "t/" + id;
};
