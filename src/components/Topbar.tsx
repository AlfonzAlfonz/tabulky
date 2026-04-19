import { Gear } from "@gravity-ui/icons";
import { Button, Card, Chip, Drawer, Input, Popover } from "@heroui/react";
import { PersonFill } from "@gravity-ui/icons";
import { NodesRight } from "@gravity-ui/icons";

interface Props {
  title: string;
}

export const Topbar = ({ title }: Props) => {
  return (
    <Card className="fixed top-0 right-0 w-max m-3 border">
      <Card.Header className="flex items-center flex-row gap-3 text-lg">
        <Input value={title} className="shadow-none text-lg p-1" />

        <Popover>
          <Popover.Trigger>
            <Button isIconOnly size="sm" variant="outline">
              <NodesRight />
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Dialog className="flex flex-col gap-2">
              <Popover.Heading className="text-lg">Share</Popover.Heading>

              <Input value={window.location.href} />
            </Popover.Dialog>
          </Popover.Content>
        </Popover>

        <Drawer>
          <Button isIconOnly size="sm" variant="outline">
            <Gear />
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content placement="right">
              <Drawer.Dialog>
                <Drawer.CloseTrigger /> {/* Optional: Close button */}
                <Drawer.Header>
                  <Drawer.Heading className="text-2xl">Settings</Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body>TBA</Drawer.Body>
                <Drawer.Footer>
                  <Button>Save</Button>
                </Drawer.Footer>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
        <Popover>
          <Popover.Trigger>
            <Chip variant="soft">
              <PersonFill width={12} />
              <Chip.Label>1</Chip.Label>
            </Chip>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Dialog className="flex flex-col gap-2 min-w-[256px]">
              <Popover.Heading className="text-lg">Users</Popover.Heading>

              <ul>
                <li className="flex items-center gap-2">
                  <PersonFill width={12} /> You
                </li>
              </ul>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </Card.Header>
    </Card>
  );
};
